(function (scope) {

    if (!scope) {
        scope = window.webc = {flags: {}};
    }


    var registry = {},
        _ce = document.createElement,
        _createElement = function () {
            return  _ce.apply(document, arguments);
        }


    function register(inName, inOptions) {

        var definition = inOptions || {};
        if (!inName) {
            throw new Error('Name argument must not be empty');
        }
        definition.name = inName;


        resolveTagName(definition);
        resolveExtends(definition);


        registerDefinition(inName, definition);
        definition.ctor = function () {
            return document.createElement(inName);
        }


        return definition.ctor;
    }


    function resolveTagName(inDefinition) {

        inDefinition.tag = inDefinition.name;

    }

    function resolveExtends(inDefinition) {

        var pName = inDefinition.extends;

        var pDefinition = registry[pName] || {};


        for (var p in pDefinition) {
            if (!inDefinition[p]) {
                inDefinition[p] = pDefinition[p];
            }
        }

    }

    function registerDefinition(inName, inDefinition) {
        registry[inName] = inDefinition;
    }

    function walk(name, context, callback) {


        var define = registry[name];

        var tagName = define["extents"] || name;

        context = context || document;


        var els = context.getElementsByTagName(tagName);


        for (var i = 0; i < els.length; i++) {

            if (!$(els[i]).parents("template").length) {
                callback(els[i]);
            }

        }

    }

    function upgrade(inElement) {

        if (inElement.__upgraded__)return;


        if (!inElement.tagName)return;

        var name = inElement.tagName.toLowerCase();
        var is = inElement.getAttribute("is");

        if (is) {
            var inDefinition = registry[is];
            var parent = inDefinition.extends;
            if (inDefinition && name == parent) {
                implement(inElement, inDefinition);


                //如重新渲染innerHTML等
                implementCallback(inElement)
                // flag as upgraded

                //update subtree
                for (var p in registry) {

                    walk(p, inElement, function (el) {
                        upgrade(el);
                    })
                }
                inElement.__upgraded__ = true;


                ready(inElement);

            }


        }


        else {


            var inDefinition = registry[name];
            if (inDefinition) {

                implement(inElement, inDefinition);
                //如重新渲染innerHTML等
                implementCallback(inElement)

                // flag as upgraded

                //update subtree
                for (var p in registry) {


                    walk(p, inElement, function (el) {


                        upgrade(el);
                    })
                }

                inElement.__upgraded__ = true;


                ready(inElement);

            }

        }


        return inElement;
    }

    function implement(inElement, inDefinition) {
        for (var p in inDefinition) {
            Object.defineProperty(inElement, p, Object.getOwnPropertyDescriptor(inDefinition, p));
        }

    }

    document.createElement = function (name) {


        var element = _createElement.call(document, name);

        upgrade(element);
        return element;
    };

    var initialize = function () {


        for (var p  in registry) {

            walk(p, document, function (element) {
                upgrade(element);
            });
        }
    };

    if (document.readyState == 'complete') initialize();
    else document.addEventListener(document.readyState == 'interactive' ? 'readystatechange' : 'DOMContentLoaded', initialize);


    function ready(inElement) {

        if (inElement.readyCallback) {

            try {
                inElement.readyCallback.apply(inElement, []);
            } catch (e) {
                console.error(e.message, e.stack)
            }

        }
        $(document).trigger("readyCallback", [inElement])
    }

    function implementCallback(inElement) {


        if (inElement.__implementCallback__) {


            inElement.__implementCallback__.apply(inElement, []);



        }
    }

    $(document).ready(
        scope.ready = true
    )


    scope.registry = registry;

    scope.upgrade = upgrade;

    scope.upgradeDocument = function () {

        for (var p in registry) {

            walk(p, document, function (el) {

                upgrade(el);
            })
        }
    }

    scope.register = register


})(window.webc);

/**
 * template , content
 */
(function (scope) {

    scope.register("template")
    scope.register("content")
    scope.register("scripts")


})(window.webc);


/*
 * p-element
 * @todo p-element不需要update子节点。
 */

