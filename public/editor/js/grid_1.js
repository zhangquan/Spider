define(["utils", "position"], function (utils, position) {


    function isInSameRow(target, base) {
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


        if (((bMiddle < tBottom && bMiddle > tTop) || (tMiddle < bBottom && tMiddle > bTop)) && (fristRight < secondLeft)) {
            return true;
        }

    }

    function _isInSameRow(target, base) {
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


        if (((bMiddle < tBottom && bMiddle > tTop) || (tMiddle < bBottom && tMiddle > bTop)) && (fristRight < secondLeft)) {
            return true;
        }


    }

    function isInSameColumn(target, base) {
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


        if (fristRight > secondLeft) {
            return true;
        }

    }


    var exports = {

        cood: function (c) {
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
        },

        isGrid: function (el) {
            return  el.attr("p-type") == "grid"

        },
        isColumn: function (el) {
            return   el.attr("p-type") == "grid-column"
        },
        parse: function (el) {

            var children = [];
            var result = [];
            var temp = el.children();


            for (var i = 0; i < temp.length; i++) {

                temp[i] = $(temp[i])

                if (this.isGrid(temp[i])) {


                    var columns = $(temp[i]).children();
                    columns.each(function (index, column) {
                        if(column.children.length){
                            children = children.concat($(column).children());
                        }



                    })
                }

                else if (this.isColumn(temp[i])) {
                    if($(temp[i].children()).length){
                        children = children.concat($(temp[i]).children());
                    }

                }
                else {
                    children.push($(temp[i]));
                }


            }

            //record
            for (var i = 0; i < children.length; i++) {
                position.record(children[i]);


            }

            //建立行
            utils.YSort(children);
            for (var i = 0; i < children.length; i++) {
                if (!children[i]) continue;
                var base = $(children[i]);


                var row = [base];
                delete children[i];

                for (var j = 0; j < children.length; j++) {
                    if (!children[j]) continue;
                    var child = $(children[j]);


                    if (isInSameRow(base, child)) {
                        row.push(child);
                        delete  children[j];
                    }
                }

                result.push(row);

            }

            //建立列
            for (var i = 0; i < result.length; i++) {
                var newRow = [];
                var row = utils.XSort(result[i]);
                newRow.cood = this.cood(row);


                for (var j = 0; j < row.length; j++) {
                    if (!row[j]) continue;
                    var base = row[j];
                    var column = [base];
                    delete row[j];

                    for (var z = 0; z < row.length; z++) {
                        if (!row[j]) continue;
                        if (isInSameColumn(base, row[z])) {
                            column.push(row[z]);
                            delete row[z];
                        }


                    }


                    column.cood = this.cood(column);


                    newRow.push(column);


                }

                result[i] = newRow;


            }


            return result;

        },

        create: function (el) {


            if (!el.length)return;

            var result = this.parse(el);

            this.render(el, result);


        },
        render: function (el, grid) {



            var girdEl;
            el.children().remove();


            //创建栅格

            for (var i = 0; i < grid.length; i++) {
                var row = grid[i];

                if (row.length == 1) {
                    el.append(row[0][0]);
                    position.revert(row[0][0]);
                } else if (row.length >= 2) {
                    var gridEl = $('<div class="row" p-type ="grid"></div>');

                    el.append(gridEl);
                    //有时候会计算误差。原因暂时不明。
                    row.cood.width+=4;
                    position.cood(gridEl, row.cood);
                    for (var j = 0; j < row.length; j++) {
                        var column = row[j];
                        var columnEl = $('<div class="col-lg-1" style="float: left" p-type="grid-column"></div>');
                        gridEl.append(columnEl);
                        position.cood(columnEl, column.cood);

                        for (var z = 0; z < column.length; z++) {
                            columnEl.append(column[z]);
                            position.revert(column[z])

                        }


                    }


                }


            }


        },

        add: function (el, cood, parent) {

        },
        remove: function () {

        }


    }

    return exports;


});