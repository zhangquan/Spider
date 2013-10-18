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



    var helper;


    var insertNewEL = function (cood, iframeDoc) {


        return dom.addNewEl(cood);
    }


    var el;


    var onstart = function (sx, sy, target) {


        if (play.cmd.indexOf("draw") == -1)return;



        var parent = $(target);


        //部分节点不能加入元素
        if (parent.attr("data-is-wraper")) {
            return;
        }


        //   select.cancelSelectEL();


    }
    var ondrag = function (startX, startY, endX, endY, target) {

        if (play.cmd.indexOf("draw") == -1)return;

        play.doing =true;


        var oldCood = position.toCood(startX, startY, endX, endY);
        var parent = position.getFullInParent(oldCood, play.iframeDoc);
        align.start(oldCood, parent);

        var cood = align.cood;

        if (cood.x) {
            if (cood.x.position == 0) {
                if (endX < startX) {
                    endX = cood.x.value
                }
                else {
                    startX = cood.x.value
                }

            } else if (cood.x.position == 1) {


                if (endX > startX) {
                    endX = cood.x.value + (cood.x.value - startX)
                }
                else {
                    endX = cood.x.value - (startX - cood.x.value)
                }


            }
            else if (cood.x.position == 2) {
                if (endX < startX) {
                    startX = cood.x.value
                }
                else {
                    endX = cood.x.value
                }
            }
        }

        if (cood.y) {
            if (cood.y.position == 0) {

                if (endY < startY) {
                    endY = cood.y.value
                }
                else {
                    startY = cood.y.value
                }

            } else if (cood.y.position == 1) {
                if (endY > startY) {
                    endY = cood.y.value + (cood.y.value - startY)
                }
                else {
                    endY = cood.y.value - (startY - cood.y.value)
                }

            }
            else if (cood.y.position == 2) {
                if (endY < startY) {
                    startY = cood.y.value
                }
                else {
                    endY = cood.y.value
                }
            }

        }


        var oldCood = position.toCood(startX, startY, endX, endY);

        helper.position(oldCood);

        var parent = position.getFullInParent(oldCood, play.iframeDoc);


        select.selectParentEL(parent);


    }
    var onend = function (startX, startY, endX, endY, target) {


        if (play.cmd.indexOf("draw") == -1)return;
        align.stop();
        var cood = position.cood(helper)
        helper.hide();


        if (cood.width < 8)return;
        if (cood.height < 8)return;


        var newEL = insertNewEL(cood, play.iframeDoc);

        select.unSelectParentEL();




        play.cmd = "select";
        play.doing =false;

    }


    $(document).on("iframeload", function () {
        helper = drag.createHelper();
        drag.ondraw(play.iframeDoc, onstart, ondrag, onend, play.iframeDoc);

    });


    $(document).on("cmd", function (e, value) {
        var target = $(e.target);
        if (value == "draw") {
            var tagName = target.attr("data-tagname");
            var is = target.attr("data-is");
            play.cmdArgs = {tagName: tagName, is: is}

        }


    })


})();