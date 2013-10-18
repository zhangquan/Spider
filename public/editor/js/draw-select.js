(function () {


    var utils = play.utils,
        position = play.position,
        grid = play.grid,
        select = play.select,
        drag = play.drag,
        align = play.align,
        history = play.history;
    //画新元素




    var el;


    var onstart = function (sx, sy, target) {
            console.log("start",play.cmd)

        if(play.cmd!="select")return;
        if(target.closest(play.select.selectedEL).length)return;





        el = $('<div style="pointer-events: none"></div>');

        el.css("top", "0")
        el.css("left", "0")
        el.css("width", "0")
        el.css("height", "0");
        el.css("border", "dashed 1px gray");
        el.css("position", "absolute");
        el.appendTo(play.container);
        //   select.cancelSelectEL();


    }
    var ondrag = function (startX, startY, endX, endY, target) {

        if(play.cmd!="select")return;
        if(target.is(play.select.selectedEL))return;
        if (el) {




            var oldCood = position.toCood(startX, startY, endX, endY);
            position.cood(el, oldCood);



        }
    }
    var onend = function (startX, startY, endX, endY, target) {
        if(play.cmd!="select")return;
        if(target.is(play.select.selectedEL))return;


        if (el)el.remove();



    }


    $(document).on("iframeload", function () {

        drag.ondraw(play.iframeDoc, onstart, ondrag, onend, play.iframeDoc);

    })


})();