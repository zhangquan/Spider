(function () {

    var select = play.select,
        position = play.position;

    var isDragging = false;


    var helper;


    var clone;
    var cloneTarget;


    var drag = {
        createHelper: function () {

            var el = $('<div></div>');

            el.css("top", "0")
            el.css("left", "0")
            el.css("width", "0")
            el.css("height", "0");
            el.css("border", "dashed 2px #2ebdff");
            el.css("position", "absolute");
            el.css("display", "none");

            el.css("zIndex", 10000)
            el.appendTo(play.container);


            el.position = function (cood) {
                cood.top -= 2;
                cood.left -= 2;
                cood.width += 4;
                cood.height += 4;

                el.show();
                position.cood(el, cood)


            }

            return el;


        },

        showClone: function (el, cood) {
            if (!clone) {
                cloneTarget = el;
                clone = el.clone();
                clone.css({
                    "position": "absolute",
                    top: "0",
                    left: "0",
                    zIndex: 1111,
                    //opacity:0.9,
                    overflow: "hidden"
                })

                clone.appendTo(play.container);
                position.cood(clone, cood);
                el.css("visibility", "hidden");

                select.selectedElDecoration.select(clone)


            }
            else {
                position.cood(clone, cood);
                select.selectedElDecoration.select(clone)

            }


        },
        hideClone: function () {
            if (clone) {
                cloneTarget.css("visibility", "");
                clone.remove();
                clone = false
            }
        },

        helperCood: function () {
            return position.cood(helper);
        },


        ondraw: function (el, startCallback, dragCallback, endCallback, doc) {


            var startX, startY, endX, endY;
            var status = 0;
            var start = 0;
            var timer;
            var target;
            var doc = doc || document;


            $(el).on('mousedown', function (ev) {


                //可编辑时不支持

                target = $(ev.target);
                if (target.closest("[contenteditable='true']").length) {
                    return;
                }


                startX = ev.pageX - $(doc).scrollLeft();
                startY = ev.pageY - $(doc).scrollTop();
                status = 1;


                if ($(target).parents("body").length == 0) {
                    target = $("body", doc);
                }


            });

            var _mousemove = function (ev) {


                if (ev.which != 1)return;

                if (status == 0) {
                    return;
                }


                if (timer) {

                    clearTimeout(timer);
                    timer = null;
                }

                $(document.body).addClass("dragging")
                timer = setTimeout(function () {
                    if (status == 1) {
                        isDragging = true;
                        select.stopHover();
                        startCallback && startCallback(startX, startY, target);
                        pfm.start("draw start")
                    }
                    status = 2;


                    endX = ev.iframeOffsetX || ev.pageX - $(doc).scrollLeft();
                    endY = ev.iframeOffsetY || ev.pageY - $(doc).scrollTop();
                    ;


                    dragCallback && dragCallback(startX, startY, endX, endY, target);


                }, 10)


            }
            var _mouseup = function (ev) {
                //  $(el).css("pointer-event","")


                if (timer) {

                    clearTimeout(timer);
                    timer = null;
                }

                if (status != 2) {
                    status = 0;
                    return;
                }

                status = 0;
                //    ev.preventDefault();
                endX = ev.iframeOffsetX || ev.pageX - $(doc).scrollLeft();
                endY = ev.iframeOffsetY || ev.pageY - $(doc).scrollTop();
                isDragging = false ;
                $(document.body).removeClass("dragging")
                setTimeout(function () {
                    select.startHover();

                    endCallback && endCallback(startX, startY, endX, endY, target)

                }, 10)

            }

            var docMousemove = function (ev) {

                ev.iframeOffsetX = ev.pageX - play.iframe.offset().left;
                ev.iframeOffsetY = ev.pageY - play.iframe.offset().top;


                _mousemove(ev)
            }

            var docMouseup = function (ev) {
                ev.iframeOffsetX = ev.pageX - play.iframe.offset().left;
                ev.iframeOffsetY = ev.pageY - play.iframe.offset().top;
                _mouseup(ev)
            }


            $(doc).on("mousemove", _mousemove)
            $(doc).on("mouseup", _mouseup)

            $(document).unbind("mousemove", docMousemove);
            $(document).unbind("mouseup", docMouseup);

            $(document).on("mousemove", docMousemove);

            $(document).on("mouseup", docMouseup);


        },

        ondrag: function (el, startCallback, dragCallback, endCallback, doc) {


            var startX, startY, endX, endY;
            var status = 0;
            var start = 0;
            var timer;
            var target;
            var doc = doc || play.iframeDoc;


            var mousedown = function (ev) {


                target = $(ev.target);

                if (target.closest("#editor").length) {
                    ev.iframeOffsetX = ev.pageX - play.iframe.offset().left;
                    ev.iframeOffsetY = ev.pageY - play.iframe.offset().top;
                }

                startX = ev.iframeOffsetX || ev.pageX - $(doc).scrollLeft();
                startY = ev.iframeOffsetY || ev.pageY - $(doc).scrollTop();
                status = 1;

                if (target.parents("body").length == 0) {
                    target = $("body", doc);
                }


            }

            var mousemove = function (ev) {

                if (ev.which != 1)return;

                if (status == 0) {
                    return;
                }


                if (status == 1) {
                    isDragging = true;
                    select.stopHover();
                    startCallback && startCallback(startX, startY, target);
                }
                status = 2;


                if (timer) {

                    clearTimeout(timer);
                    timer = null;
                }
               $(document.body).addClass("dragging")

                timer = setTimeout(function () {
                    endX = ev.iframeOffsetX || ev.pageX - $(doc).scrollLeft();
                    endY = ev.iframeOffsetY || ev.pageY - $(doc).scrollTop();
                    ;

                    dragCallback && dragCallback(startX, startY, endX, endY, target);
                }, 10)


            }

            var mouseup = function (ev) {
                //  $(el).css("pointer-event","")


                var endTarget = $(ev.target);

                if (timer) {
                    timer = null;
                    clearTimeout(timer);
                }

                if (status != 2) {
                    status = 0;
                    return;
                }


                status = 0;
                //   ev.preventDefault();
                endX = ev.iframeOffsetX || ev.pageX - $(doc).scrollLeft();
                endY = ev.iframeOffsetY || ev.pageY - $(doc).scrollTop();
                ;
                isDragging = false;

                $(document.body).removeClass("dragging")
                setTimeout(function () {
                    select.startHover();
                    endCallback && endCallback(startX, startY, endX, endY, target, endTarget)

                }, 10)

            }


            var docMousemove = function (ev) {

                ev.iframeOffsetX = ev.pageX - play.iframe.offset().left;
                ev.iframeOffsetY = ev.pageY - play.iframe.offset().top;


                mousemove(ev)
            }

            var docMouseup = function (ev) {
                ev.iframeOffsetX = ev.pageX - play.iframe.offset().left;
                ev.iframeOffsetY = ev.pageY - play.iframe.offset().top;
                mouseup(ev)
            }

            $(el).unbind("mousedown", mousedown)
            $(el).on('mousedown', mousedown);
            $(doc).on("mousemove", mousemove);
            $(doc).on("mouseup", mouseup);

            $(document).unbind("mousemove", docMousemove);
            $(document).unbind("mouseup", docMouseup);

            $(document).on("mousemove", docMousemove);

            $(document).on("mouseup", docMouseup);


        }
    }

    play.drag = drag;


})();