(function () {

    //画新元素

    var utils = play.utils,
        position = play.position,
        grid = play.grid,
        select = play.select,
        dom = play.dom,
        drag = play.drag,
        align = play.align,
        history = play.history;


    //resize

    var top, height, marginTop, el,
        sx, ex, sy, ey,
        target, resizeable, oCood, helper;
    var startDrag = function () {

        play.cmd = "resize";
        play.doing = true;

        resizeable = select.selectedEL.prop("resizeable");

        target = resizeable.target || select.selectedEL;

        oCood = position.cood(target);

        sx = oCood.left;
        sy = oCood.top;

        ex = oCood.right;
        ey = oCood.bottom;


    }
    var ondrag = function (startX, startY, endX, endY, starget) {
        if ($(starget).hasClass("h-top")) {
            sy = endY;
        }
        if ($(starget).hasClass("h-left")) {
            sx = endX;

            if ($(target).attr("data-align-x") == "center") {
                var dis = oCood.left - sx;
                ex = oCood.right + dis;

            }
        }
        if ($(starget).hasClass("h-right")) {
            ex = endX;
            if ($(target).attr("data-align-x") == "center") {
                var dis = ex - oCood.right;
                sx = oCood.left - dis;

            }
        }
        if ($(starget).hasClass("h-bottom")) {
            ey = endY;
        }
        var oldCood = position.toCood(sx, sy, ex, ey);

        var parent = position.getFullInParent(oldCood, play.iframeDoc);


        align.start(oldCood, parent, resizeable, target);

        var cood = align.cood;

        if (cood.x) {

            if (cood.x.position == 0) {
                if (ex < sx) {
                    ex = cood.x.value
                }
                else {
                    sx = cood.x.value
                }

            } else if (cood.x.position == 1) {


                if (ex > sx) {
                    ex = cood.x.value + (cood.x.value - sx)
                }
                else {
                    ex = cood.x.value - (sx - cood.x.value)
                }


            }
            else if (cood.x.position == 2) {
                if (ex < sx) {
                    sx = cood.x.value
                }
                else {
                    ex = cood.x.value
                }
            }
        }

        if (cood.y) {
            if (cood.y.position == 0) {

                if (ey < sy) {
                    ey = cood.y.value
                }
                else {
                    sy = cood.y.value
                }

            } else if (cood.y.position == 1) {
                if (ey > sy) {
                    ey = cood.y.value + (cood.y.value - sy)
                }
                else {
                    ey = cood.y.value - (sy - cood.y.value)
                }

            }
            else if (cood.y.position == 2) {
                if (ey < sy) {
                    sy = cood.y.value
                }
                else {
                    ey = cood.y.value
                }
            }

        }


        var oldCood = position.toCood(sx, sy, ex, ey)

        if (resizeable.axis == "x") {

            oldCood.top = oCood.top;
            oldCood.bottom = oCood.bottom;

        }
        if (resizeable.axis == "y") {
            oldCood.left = oCood.left;
            oldCood.right = oCood.right;
        }


        if (resizeable.containment) {

            var containCood = position.cood(resizeable.containment);


            if (oldCood.left < containCood.left) {
                oldCood.left = containCood.left
            }
            if (oldCood.right > containCood.right) {
                oldCood.left = containCood.right - oldCood.width;
            }
            if (oldCood.top < containCood.top) {
                oldCood.top = containCood.top
            }
            if (oldCood.bottom > containCood.bottom) {
                oldCood.top = containCood.bottom - oldCood.height;
            }


        }


        ;

        helper.position(oldCood)


        var parent = position.getFullInParent(oldCood, play.iframeDoc);

        select.selectParentEL(parent);

    }
    var endDrag = function (startX, startY, endX, endY) {

        helper.hide();
        align.stop()

        select.cancelHoverEL();
        select.unSelectParentEL();

        var cood = position.toCood(sx, sy, ex, ey);


        dom.resizeEl(target, cood, resizeable);
        play.doing = false;
        play.cmd = "select";


    }

    $(document).on("iframeload", function () {

        helper = drag.createHelper();
        helper.css("cursor","resize");

        drag.ondrag($(".handle"), startDrag, ondrag, endDrag, play.iframeDoc);

    })


})();