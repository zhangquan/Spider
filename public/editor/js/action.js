define(["position", "select"], function (position, select) {

    play.animState = true;
    play.animEvent = "hover";

    var start = false;


    var currentAnim = {};


    var toPath = function (el) {

        gId(el);


        return "#" + el.attr("id");


    }

    var gId = function (el) {
        if (!el.attr("id")) {
            var id = new Date().getTime();

            el.attr("id", id);

            return id;
        }
        else {
            el.attr("id");
        }


    }

    var selectedEls = [];
    var cloneSelectEl;
    var oldSelectEl;

    var cloneSelect = function (el) {
        if (el.prop("__isClone__") == true)return;
        selectedEls.push(el);
        oldSelectEl = el;


        var cood = position.cood(el);
        cloneSelectEl = $(el).clone();
        cloneSelectEl.prop("__isClone__", true)
        el.css("visibility", "hidden");


        cloneSelectEl.css("position", "absolute");
        cloneSelectEl.css("zIndex", "10000");


        cloneSelectEl.appendTo(play.iframeDoc.body);
        position.cood(cloneSelectEl, cood);

        el.prop("__clone__", cloneSelectEl);

        play.select._selectEL(cloneSelectEl);
    }

    $(document).on("select", function (ev, el) {

        if (!start) return;
        cloneSelect(el);


    })
    $(document).on("cssChange", function (ev, el, name, value) {

        if (!start) return;
        //保存？
        var action = {

            cmd: "css",
            args: [toPath(oldSelectEl), name, value]
        };

        currentAnim.actions.push(action);

    })

    $(document).on("moveEl", function (ev, el, cood) {
        if (!start) return;

        var action = {

            cmd: "moveEl",
            args: [toPath(oldSelectEl), cood]
        };

        currentAnim.actions.push(action);


    })

    $(document).on("removeEl", function (ev, el, cood) {
        if (!start) return;

        var action = {

            cmd: "removeEl",
            args: [toPath(oldSelectEl), cood]
        };

        currentAnim.actions.push(action);


    })

    $(document).on("resizeEl", function (ev, el, cood) {

        if (!start) return;
        var action = {

            cmd: "resizeEl",
            args: [toPath(oldSelectEl), cood]
        };

        currentAnim.actions.push(action);


    })

    play.runEvent = function (json) {
        var actions = json.actions;

        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            var cmd = action.cmd;
            var args = action.args;


            parent.play.dom[cmd].apply(parent.play.dom, args);

        }


    }


    var exports = {
        start: function (type) {
            start = true;
            currentAnim = {
                actions: []
            };
            currentAnim.eventType = type;
            currentAnim.target = toPath(select.selectedEL);


            cloneSelect(select.selectedEL)
        },

        end: function () {
            start = false;

            var json = JSON.stringify(currentAnim);

            var run = function () {


            }


            var script = '$("' + currentAnim.target + '").on("' + currentAnim.eventType + '", ' +
                'function(){' +
                'var action = ' + json + ';' +
                'play.runEvent(action)' +
                '})'

            play.iframeWin.eval(script);

            var scriptEl = $("<script></script>");


            scriptEl.text(script);
            var id = gId(scriptEl);
            $(play.iframeDoc.body).append(scriptEl);

            for (var i = 0; i < selectedEls.length; i++) {
                selectedEls[i].css("visibility", "visible");
                //存储script引用。
                if (!selectedEls[i].__eventSript__)selectedEls[i].__eventSript__ = [];


                selectedEls[i].__eventSript__.push({
                    type: currentAnim.eventType,
                    scriptId: id
                })


                selectedEls[i].prop("__clone__").remove();
                selectedEls[i].prop("__clone__", null)


                play.select.selectEL($(currentAnim.target, play.iframeDoc))

            }


        }

    };
    play.action = exports;


    return exports;


})



