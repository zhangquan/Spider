(function (utils) {

    var utils = play.utils;
    //和位置相关的方法
    var position = {
        //保存现在的位置，当元素的定位因其它原因发生改变时，以便恢复原来位置
        record: function (el) {
            el.get(0)._cooder = position.cood(el);
        },
        //恢复原来的位置
        revert: function (el) {
            position.cood(el, el.get(0)._cooder);
            //同时更新记录
            el.get(0)._cooder = position.cood(el);

        },


        //判断某个元素的中心点是不是在另一个元素的里面
        isIn: function (parent, x, y) {


            if (x < ex && x > sx && y > sy && y < ey) {
                return true;
            }
            else return false;


        },
        isCenterIn: function (parent, tCood) {

            var pCood = position.cood($(parent));


            if (pCood.bottom > tCood.bottom && tCood.top < pCood.bottom) {
                return true;
            }


        },

        //判断 一个元素是不是完全被另一个元素包围
        isFullIn: function (parent, cood) {
            if (parent.attr) {
                var coo = position.cood(parent)
                var sx = coo.left;
                var ex = coo.right;
                var sy = coo.top;
                var ey = coo.bottom;


            }
            else {

                var sx = parent.left;
                var ex = parent.right;
                var sy = parent.top;
                var ey = parent.bottom;
            }


            if ((cood.left - sx) >= -10 && cood.right <= ex && (cood.top - sy) >= -10 && cood.bottom <= ey) {

                return true;
            }
            else return false;
        },


        //遍历节点，查找第一个完全包围某个区域的元素
        getFullInParent: function (cood, doc) {

            var doc = play.iframeDoc;

            var result = $(doc.body);


            var walk = function (p) {
                if (!p)return;
                var children = p.children();
                children.each(function (index, el) {
                    var child = $(el);


                    //忽略非布局元素


                    if (position.isFullIn(child, cood)) {

                        if (utils.isGrid(child) || (!utils.isBeParentable(child))) {
                            walk(child);
                        }
                        else {


                            result = child;
                            walk(child);
                        }

                    }
                })
            }


            walk(result);


            /*
             if (result.is($(doc.body))) {

             if (this.isCenterIn($("#header-", doc), cood)) {
             result = $("#header", doc)
             }
             else if (this.isCenterIn($("#body", doc), cood)) {
             result = $("#body", doc)
             }
             else if (this.isCenterIn($("#footer", doc), cood)) {
             result = $("#footer", doc)
             }


             }
             */
            if (result.is($(doc.body))) {
                result = $("#body-center", doc)
            }


            return result;

        },
        getChildrenByCood: function (parentCood, doc) {
            doc = doc || document;

            var result = [];
            var f = function (p) {
                var children = p.children();
                for (var i = 0; i < children.length; i++) {


                    if (position.isFullIn(parentCood, $(children[i]))) {

                        return  result.push($(children[i]))
                    }
                    else {
                        f($(children[i]))
                    }

                }
            }
            f($(doc))
            return result;
        },
        getInsertBeforeEl: function (cood, parent) {

        },
        getAlign: function (el) {
            var align = {
                x: "left",
                xName: "marginLeft",
                y: "top",
                yName: "marginTop"
            }

            if (utils.isStatic(el) && (el.css("display") == "block" || el.css("float") != "none")) {

                if (el.attr("data-align-x") == "right") {
                    align.x = "right";
                    align.xName = "marginRight"
                }


                if (el.attr("data-align-y") == "bottom") {
                    align.y = "bottom";
                    align.yName = "marginBottom"
                }


            } else if (utils.isStatic(el)) {

                //inline

            } else {
                align = {
                    x: "left",
                    xName: "left",
                    y: "top",
                    yName: "top"
                }
                if (el.attr("data-align-x") == "right") {
                    align.x = "right";
                    align.xName = "right"
                }
                if (el.attr("data-align-y") == "bottom") {
                    align.x = "bottom";
                    align.yName = "bottom"
                }
            }

            return align;


        },
        offset: function (el, cood) {
            if (arguments.length == 1) {


                if (el.parents(play.container).length) {

                    var offset = el.offset();
                    var psOffset = $(play.container).offset();
                    offset.top = offset.top - psOffset.top
                    offset.left = offset.left - psOffset.left
                }
                else {
                    var offset = el.offset();

                    offset.top = offset.top - $(el.get(0).ownerDocument).scrollTop()
                    offset.left = offset.left - $(el.get(0).ownerDocument).scrollLeft()
                }

                return offset;

            }
            if (!el.parents(play.container).length) {

                //@todo
                //   cood.top = cood.top + $(el.get(0).ownerDocument).scrollTop()
                //  cood.left = cood.left + $(el.get(0).ownerDocument).scrollLeft()


            }


            var allWidth = position.cood($(document.documentElement));
            var align = this.getAlign(el);
            if (align.x == "left") {
                el.css("margin", 0)

            }


            var of = this.offset(el);
            var isX = of.left - cood.left


            if (isX != 0) {
                var clear = {};
                clear[align.xName] = 0;
                el.css(clear);


                var offset = position.offset(el);
                if (align.x == "left") {
                    var left = offset.left;
                    var marginLeft = cood.left - left;
                    el.css(align.xName, marginLeft)

                } else if (align.x == "right") {
                    var left = offset.left;
                    var marginRight = left - cood.left;
                    el.css(align.xName, marginRight);
                }

            }
            var of = this.offset(el);

            var isY = of.top - cood.top;

            if (isY != 0) {
                var clear = {};
                clear[align.yName] = 0;
                el.css(clear);


                var offset = position.offset(el);
                if (align.y == "top") {
                    var top = offset.top;
                    var marginTop = cood.top - top;
                    el.css(align.yName, marginTop)

                } else if (align.y == "bottom") {
                    var top = offset.top;
                    var marginTop = top - cood.top;
                    el.css(align.xName, marginTop)
                }
            }


            return;

        },
        cood: function (el, cood) {
            if (arguments.length == 1) {
                var offset = this.offset(el);
                offset.width = el.outerWidth();
                offset.height = el.outerHeight();

                offset.right = offset.left + offset.width;
                offset.bottom = offset.top + offset.height;

                return offset;

            }


            var records = el.parent().children().not(el)

            el.outerWidth(cood.width)
            el.outerHeight(cood.height);


            this.offset(el, cood);

        },
        size: function (el, cood) {
            if (arguments.length == 1) {
                var offset = {};
                offset.width = el.outerWidth();
                offset.height = el.outerHeight();
                return offset;

            }

            el.outerWidth(cood.width)
            el.outerHeight(cood.height)

        },
        moveTo: function (el, startX, startY) {
            var offset = el.offset(), top = offset.top, left = offset.left;

            var isX = left - startX;
            var isY = top - startY;
            if (isX != 0) {
                el.css({

                    marginLeft: 0,

                    left: 0
                })
            }
            if (isY != 0) {
                el.css({
                    marginTop: "0",

                    top: 0

                })
            }


            var offset = el.offset(), top = offset.top, left = offset.left;
            var marginTop = startY - top;
            var marginLeft = startX - left;
            if (el.css("position") && (el.css("position") === "static")) {
                if (isY != 0) {
                    if ($(el).css("display") == "block")    el.css("marginTop", marginTop);
                }
                if (isX != 0)    el.css("marginLeft", marginLeft);
            }
            else {
                if (isY != 0)   el.css("top", marginTop);
                if (isX != 0)    el.css("left", marginLeft);
            }
        },
        toCood: function (sx, sy, ex, ey) {
            var cood = {};
            var temp;
            if (sx > ex) {
                temp = sx;
                sx = ex;
                ex = temp;
            }
            if (sy > ey) {
                temp = sy;
                sy = ey;
                ey = temp

            }

            cood.left = sx;
            cood.top = sy;
            cood.width = ex - sx;
            cood.height = ey - sy;
            cood.right = ex;
            cood.bottom = ey;


            return cood;

        },
        isHorizontal: function (target, base) {
            var xsort = utils.XSort([target, base]);
            var frist = xsort[0];
            var second = xsort[1];
            var bOffset = frist.offset(),
                bTop = bOffset.top,
                bMiddle = bTop + frist.height() / 2,
                bBottom = bTop + frist.height();

            var tOffset = second.offset(),
                tTop = tOffset.top,
                tMiddle = tTop + second.height() / 2,
                tBottom = tTop + second.height();


            var fristRight = frist.offset().left + frist.width();
            var secondLeft = second.offset().left;

            var isV = true;
            if (utils.isGrid(target) || utils.isGrid(base)) {
                isV = false;
            } else if ((fristRight < secondLeft)) {
                isV = false;
            }

            if (((bMiddle < tBottom && bMiddle > tTop) || (tMiddle < bBottom && tMiddle > bTop)) && !isV) {
                return true;
            }

        },
        isV: function (target, base) {
            var bOffset = base.offset(),
                bLeft = bOffset.left,
                bCenter = bLeft + base.width() / 2,
                bRight = bLeft + base.width();

            var tOffset = target.offset(),
                tLeft = tOffset.left,
                tCenter = tLeft + target.width() / 2,
                bRight = tLeft + target.width();

            if (((bCenter < bRight && bCenter > tLeft) || (tCenter < bRight && tCenter > bLeft)) && !position.isHorizontal(target, base)) {
                return true;
            }

        }

    };
    play.position = position;


})();