(function () {
     var dom = play.dom,
         select = play.select;
    //画新元素
    $(document).on("iframeload", function () {

        var iframeDoc = play.iframeDoc;
        //删除
        $(iframeDoc).bind("keydown", "del", function (e) {

            if (!select.selectedEL)return;

            if (select.selectedEL && select.selectedEL.prop("contenteditable") == "true")return;
            e.preventDefault();

            //重新定位受影响的元素
            dom.removeEl($(select.selectedEL))

            select.cancelSelectEL();
            select.cancelHoverEL();


        })

        //删除
        $(document).bind("keydown", "backspace", function (e) {


            if (!select.selectedEL)return;

            if (select.selectedEL && select.selectedEL.prop("contenteditable") == "true")return;

            e.preventDefault();
            //重新定位受影响的元素
            dom.removeEl($(select.selectedEL))

            select.cancelSelectEL();
            select.cancelHoverEL();


        })


        //删除
        $(iframeDoc).bind("keydown", "backspace", function (e) {


            if (!select.selectedEL)return;

            if (select.selectedEL && select.selectedEL.prop("contenteditable") == "true")return;
            e.preventDefault();

            //重新定位受影响的元素
            dom.removeEl($(select.selectedEL))




        })

        //删除
        $(document).bind("keydown", "del", function (e) {

            if (!select.selectedEL)return;

            if (select.selectedEL && select.selectedEL.prop("contenteditable") == "true")return;

            e.preventDefault();
            //重新定位受影响的元素
            dom.removeEl($(select.selectedEL))


        })


    })


})();