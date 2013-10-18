(function () {

    var position = play.position,
        select = play.select;


    var lineX = $('<div style="border-bottom:solid 1px greenyellow;z-index:100000;printer-event:none;height:0px;position:absolute"></div>');
    lineX.appendTo(play.container)
    var lineY = $('<div style="border-left:solid 1px greenyellow;z-index:100000;printer-event:none;width:0px;position:absolute"></div>');
    lineY.appendTo(play.container)
    var exports = {}
    exports.cood = {};

    var distance = 4;
    var showColumn = function (start, end) {
        if (start.y > end.y) {
            var temp = start.y;
            start.y = end.y;
            end.y = temp;
        }


        lineY.height(end.y - start.y);
        lineY.css("top", start.y);
        lineY.css("left", start.x - 1);
        lineY.show();


    }
    var hideColumn = function () {
        lineY.hide();


    }

    var hideRow = function () {
        lineX.hide();


    }

    var showRow = function (start, end) {
        if (start.x > end.x) {
            var temp = start.x;
            start.x = end.x;
            end.x = temp;
        }


        lineX.width(end.x - start.x);
        lineX.css("top", start.y);
        lineX.css("left", start.x);
        lineX.show();


    }


    var align = function (baseCood, context, option, except) {

        var l = baseCood.left;
        var c = l + baseCood.width / 2;
        var r = l + baseCood.width;


        var baseX = [l, c, r];
        var newCood = {};


        var t = baseCood.top;
        var m = t + baseCood.height / 2;
        var b = t + baseCood.height;
        var baseY = [t, m, b];

        var all = [context, document.body]

        context.children().each(function (index, el) {

            if (el.nodeType == 1) {

                if (select.isSelectable($(el)) && !$(el).is(except)) {
                    all.push(el);


                }
            }

        });

        all = $(all);
        var columnMath = false;
        var rowMath = false;
        all.each(function (index, el) {

            if ($(el).width() == 0 || $(el).height() == 0)return;

            if ($(el).is(select.selectedEL))    return;


            var tl = position.offset($(el)).left;
            var tc = tl + $(el).width() / 2;
            var tr = tl + $(el).width();

            var tX = [tl, tc, tr];

            var tt = position.offset($(el)).top;
            var tm = tt + $(el).height() / 2;
            var tb = tt + $(el).height()

            var tY = [tt, tm, tb];

            if (!option || !option.axis || option.axis == "x") {
                for (var i = 0; i < baseX.length; i++) {
                    for (var j = 0; j < tX.length; j++) {


                        if (Math.abs(baseX[i] - tX[j]) <= distance) {



                            columnMath = true;
                            showColumn({x: tX[j], y: baseY[1]}, {x: tX[j], y: tY[1]})
                            exports.cood.x = {
                                position: i,
                                value: tX[j]
                            }


                        }
                    }


                }
            }

            if (!option || !option.axis || option.axis == "y") {

                for (var i = 0; i < baseY.length; i++) {
                    for (var j = 0; j < tY.length; j++) {
                        if (Math.abs(baseY[i] - tY[j]) <= distance) {



                            rowMath = true;

                            showRow({x: baseX[1], y: tY[j]}, {x: tX[1], y: tY[j]})

                            exports.cood.y = {
                                position: i,
                                value: tY[j]
                            }


                        }
                    }


                }
            }


        })
        if (!columnMath) {
            hideColumn()
            delete exports.cood.x;
        }
        if (!rowMath) {
            hideRow();
            delete exports.cood.y;
        }
    }


    var status = 0;


    var start = function () {
        status = 1;
    }
    var stop = function () {
        status = 0;
        hideColumn()
        hideRow()
    }

    start();


    exports.start = function (baseCood, doc, option) {
        return;

        align(baseCood, doc, option);

    }
    exports.stop = stop ;


    play.align = exports;



})();