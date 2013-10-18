(function () {


    var utils = play.utils,
        position = play.position,
        grid = play.grid,
        select = play.select,
        history = play.history;


    var layoutParent = function (el) {
        /*
         var p = el.parents("p-layout");
         if (!p.length) p = $("body", $(el).get(0).ownerDocument);
         return  p;
         */

        var result;
        result = el.parents().filter(function (index) {
            if (select.isSelectable($(this)) || $(this).prop("tagName").toLowerCase() == "body") {

                return true;
            }


        })
        return result.eq(0);

    }


    var add = function (el, cood) {

        el = $(el);
        el.height(cood.height);
        el.width(cood.width);
        play.iframeWin.webc.upgrade(el.get(0));


        grid.add(el, cood);


        // 触发元素的resize的事件

        if (el.prop("resize")) {
            el.get(0).resize();
        }


        //  el.get(0).scrollIntoView();


        return el;
    };
    var _addNewEl = function (cood) {

        var el = $("<" + play.cmdArgs.tagName + "></" + play.cmdArgs.tagName + ">");
        if (play.cmdArgs.is) {
            el.attr("is", play.cmdArgs.is)

        }
        if (!el.get(0).__inserted__) {
            // if(globleStatus.position!=="static")

            el.css("position", globleStatus.position);

            var bgcolor = el.css("backgroundColor");


            if (!bgcolor || bgcolor == "transparent" || bgcolor == "rgba(0, 0, 0, 0)") {
              //  el.css("backgroundColor", "#fff")

            }

            el.get(0).__inserted__ = true;

        }

        return add(el, cood);
    };

    var addNewEl = function (cood) {


        var el = _addNewEl(cood);

        $(document).trigger("addNewEl", [el, cood])
        history.push("addNewEl", [el, cood], [el, cood])
        return   el;
    }


    var remove = function (target) {


        grid.remove(target);


    };
    var removeEl = function (target) {

        if (target.prop("removeable")) {
            target = $(target, play.iframeDoc);
            var cood = position.cood(target);
            remove(target);


            play.select.cancelSelectEL();
            play.select.cancelHoverEL();
          //  play.shortcutbar.hide();
            $(document).trigger("removeEl", [target, cood])
            history.push("removeEl", [target, cood], [target, cood])
        }


    };
    var move = function (target, cood) {

        target = $(target, play.iframeDoc);
        var options = target.prop("moveable");

        if (target.attr("data-align-x") == "center") {
            target.removeAttr("data-align-x");
        }

        if (!options.treeModify) {
            var next = target.next();
            if (next.length) position.record(next);
            position.offset(target, cood)
            if (next.length) position.revert(next);

        }
        else {
            remove(target);
            add(target, cood);


            return target


        }


    }


    var moveEl = function (target, cood) {
        target = $(target, play.iframeDoc);
        var oldCood = position.cood(target);
        move(target, cood)
        history.push("moveEl", [target, cood], [target, oldCood])
        $(document).trigger("moveEl", [target, cood])
        $(target).prop("moveCallback") && $(target).prop("moveCallback").apply(target, []);

    }

    var center = function (target) {

        if (target.attr("data-align-x") == "center") {


            target.css("marginLeft", "auto");
            target.css("marginRight", "auto");
        }

    }


    var resize = function (target, cood) {
        target = $(target, play.iframeDoc);
        var oldCood = position.cood(target);

        var options = options || target.prop("resizeable")

        if (!options.treeModify) {
            // var next = target.next();
            //if (next.length) position.record(next);

            position.cood(target, cood)
            // if (next.length) position.revert(next);
            center(play.select.selectedEL)

        }
        else {
            remove(target);
            add(target, cood)
            center(play.select.selectedEL)

            return target;
        }


    }
    var resizeEl = function (target, cood) {
        target = $(target, play.iframeDoc);
        var oldCood = position.cood(target);


        resize(target, cood)

        if (cood.width !== oldCood.width) {

            if (target.attr("data-width-auto")) {
                target.removeAttr("data-width-auto");
            }

        }
        else {
            if (target.attr("data-width-auto")) {
                play.alignEl.widthAuto(target);
            }

        }
        if (cood.height !== oldCood.height) {

            if (target.attr("data-height-auto")) {
                target.removeAttr("data-height-auto");
            }


        }
        else {
            if (target.attr("data-height-auto")) {
                play.alignEl.heightAuto(target);
            }
        }

        history.push("resizeEl", [target, cood], [target, oldCood])
        $(document).trigger("resizeEl", [target, cood]);
        $(target).prop("resizeCallback") && $(target).prop("resizeCallback").apply(target, []);

        $(target).trigger("resizeEl", [target, cood])

    }

    var _css = function (target, name, value) {
        target = $(target, play.iframeDoc);
        target.css(name, value);

    }
    var css = function (target, name, value) {
        target = $(target, play.iframeDoc);
        var oldValue = target.css(name);
        target.css(name, value);
        history.push("css", [target, name, value], [target, name, oldValue])
        $(document).trigger("cssChange", [target, name, value])
    }
    var _prop = function (target, name, value) {
        target = $(target, play.iframeDoc);
        var oldValue = target.prop(name)
        target.prop(name, value)

    }
    var prop = function (target, name, value) {
        target = $(target, play.iframeDoc);
        var oldValue = target.prop(name)
        target.prop(name, value)
        $(document).trigger("propChange", [target, name, value], [target, name, oldValue])
    }

    $(document).on("iframeload",function () {

        var iframeJquery = play.iframeWin.$;

        function initSet(link) {

            webc.importLink(link, function (el) {
                var name = $(el).attr("name");
                var title = $(el).attr("title");

                var html = '<div class="a-group ' + name + '" style="display: none">' +
                    '<h3>' + title + '</h3>' +

                    '<' + name + ' class="content"></' + name + '>' +
                    '</div>';
                var newSet = $(html);


                newSet.insertBefore($(".accordion").children().first())


                webc.upgradeDocument();
              //  $(".accordion").accordion("refresh");

                // $(".accordion").first().insertBefore($("<div></div>"));


            })
        }


        var reg = play.iframeWin.webc.registry;

        for (var p in reg) {
            if (reg[p].set) {

                initSet(reg[p].set)
            }

        }


        iframeJquery(play.iframeDoc).on("readyCallback", function (ev, target) {
            var reg = play.iframeWin.webc.registry;

            if (target.tagName.toLowerCase() == "p-element") {

                var setLink = $(target).attr("set")
                if (setLink) {
                    initSet(reg[p].set);
                }

            }



            $(target).css("display", "block")
            $(target).prop("moveable", {
                treeModify: true
            });
            $(target).prop("resizeable", true);
            $(target).prop("fixedable", true);
            $(target).prop("removeable", true);
            $(target).prop("parentable", true);

            if ($(target).prop("tagName").toLowerCase() != "p-element") {


                $(target).attr("cssupgrade", true);

            }

            if ($(target).prop("tagName").toLowerCase() == "p-text") {


                $(target).prop("editable", true);
                $(target).prop("parentable", false);


            }
            if ($(target).prop("tagName").toLowerCase() == "p-pic") {


                $(target).prop("parentable", false);


            }


        })

    })


    play.dom = {

        addNewEl: addNewEl,
        add: add,
        _addNewEl: _addNewEl,
        removeEl: removeEl,
        _removeEl: remove,
        moveEl: moveEl,
        _moveEl: move,
        resizeEl: resizeEl,
        _resizeEl: resize,
        css: css,
        _css: _css,
        prop: prop,
        _prop: _prop,
        layoutParent: layoutParent


    };

})();