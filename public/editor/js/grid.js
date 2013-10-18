(function () {

    var utils = play.utils,
        position = play.position;
    function isInSameRow(target, cood) {

        var bOffset = position.cood(target),
            bTop = bOffset.top,
            bMiddle = bTop + bOffset.height / 2,
            bBottom = bOffset.bottom;

        var tOffset = cood,
            tTop = tOffset.top,
            tMiddle = tTop + cood.height / 2,
            tBottom = cood.bottom;


        if (((bMiddle < tBottom && bMiddle > tTop) || (tMiddle < bBottom && tMiddle > bTop))) {
            return true;
        }

    }

    function cood() {

        var children = [];
        var bottoms = [];
        var rights = [];
        for (var i = 0; i < c.length; i++) {
            children.push($(c[i]));
        }
        var cood = {
        }
        utils.YSort(children);

        var f = $(children[0]);
        cood.top = f.offset().top;

        for (var i = 0; i < children.length; i++) {
            bottoms.push(position.offset(children[i]).top + position.cood(children[i]).height);

        }

        var bottom = Math.max.apply(Math, bottoms);


        cood.height = bottom - cood.top;

        utils.XSort(children);

        cood.left = children[0].offset().left;
        for (var i = 0; i < children.length; i++) {
            rights.push(position.cood(children[i]).left + position.cood(children[i]).width);

        }
        var right = Math.max.apply(Math, rights);
        cood.width = right - cood.left;

        return cood;

    }

    function isInSameColumn(target, cood) {

        var tCood = position.cood(target);
        var tl = tCood.left;
        var tm = tl + tCood.width / 2;
        var tr = tCood.bottom;

        var l = cood.left;
        var m = cood.left + cood.width / 2;
        var r = cood.right;

        if (tm > l && tm < r || m > tl && m < tr) {
            return true;
        }


    }

    var findRow = function (row, cood) {

        var children = row.children();
        var result = [];
        children.each(function (index, el) {
            if (isInSameRow($(el), cood)) {
                result.push($(el));
                return false;
            }

        })

        return result;


    }

    var findCloumn = function (row, cood) {

        var children = parent.children();
        var result;
        children.each(function (index, el) {
            if (isInSameColumn($(el), cood)) {
                result = $(el);
                return false;
            }

        })

        return result;

    }

    var getRelativeEl = function (el) {
        if (!el)return;
        var next = el.next();
        while (!utils.isStatic(next)) {
            if (!next.length) break;
            next = next.next();

        }
        return next;

    }

    var rowAdd = function (row, el, cood) {
        var columns = utils.XSort(row.children());
        var index;
        var point;
        var next;
        $(columns).each(function (i, c) {
            var tCood = position.cood($(c));
            if (cood.left < tCood.left) {
                index = i;
                point = $(c);
                return false;

            }
        })
        if (!point) {
            row.append(el);
            position.cood(el, cood);
            return;
        }

        position.record(point);

        el.insertBefore(point);
        position.cood(el, cood);
        position.revert(point);


    }
    var columnAdd = function (column, el, cood) {
        var columns = utils.YSort(column.children());
        var index;
        var point;
        var next;
        $(columns).each(function (i, c) {
            var tCood = position.cood($(c));
            if (cood.top < tCood.top) {
                index = i;
                point = $(c);
                return false;

            }
        })
        if (!point) {
            column.append(el);
            position.cood(el, cood);
            return;
        }

        position.record(point);

        el.insertBefore(point);
        position.cood(el, cood);
        position.revert(point);

    }

    function isOneRow(el) {


    }


    var exports = {

        add: function (el, cood) {
            var doc = play.iframeDoc;

            var parent = position.getFullInParent(cood, doc);
            if (parent.prop("tagName").toLowerCase() == "body") {

                el.css("position", "absolute")
            }

            if (parent.children().length == 0) {

                parent.append(el);
                position.cood(el, cood);
                return;
            }
            if (!utils.isStatic(el)) {

                parent.append(el);
                position.cood(el, cood);
                return;
            }

            //居中对齐不在行中。@todo
            var alignX = el.attr("data-align-x");

            var row = findRow(parent, cood);

            if (row.length > 1) {


                // 判断是否有一grid-row元素
                var gridParent;
                for (var i = 0; i < row.length; i++) {
                    if ($(row[i]).hasClass("grid-row")) {
                        gridParent = $(row[i]);
                        break;
                    }

                }

                if (!gridParent) {
                    var rowEl = $('<div class="grid-row" p-type="grid-row"></div>');
                    rowEl.insertBefore(row(0));

                    for (var i = 0; i < row[i].length; i++) {
                        position.record($(row[i]));
                        row[i].append(rowEl);
                        position.reverse($(row[i]))
                    }

                }


            }


            else if (row.length == 1 && (row = $(row[0])) && row.hasClass("grid-row")) {

                var next = row.next();
                if (next.length)  position.record(next);

                rowAdd(row, el, cood);
                if (next.length)  position.revert(next);

            }
            else if (row.length == 1) {
                row = $(row[0]);
                var rowEl = $('<div class="grid-row" p-type="grid-row"></div>');
                position.record(row);
                $(row).wrap(rowEl);
                var rowEl = $(row).parent();

                var next = $(rowEl).next();
                if (next.length)   position.revert(row);

                rowAdd($(row).parent(), el, cood);

                if (next.length)   position.revert(next);

            }
            else {
                columnAdd(parent, el, cood)
            }


        },
        remove: function (el) {
            var rEl = getRelativeEl(el);
            var parent = el.parent(".grid-row");
            if (rEl && rEl.length) position.record(rEl);
            var rowEl = parent.length && parent.next();

            if (rowEl && rowEl.length) {
                position.record(rowEl);

            }


            el.remove();


            if (parent.length && parent.children().length == 1) {
                console.log("onlne")

                var c = parent.children();

                c.unwrap();


            }

            if (rEl && rEl.length)  position.revert(rEl);
            if (rowEl && rowEl.length)  position.revert(rowEl);

        }


    }


    play.grid = exports;



})();