(function () {

    var utils = play.utils,
        select = play.select,
        position = play.position,
        dom = play.dom;





    var getParent = play.dom.layoutParent;


    var center = function (target) {

        var parent = getParent(target);


        var pCood = position.cood(parent);
        var cCood = position.cood(target);
        console.log(parent);

        console.log(pCood, cCood)

        var left = pCood.left + pCood.width / 2 - cCood.width / 2;
        console.log(left);

        cCood.left = left;


        if (target.parent(".grid-row").length) {
            //row 内不居中

            return;

            dom._removeEl(target);
            dom._addNewEl(target, cCood)


        }
        else {
            target.css("marginLeft", "auto");
            target.css("marginRight", "auto")
        }


        select.reflow();

    }


    var left = function (target) {
        var parent = getParent(target);


        var pCood = position.cood(parent);
        var cCood = position.cood(target);


        cCood.left = pCood.left;

        //  dom.move(target,cCood)


        target.css("marginLeft", 0);


        select.reflow();

    }
    var right = function (target) {
        var parent = getParent(target);


        var pCood = position.cood(parent);
        var cCood = position.cood(target);


        cCood.left = pCood.right - cCood.width;


        var options = target.prop("moveable")

        target.css("marginLeft", "auto");
        target.css("marginRight", 0)

        select.reflow();

    }

    var top = function (target) {
        var parent = getParent(target);


        target.css("marginTop", "auto");
        select.reflow();

    }

    var bottom = function (target) {
        var parent = getParent(target);


        var pCood = position.cood(parent);
        var cCood = position.cood(target);


        cCood.top = pCood.bottom - cCood.height


        var options = target.prop("moveable")


        if (!options.treeModify) {
            var next = target.next();
            if (next.length) position.record(next);
            position.offset(target, cood)
            if (next.length) position.revert(next);

        }
        else {
            dom._removeEl(target);
            dom._addNewEl(target, cCood)


        }
        select.reflow();

    }

    /**
     * margin:0 auto;
     * 居中元素不形式行。
     *
     */

    var middle = function () {

        var parent = getParent(target);


        var pCood = position.cood(parent);
        var cCood = position.cood(target);


        cCood.top = pCood.top + pCood.height / 2 - cCood.height / 2


        var options = target.prop("moveable")


        if (!options.treeModify) {
            var next = target.next();
            if (next.length) position.record(next);
            position.offset(target, cood)
            if (next.length) position.revert(next);

        }
        else {
            dom._removeEl(target);
            dom._addNewEl(target, cCood)


        }
        select.reflow();

    }

    var widthAuto = function (target) {
        var parent = getParent(target);
        var pCood = position.cood(parent);
        var cCood = position.cood(target);


        cCood.width = pCood.width;
        cCood.left = pCood.left;

        if (target.parent(".grid-row").length) {


            var row = target.parent(".grid-row");


            var options = target.prop("moveable")


            if (!options.treeModify) {
                var next = target.next();
                if (next.length) position.record(next);
                position.offset(target, cood)
                if (next.length) position.revert(next);

            }




        }
        else {
            target.css("width", "100%");
            position.cood(target, cCood)
        }

        target.css("width", "auto");
        select.reflow();

    }

    var heightAuto = function (target) {

        var parent = getParent(target);
        var pCood = position.cood(parent);
        var cCood = position.cood(target);


        cCood.height = pCood.height;
        cCood.top = pCood.top;


        var next = target.next();
        if (next.length) position.record(next);
        position.cood(target, cCood)
        if (next.length) position.revert(next);


        select.reflow();

    }




    play.alignEl = {
        center: center,
        left: left,
        right: right,
        widthAuto: widthAuto,
        heightAuto: heightAuto
    }


})();