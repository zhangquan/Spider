(function () {

    var utils = play.utils,
        position = play.position,
        dom = play.dom;


    var tmpl = '' +
        '<div class="select-mask">' +
        '<div class="s-top side"></div>' +
        '<div class="s-left side"></div>' +
        '<div class="s-right side"></div>' +
        '<div class="s-bottom side"></div>' +
        '<div class="h-top handle"></div>' +
        '<div class="h-bottom handle"></div>' +
        '<div class="h-left handle"></div>' +
        '<div class="h-right handle"></div>' +
        '</div>';
    var selectMask = {

        create: function () {
            var mask = $(tmpl);

            mask.appendTo($("#editor"));



            mask.css({
                position: "absolute",
                left: 0,
                top: 0,
                width: 0,
                height: 0
            })

            mask.hide();


            mask.select = function (el) {
                var cood = position.cood(el);

              /*  cood.left-=1;
                cood.top -=1;
                cood.height+=2;
                cood.width+=2;
                */

                var
                    t = mask.find(".s-top") ,
                    l = mask.find(".s-left") ,
                    r = mask.find(".s-right") ,
                    b = mask.find(".s-bottom");


                mask.show();

                mask.find(".side").show();

                var w = 2;
                //句柄

                var w2 = 8 ;


                position.cood(t, {
                    left: cood.left - w,
                    top: cood.top - w,
                    width: cood.width + w * 2,
                    height: w

                });


                position.cood(l, {
                    left: cood.left - w,
                    top: cood.top - w,
                    width: w,
                    height: cood.height + w * 2
                });
                position.cood(r, {
                    left: cood.width + cood.left,
                    top: cood.top - w,
                    width: w,
                    height: cood.height + w * 2
                });

                position.cood(b, {
                    left: cood.left - w,
                    top: cood.height + cood.top,
                    width: cood.width + w * 2,
                    height: w
                });




                if (el.prop("resizeable")) {

                    var resizeable = el.prop("resizeable")


                    var top = mask.find(".h-top");

                    var left = mask.find(".h-left");
                    var right = mask.find(".h-right");
                    var bottom = mask.find(".h-bottom");
                    if (!resizeable.axis) {
                        mask.find(".handle").show();
                    }
                    else if (resizeable.axis == "x") {
                        right.show();
                        left.show();
                    }
                    else if (resizeable.axis == "y") {
                        top.show();
                        bottom.show();
                    }

                    if (resizeable.bottom === false) {
                        bottom.hide();
                    }
                    if (resizeable.top === false) {
                        top.hide();
                    }
                    if (resizeable.left === false) {
                        left.hide();
                    }
                    if (resizeable.right === false) {
                        right.hide();
                    }

                    position.cood(top, {
                        left: cood.left + cood.width / 2 - w2 / 2,
                        top: cood.top - (w2+w)/2,
                        height: w2,
                        width: w2


                    })
                    position.cood(bottom, {
                        left: cood.left + cood.width / 2 - w2 / 2,
                        top: cood.height + cood.top +w - (w2)/2,
                        height: w2,
                        width: w2
                    })
                    position.cood(left, {
                        left: cood.left -  (w2+w)/2,
                        top: cood.top + cood.height / 2 - w2 / 2,
                        height: w2,
                        width: w2
                    })
                    position.cood(right, {
                        left: cood.left + cood.width+w-w2/2,
                        top: cood.top + cood.height / 2 - w2 / 2,
                        height: w2,
                        width: w2
                    })
                }


            }
            return mask;
        }



    }


    play.selectMask = selectMask;


})();