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

                    console.log("upgrade subtree", p, inElement)
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
                console.error(e.message)
            }

        }
        $(document).trigger("readyCallback", [inElement])
    }

    function implementCallback(inElement) {


        if (inElement.__implementCallback__) {


            inElement.__implementCallback__.apply(inElement, []);
            console.log("implementCallback")


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

        console.log(sheets.length, sheets.text())


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
            inElement.template = inElement.template.replace("<content></content>", content)


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


    function load(doc, callback) {
        doc = doc || document;
        var links = $("link[rel='import']", doc);

        var l = links.length - 1;

        if (l == -1) {
            callback && callback();
            return;
        }


        links.each(function (index, link) {


            if (link.__loaded__)return;
            link.__loaded__ = true;

            console.log("load " + link.href)
            $.get(link.href, function (resource) {


                var frag = $("<div></div>");
                frag.html(resource);

                console.log(frag)
                var innerLinks = $('link[rel="import"]', frag);
                console.log("length:" + innerLinks.length)

                var upgrade = function () {

                    var element = $("p-element", frag);
                    if (element.length) {

                        element.each(function (index, el) {
                            console.log("define " + $(el).attr("name"))
                            webc.upgrade(el);
                        })


                    }

                    if (l == index) {
                        callback && callback();
                    }
                }


                if (innerLinks.length == 0) {
                    console.log("update ")
                    upgrade();
                }
                else {
                    load(frag, function () {
                        upgrade();
                    })

                }


            })
        })

    }

    scope.load = load;
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
        webc.load(document, function () {
            console.log("update document--------------")
            webc.upgradeDocument();

            $(document.body).animate({
                opacity: 1
            })
        });
    })

})(window.webc);