(function (scope) {


    var base = {


        __implementCallback__: function () {

            var host = this;

            var prototype = {}


            registerAttrs(this, prototype);
            registerSheets(this, prototype);
            registerTemplate(this, prototype);
            registerScripts(this, prototype);


            if (this.getAttribute("extends")) {
                prototype.extends = this.getAttribute("extends");
            }

            prototype.__implementCallback__ = function () {

                if (!$(this).attr("cssupgrade")) {

                    renderTemplate(this);
                }
            }


            webc.register(this.getAttribute("name"), prototype)

        }


    }

    scope.register("p-element", base);


    function registerAttrs(inElement, prototype) {
        var attrString = $(inElement).attr("attributes") || "";

        var attr = attrString.split(" ");

        for (var i = 0; i < attr.length; i++) {
            prototype[attr[i]] = {}
        }

        var attrs = $(inElement).get(0).attributes;
        for (var i = 0; i < attrs.length; i++) {

            prototype[attrs[i].name] = attrs[i].value
        }


    }

    function registerSheets(inElement, prototype) {

        return;
        var sheets = $("style", $(inElement));

        // console.log(sheets)



        $("head").append(sheets);


        /*移动时要clone 元素到编辑器环境，*/
        if (parent != window) {


            $("head", parent.document).append(sheets.clone());

        }
    }

    function registerTemplate(inElement, prototype) {
        var template = inElement.getElementsByTagName('template')[0];

        function supportsTemplate() {
            return 'content' in document.createElement('template');
        }

        if (supportsTemplate()) {
            var content = template.content

            var sheets = content.querySelectorAll("style");

            for (var i = 0; i < sheets.length; i++) {
                $("head").append(sheets[i]);
            }
            var d = $("<div></div>");
            d.append(content);

            prototype.template = d.html();
        } else {
            if (template) {
                var sheets = template.getElementsByTagName("style");


                if (sheets.length) {
                    $("head").append(sheets);
                }


                prototype.template = template.innerHTML;

            }
        }


    }

    function registerScripts(inElement, prototype) {

        var scripts = $("script, scripts", inElement);

        scripts.each(function (index, script) {
            script = $(script);
            if (script.text()) {

                var pro = eval(scripts.text());


                if (pro) {
                    for (var p in pro) {
                        prototype[p] = pro[p];
                    }

                }
            }
        })


    }


    function renderTemplate(inElement) {


        if (inElement.template) {
            var content = inElement.innerHTML;
            inElement.innerHTML = "";
            inElement.template = $.trim(inElement.template.replace("<content></content>", content))


            inElement.innerHTML = inElement.template;


        }
    }

    function installSheets(inElement) {
        var styles = $("style", inElement);
        $("head").append(styles);


    }

    // invoke inScript in inContext scope


})(window.webc);

