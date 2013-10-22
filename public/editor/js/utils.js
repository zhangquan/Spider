(function () {

    /*
     * jQuery plugin for intercepting paste text into iframe with design mode
     *
     * This is free software. You may distribute it under the terms of the
     * Poetic License. http://genaud.net/2005/10/poetic-license/
     *
     * (c) 2012 Jakub Jankiewicz
     */


    var utils = {
        isSelectable: function (el) {
            var iframe = $("iframe"),
                iframeWin = iframe.get(0).contentWindow;

            var selectable = el.prop("selectable");
            var tagName = el.prop("tagName");

            if (!tagName) return false;
            var isRegisted = iframeWin.webc.registry[tagName.toLowerCase()];
            var isEditable = el.prop("editable");
            var isMoveable = el.prop("moveable");
            var resizeable = el.prop("resizeable");

            var is = $(el).attr("is");


            var isExtend = iframeWin.webc.registry[is];


            if (selectable || isEditable || isMoveable || isRegisted || resizeable || isExtend) {

                return true;
            }
            else {
                return  false;
            }


        },
        isBeParentable: function (el) {


            return el.prop("parentable");


        },

        isStatic: function (el) {
            return el.css("position") == "static" || el.css("position") == "relative";
        },
        isText: function (el) {
            var result = false;
            if (el.attr("p-type") == "text") {
                return true;
            }
            var texts = ["p", "h3", "h1", "h2", "h4", "h5", "h6", "ul", "ol", "a", "b", "em", "ins", "pre", "span"];
            for (var i = 0; i < texts.length; i++) {
                if (texts[i] == $(el).get(0).tagName.toLowerCase()) {
                    result = true;
                    return;
                }
            }


        },
        isSection: function (el) {

            if (el.attr("p-type") == "section") {
                return true;
            }


        },
        isImg: function (el) {
            if (el.attr("p-type") == "img") {
                return true;
            }
            if ("img" == $(el).get(0).tagName.toLowerCase()) {
                return true;
            }
        },
        isLayout: function (el) {

            var tag = el.prop("tagName").toLowerCase();


            return  tag == "p-layout" || tag == "body";
        },
        isCollapse: function (el) {
            if (!this.isStatic(el))return false;
            if (el.attr("data-collapse")) {
                return false;
            }
            var parent = el.parent();
            var hasCss = function (el, css) {
                return    el.css(css) && el.css(css).indexOf("0") == -1
            }


            //first chilren
            if (parent.children().eq(0).is(el)) {

                if (hasCss(parent, "paddingTop"))return false;


                if (hasCss(parent, "borderTopWidth"))return false;


                if (hasCss(el, "borderTopWidth"))return false;

                if (hasCss(el, "marginTop")) {

                    return true;
                }


            }

            //上一个元素

            //parent


        },
        collapse: function (el) {
            if (this.isCollapse(el)) {
                el.parent().addClass("coll");
                el.parent().attr("data-coll", true)
            }
            else if (!this.isCollapse(el.parent().children().eq(0))) {

            }

        },
        path: function (el) {
            var p = el.get(0).tagName.toLowerCase();
            if (el.attr("id")) {
                p += "#" + el.attr("id")
            }
            if (el.attr("class")) {
                p += "." + $.trim(el.attr("class"))
            }


            return p;
        },

        sort: function (a) {


            var temp = 0;

            for (var i = 0; i < a.length; i++) {

                for (var j = i + 1; j < a.length; j++) {

                    if (a[i] > a[j]) {

                        temp = a[i];

                        a[i] = a[j];

                        a[j] = temp;

                    }

                }

            }

            return a;


        },
        XSort: function (a) {


            var temp = 0;

            for (var i = 0; i < a.length; i++) {

                for (var j = i + 1; j < a.length; j++) {

                    if ($(a[i]).offset().left > $(a[j]).offset().left) {

                        temp = a[i];

                        a[i] = $(a[j]);

                        a[j] = $(temp);

                    }

                }

            }

            return a;


        },

        YSort: function (a) {


            var temp = 0;

            for (var i = 0; i < a.length; i++) {

                for (var j = i + 1; j < a.length; j++) {

                    if ($(a[i]).offset().top > $(a[j]).offset().top) {

                        temp = a[i];

                        a[i] = $(a[j]);

                        a[j] = $(temp);

                    }

                }

            }

            return a;


        },


        path: function (el) {
            var p = el.get(0).tagName.toLowerCase();
            if (el.attr("id")) {
                p += "#" + el.attr("id")
            }
            if (el.attr("class")) {
                p += "." + $.trim(el.attr("class"))
            }


            return p;
        },
        isGrid: function (el) {
            return (el.attr("p-type") == "grid-row");
        },
        upload: function (callback) {

            this._callback = callback;

            $("#img-upload").trigger("click");


        },
        getRange: function (win) {
            var win = win || window;
            var selObj = win.getSelection();
            var range = selObj.getRangeAt(0);
            return range;
        },
        createStepRun: function (time) {


            return {


                run: function (fun, time) {


                    if (this.__timer) {
                        clearTimeout(this.__timer);
                        this.__timer = null;
                    }

                    this.__timer = setTimeout(fun, time || 200)


                }
            }


        }








    };


    // $('#img-upload').on('change', handleFileSelect);


    (function () {

        // Change this to the location of your server-side upload handler:

        $('#img-upload').fileupload({

            dataType: 'json',
            done: function (e, data) {

                utils._callback(data.result);
            },
            progressall: function (e, data) {

            }
        })


    })();


    play.utils = utils;




})();