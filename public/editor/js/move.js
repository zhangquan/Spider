(function () {


        var utils = play.utils,
            position = play.position,
            grid = play.grid,
            select = play.select,
            dom = play.dom,
            drag = play.drag,
            align = play.align,
            history = play.history;
       //move





        var left,
            top,
            marginTop,
            marginLeft,
            el,
            helper,

            target,
            axis,
            containment,
            moveable, oCood, target;


        var centerX = function (x) {
            return   x - target.width() / 2

        }
        var centerY = function (y) {
            return   y - target.height() / 2

        }


        var startDrag = function (startX, startY, target) {


            if (play.cmd != "select")return;



            if (!target.closest(select.selectedEL).length) return;

            if (target.closest("[contenteditable='true']").length) {
                return;
            }
            play.cmd = "move" ;
            play.doing = true;


            target = select.selectedEL;


            moveable = target.prop("moveable");

            if (!moveable)return;

            target = moveable && moveable.target || target;
            oCood = position.cood(target);


            //  $(iframe).css("pointer-events", "none");


        }
        var ondrag = function (startX, startY, endX, endY, target) {


            if (play.cmd != "move")return;

            if (!target.closest(select.selectedEL).length) return;
            if (target.closest("[contenteditable='true']").length) {
                return;
            }
            target = select.selectedEL;
            if (!moveable)return;

            var oldCood = {
                left: oCood.left + (endX - startX),
                top: oCood.top + (endY - startY),
                width: target.width(),
                height: target.height()
            }
            oldCood.right = oldCood.left + oldCood.width;
            oldCood.bottom = oldCood.top + oldCood.height;


            var parent = position.getFullInParent(oldCood, play.iframeDoc);


            align.start(oldCood, parent, moveable, select.selectedEL);
            var cood = align.cood;

            if (cood.x) {
                if (cood.x.position == 0) {
                    oldCood.left = cood.x.value
                } else if (cood.x.position == 1) {
                    oldCood.left = cood.x.value - el.width() / 2;
                }
                else if (cood.x.position == 2) {
                    oldCood.left = cood.x.value - el.width()
                }
            }

            if (cood.y) {
                if (cood.y.position == 0) {

                    oldCood.top = cood.y.value;

                } else if (cood.y.position == 1) {

                    oldCood.top = cood.y.value - select.selectedEL.height() / 2;

                }
                else if (cood.y.position == 2) {
                    oldCood.top = cood.y.value - select.selectedEL.height()
                }

            }


            if (moveable.axis == "x") {

                oldCood.top = oCood.top;
                oldCood.bottom = oCood.bottom;

            }
            if (moveable.axis == "y") {
                oldCood.left = oCood.left;
                oldCood.right = oCood.right;
            }


            if (moveable.containment) {

                var containCood = position.cood(moveable.containment);


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


            helper.position(oldCood);


            var parent = position.getFullInParent(oldCood, play.iframeDoc);


            select.selectParentEL(parent);


        }
        var endDrag = function (startX, startY, endX, endY, target, endTarget) {
            if (play.cmd != "move")return;




            if (!target.closest(select.selectedEL).length) return;

            if (target.closest("[contenteditable='true']").length) {
                return;
            }
            target = select.selectedEL;
            if (!moveable)return;


            align.stop()
            select.move();
            select.cancelHoverEL();
            select.unSelectParentEL()
            helper.hide();


            var oldCood = {
                left: oCood.left + (endX - startX),
                top: oCood.top + (endY - startY),
                width: target.width(),
                height: target.height()
            }



            oldCood.right = oldCood.left + oldCood.width;
            oldCood.bottom = oldCood.top + oldCood.height;

            var aCood = align.cood;

            if (aCood.x) {
                if (aCood.x.position == 0) {
                    oldCood.left = aCood.x.value
                } else if (aCood.x.position == 1) {
                    oldCood.left = aCood.x.value - el.width() / 2;
                }
                else if (aCood.x.position == 2) {
                    oldCood.left = aCood.x.value - el.width()
                }


            }

            if (aCood.y) {
                if (aCood.y.position == 0) {

                    oldCood.top = aCood.y.value;

                } else if (aCood.y.position == 1) {

                    oldCood.top = aCood.y.value - select.selectedEL.height() / 2;

                }
                else if (aCood.y.position == 2) {
                    oldCood.top = aCood.y.value - select.selectedEL.height()
                }

            }

            if (moveable.axis == "x") {

                oldCood.top = oCood.top;
                oldCood.bottom = oCood.bottom;

            }
            if (moveable.axis == "y") {
                oldCood.left = oCood.left;
                oldCood.right = oCood.right;
            }


            if (moveable.containment) {

                var containCood = position.cood(moveable.containment);

                if (oldCood.left < containCood.left) {
                    oldCood.left = containCood.left
                }
                if (oldCood.right > containCood.right) {
                    oldCood.left = containCood.right - oldCood.width;
                }
                if (oldCood.top < containCood.top) {
                    oldCood.top = containCood.top
                }
                if (oldCood.bottom > containCood.bottomb) {
                    oldCood.top = containCood.bottom - oldCood.height;
                }


            }


            dom.moveEl(target, oldCood);
            play.doing = false;
            play.cmd = "select" ;


        }

        $(document).on("iframeload", function(){
            helper = drag.createHelper();
            helper.css("cursor","move");
            drag.ondrag(play.iframeDoc, startDrag, ondrag, endDrag, play.iframeDoc);
        })


        $(document).on("iframeload", function () {


            //
            var timer;
            //left
            $([document, play.iframeDoc]).bind("keydown", "left", function (e) {


                if (!select.selectedEL)return;

                if (select.selectedEL && select.selectedEL.prop("contenteditable") == "true")return;
                e.preventDefault();

                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }

                timer = setTimeout(function () {
                    var cood = position.cood(select.selectedEL);
                    cood.left -= 1;

                    position.cood(select.selectedEL, cood);
                    select.selectEL(select.selectedEL)

                }, 10)


            })
            //right
            $([document, play.iframeDoc]).bind("keydown", "right", function (e) {


                if (!select.selectedEL)return;

                if (select.selectedEL && select.selectedEL.prop("contenteditable") == "true")return;
                e.preventDefault();

                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }

                timer = setTimeout(function () {
                    var cood = position.cood(select.selectedEL);
                    cood.left += 1;

                    position.cood(select.selectedEL, cood);
                    select.selectEL(select.selectedEL)

                }, 10)


            })
            //top
            $([document, play.iframeDoc]).bind("keydown", "up", function (e) {


                if (!select.selectedEL)return;

                if (select.selectedEL && select.selectedEL.prop("contenteditable") == "true")return;

                e.preventDefault();
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }

                timer = setTimeout(function () {
                    var cood = position.cood(select.selectedEL);
                    cood.top -= 1;

                    position.cood(select.selectedEL, cood);
                    select.selectEL(select.selectedEL)

                }, 10)


            })
            //bottom


            $([document, play.iframeDoc]).bind("keydown", "down", function (e) {


                if (!select.selectedEL)return;

                if (select.selectedEL && select.selectedEL.prop("contenteditable") == "true")return;
                e.preventDefault();

                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }

                timer = setTimeout(function () {
                    var cood = position.cood(select.selectedEL);
                    cood.top += 1;

                    position.cood(select.selectedEL, cood);
                    select.selectEL(select.selectedEL)

                }, 10)


            })

        })


    }
)();