//import
(function (scope) {



    /*
     * @todo 目前只支持绝对路径
     *
     * */

    /**
     *
     * todo 替换兼容forEach
     * @type {*}
     */

    var xhr = scope.xhr;
    var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

    var IMPORT_LINK_TYPE = 'import';
    var STYLE_LINK_TYPE = 'stylesheet';

    var loader;

    function isDocumentLink(elt) {
        return isLinkRel(elt, IMPORT_LINK_TYPE);
    }

    function isStylesheetLink(elt) {
        return isLinkRel(elt, STYLE_LINK_TYPE);
    }

    function isLinkRel(elt, rel) {
        return elt.localName === 'link' && elt.getAttribute('rel') === rel;
    }

    function isScript(elt) {
        return elt.localName === 'script';
    }

    function makeDocument(resource, url) {
        // create a new HTML document
        var doc = resource;
        if (!(doc instanceof Document)) {

            //@todo IE9以上支持。
            doc = document.implementation.createHTMLDocument(IMPORT_LINK_TYPE);
        }
        // cache the new document's source url
        doc._URL = url;
        if (!(resource instanceof Document)) {
            // install html
            doc.body.innerHTML = resource;
        }

        return doc;
    }

    /**
     * 加载link ,css,script
     * @type {{preloadSelectors: *, loader: Function, load: Function, preload: Function, filterMainDocumentNodes: Function, loaded: Function}}
     */
    var importer = {
        cache:{},
        documents:{},
        preloadSelectors: [
            'link[rel=' + IMPORT_LINK_TYPE + ']',
            'p-element link[rel=' + STYLE_LINK_TYPE + ']',

            'script[src]:not([type])',
            'script[src][type="text/javascript"]'
        ].join(','),

        loader: function (next) {
            // construct a loader instance
            loader = new Loader(importer.loaded, next);
            // alias the importer cache (for debugging)
            loader.cache = importer.cache;
            return loader;
        },
        load: function (doc, next) {
            // get a loader instance from the factory
            loader = importer.loader(next);
            // add nodes from document into loader queue
            importer.preload(doc);
        },
        preload: function (doc) {
            // all preloadable nodes in inDocument
            var nodes = doc.querySelectorAll(importer.preloadSelectors);
            // from the main document, only load imports
            // TODO(sjmiles): do this by altering the selector list instead
            nodes = this.filterMainDocumentNodes(doc, nodes);
            // extra link nodes from templates, filter templates out of the nodes list

            // add these nodes to loader's queue
            loader.addNodes(nodes);
        },

        filterMainDocumentNodes: function (doc, nodes) {
            if (doc === document) {
                nodes = Array.prototype.filter.call(nodes, function (n) {
                    return !isScript(n);
                });
            }
            return nodes;
        },
        loaded: function (url, elt, resource) {
            if (isDocumentLink(elt)) {
                var document = importer.documents[url];
                // if we've never seen a document at this url
                if (!document) {
                    // generate an HTMLDocument from data
                    document = makeDocument(resource, url);
                    // resolve resource paths relative to host document
                    // path.resolvePathsInHTML(document);
                    // cache document
                    importer.documents[url] = document;
                    // add nodes from this document to the loader queue
                    importer.preload(document);
                }
                // store import record
                elt.import = {
                    href: url,
                    ownerNode: elt,
                    content: document
                };
                // store document resource
                elt.content = resource = document;

            }
            // store generic resource
            // TODO(sorvell): fails for nodes inside <template>.content
            // see https://code.google.com/p/chromium/issues/detail?id=249381.
            elt.__resource = resource;
            // css path fixups
            // if (isStylesheetLink(elt)) {
            // path.resolvePathsInStylesheet(elt);
            //}
        }

    }

    var Loader = function (onLoad, onComplete) {
        this.onload = onLoad;
        this.oncomplete = onComplete;
        this.inflight = 0;
        this.pending = {};
        this.cache = {};
    };

    Loader.prototype = {
        addNodes: function (nodes) {
            // number of transactions to complete
            this.inflight += nodes.length;
            // commence transactions
            forEach(nodes, this.require, this);
            // anything to do?
            this.checkDone();
        },
        require: function (elt) {
            var url = path.nodeUrl(elt);
            // TODO(sjmiles): ad-hoc
            elt.__nodeUrl = url;
            // deduplication
            if (!this.dedupe(url, elt)) {
                // fetch this resource
                this.fetch(url, elt);
            }
        },
        dedupe: function (url, elt) {
            if (this.pending[url]) {
                // add to list of nodes waiting for inUrl
                this.pending[url].push(elt);
                // don't need fetch
                return true;
            }
            if (this.cache[url]) {
                // complete load using cache data
                this.onload(url, elt, loader.cache[url]);
                // finished this transaction
                this.tail();
                // don't need fetch
                return true;
            }
            // first node waiting for inUrl
            this.pending[url] = [elt];
            // need fetch (not a dupe)
            return false;
        },
        fetch: function (url, elt) {
            var receiveXhr = function (err, resource) {
                this.receive(url, elt, err, resource);
            }.bind(this);
            xhr.load(url, receiveXhr);
            // TODO(sorvell): blocked on
            // https://code.google.com/p/chromium/issues/detail?id=257221
            // xhr'ing for a document makes scripts in imports runnable; otherwise
            // they are not; however, it requires that we have doctype=html in
            // the import which is unacceptable. This is only needed on Chrome
            // to avoid the bug above.
            /*
             if (isDocumentLink(elt)) {
             xhr.loadDocument(url, receiveXhr);
             } else {
             xhr.load(url, receiveXhr);
             }
             */
        },
        receive: function (url, elt, err, resource) {
            if (!err) {
                loader.cache[url] = resource;
            }
            loader.pending[url].forEach(function (e) {
                if (!err) {
                    this.onload(url, e, resource);
                }
                this.tail();
            }, this);
            loader.pending[url] = null;
        },
        tail: function () {
            --this.inflight;
            this.checkDone();
        },
        checkDone: function () {
            if (!this.inflight) {
                this.oncomplete();
            }
        }
    };
    var URL_ATTRS = ['href', 'src', 'action'];
    var URL_ATTRS_SELECTOR = '[' + URL_ATTRS.join('],[') + ']';
    var URL_TEMPLATE_SEARCH = '{{.*}}';

    var path = {
        nodeUrl: function(node) {
            return path.resolveUrl(path.documentURL, path.hrefOrSrc(node));
        },
        hrefOrSrc: function(node) {
            return node.getAttribute("href") || node.getAttribute("src");
        },
        documentUrlFromNode: function(node) {
            return path.getDocumentUrl(node.ownerDocument || node);
        },
        getDocumentUrl: function(doc) {
            var url = doc &&
                // TODO(sjmiles): ShadowDOMPolyfill intrusion
                (doc._URL || (doc.impl && doc.impl._URL)
                    || doc.baseURI || doc.URL)
                || '';
            // take only the left side if there is a #
            return url.split('#')[0];
        },
        resolveUrl: function(baseUrl, url) {
            if (this.isAbsUrl(url)) {
                return url;
            }
            return this.compressUrl(this.urlToPath(baseUrl) + url);
        },
        resolveRelativeUrl: function(baseUrl, url) {
            if (this.isAbsUrl(url)) {
                return url;
            }
            return this.makeDocumentRelPath(this.resolveUrl(baseUrl, url));
        },
        isAbsUrl: function(url) {
            return /(^data:)|(^http[s]?:)|(^\/)/.test(url);
        },
        urlToPath: function(baseUrl) {
            var parts = baseUrl.split("/");
            parts.pop();
            parts.push('');
            return parts.join("/");
        },
        compressUrl: function(url) {
            var search = '';
            var searchPos = url.indexOf('?');
            // query string is not part of the path
            if (searchPos > -1) {
                search = url.substring(searchPos);
                url = url.substring(searchPos, 0);
            }
            var parts = url.split('/');
            for (var i=0, p; i<parts.length; i++) {
                p = parts[i];
                if (p === '..') {
                    parts.splice(i-1, 2);
                    i -= 2;
                }
            }
            return parts.join('/') + search;
        },
        makeDocumentRelPath: function(url) {
            // test url against document to see if we can construct a relative path
            path.urlElt.href = url;
            // IE does not set host if same as document
            if (!path.urlElt.host ||
                (path.urlElt.host === window.location.host &&
                    path.urlElt.protocol === window.location.protocol)) {
                return this.makeRelPath(path.documentURL, path.urlElt.href);
            } else {
                return url;
            }
        },
        // make a relative path from source to target
        makeRelPath: function(source, target) {
            var s = source.split('/');
            var t = target.split('/');
            while (s.length && s[0] === t[0]){
                s.shift();
                t.shift();
            }
            for(var i = 0, l = s.length-1; i < l; i++) {
                t.unshift('..');
            }
            var r = t.join('/');
            return r;
        },
        resolvePathsInHTML: function(root, url) {
            url = url || path.documentUrlFromNode(root)
            path.resolveAttributes(root, url);
            path.resolveStyleElts(root, url);
            // handle template.content
            var templates = root.querySelectorAll('template');
            if (templates) {
                forEach(templates, function(t) {
                    if (t.content) {
                        path.resolvePathsInHTML(t.content, url);
                    }
                });
            }
        },
        resolvePathsInStylesheet: function(sheet) {
            var docUrl = path.nodeUrl(sheet);
            sheet.__resource = path.resolveCssText(sheet.__resource, docUrl);
        },
        resolveStyleElts: function(root, url) {
            var styles = root.querySelectorAll('style');
            if (styles) {
                forEach(styles, function(style) {
                    style.textContent = path.resolveCssText(style.textContent, url);
                });
            }
        },
        resolveCssText: function(cssText, baseUrl) {
            return cssText.replace(/url\([^)]*\)/g, function(match) {
                // find the url path, ignore quotes in url string
                var urlPath = match.replace(/["']/g, "").slice(4, -1);
                urlPath = path.resolveRelativeUrl(baseUrl, urlPath);
                return "url(" + urlPath + ")";
            });
        },
        resolveAttributes: function(root, url) {
            // search for attributes that host urls
            var nodes = root && root.querySelectorAll(URL_ATTRS_SELECTOR);
            if (nodes) {
                forEach(nodes, function(n) {
                    this.resolveNodeAttributes(n, url);
                }, this);
            }
        },
        resolveNodeAttributes: function(node, url) {
            URL_ATTRS.forEach(function(v) {
                var attr = node.attributes[v];
                if (attr && attr.value &&
                    (attr.value.search(URL_TEMPLATE_SEARCH) < 0)) {
                    var urlPath = path.resolveRelativeUrl(url, attr.value);
                    attr.value = urlPath;
                }
            });
        }
    };

    path.documentURL = path.getDocumentUrl(document);
    path.urlElt = document.createElement('a');

    xhr = xhr || {
        async: true,
        ok: function(request) {
            return (request.status >= 200 && request.status < 300)
                || (request.status === 304)
                || (request.status === 0);
        },
        load: function(url, next, nextContext) {
            var request = new XMLHttpRequest();
            if (scope.flags.debug || scope.flags.bust) {
                url += '?' + Math.random();
            }
            request.open('GET', url, xhr.async);
            request.addEventListener('readystatechange', function(e) {
                if (request.readyState === 4) {
                    next.call(nextContext, !xhr.ok(request) && request,
                        request.response || request.responseText, url);
                }
            });
            request.send();
            return request;
        },
        loadDocument: function(url, next, nextContext) {
            this.load(url, next, nextContext).responseType = 'document';
        }
    };


    /**
     * importerParse
     *
     */

    var IMPORT_LINK_TYPE = 'import';

// highlander object for parsing a document tree

    var importParser = {
        selectors: [
            'link[rel=' + IMPORT_LINK_TYPE + ']',
            'link[rel=stylesheet]',
            'style',
            'script:not([type])',
            'script[type="text/javascript"]',
            'p-element'
        ],
        map: {
            link: 'parseLink',
            script: 'parseScript',
            style: 'parseGeneric',
            "p-element": "parseElement"
        },
        parse: function (inDocument) {
            if (!inDocument.__importParsed) {
                // only parse once
                inDocument.__importParsed = true;
                // all parsable elements in inDocument (depth-first pre-order traversal)
                var elts = inDocument.querySelectorAll(importParser.selectors);

                // for each parsable node type, call the mapped parsing method
                forEach(elts, function (e) {
                    importParser[importParser.map[e.localName]](e);
                });
            }
        },
        parseElement: function (elt) {



            webc.upgrade(elt);


        },
        parseLink: function (linkElt) {
            if (isDocumentLink(linkElt)) {

                if (linkElt.content) {
                    importParser.parse(linkElt.content);
                }
            } else {
                this.parseGeneric(linkElt);
            }
        },
        parseGeneric: function (elt) {
            if (needsMainDocumentContext(elt)) {
                document.head.appendChild(elt);
            }
        },
        parseScript: function (scriptElt) {
            if (needsMainDocumentContext(scriptElt)) {
                // acquire code to execute
                var code = (scriptElt.__resource || scriptElt.textContent).trim();
                if (code) {
                    // calculate source map hint
                    var moniker = scriptElt.__nodeUrl;
                    if (!moniker) {
                        var moniker = path.documentUrlFromNode(scriptElt);
                        // there could be more than one script this url
                        var tag = '[' + Math.floor((Math.random() + 1) * 1000) + ']';
                        // TODO(sjmiles): Polymer hack, should be pluggable if we need to allow
                        // this sort of thing
                        var matches = code.match(/Polymer\(['"]([^'"]*)/);
                        tag = matches && matches[1] || tag;
                        // tag the moniker
                        moniker += '/' + tag + '.js';
                    }
                    // source map hint
                    code += "\n//# sourceURL=" + moniker + "\n";
                    // evaluate the code
                    eval.call(window, code);
                }
            }
        }
    };


    function isDocumentLink(elt) {
        return elt.localName === 'link'
            && elt.getAttribute('rel') === IMPORT_LINK_TYPE;
    }

    function needsMainDocumentContext(node) {
        // nodes can be moved to the main document:
        // if they are in a tree but not in the main document and not children of <element>
        return node.parentNode && !inMainDocument(node)
            && !isElementElementChild(node);
    }

    function inMainDocument(elt) {
        return elt.ownerDocument === document ||
            // TODO(sjmiles): ShadowDOMPolyfill intrusion
            elt.ownerDocument.impl === document;
    }

    function isElementElementChild(elt) {
        return elt.parentNode && elt.parentNode.localName === 'element';
    }

// exports

    scope.parser = importParser;
    scope.importer = importer;



    function importLink(href, callback) {
        $.get(href, function (resource) {


            var frag = $(resource);


            var links = $("link[rel='import']", frag);

            var upgrade = function () {

                var element = frag.filter("p-element");
                if (element.length) {

                    element.each(function (index, el) {

                        webc.upgrade(el);
                    })


                }


                callback && callback(element)

            }


            if (links.length == 0) {
                upgrade();
            }
            else {
                load(frag, function () {
                    upgrade();
                })

            }


        })

    }




    scope.importLink = importLink;

})(window.webc);

//bootstrap
(function (scope) {

// FOUC prevention tactic
    var style = document.createElement('style');
    style.textContent = 'body {opacity: 0;}';
    var head = document.querySelector('head');
    head.insertBefore(style, head.firstChild);


    $(document).ready(function () {
        webc.importer.load(document, function () {
            webc.parser.parse(document);
            console.log("update document--------------")

            webc.upgradeDocument();

            $(document.body).animate({
                opacity: 1
            })

            $(document).trigger("webcReady");
        });
    })

})(window.webc);
