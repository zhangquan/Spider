(function () {






    $(document).on("iframeload", function () {


        $(play.iframeDoc).on("click", "a", function (event) {
            //FF下需要在mousedown取消默认操作;
            event.preventDefault();


        })





       //  $("#editor-wrap").disableSelection() ;


        $(play.iframeDoc).on("mousedown", function (event) {
            //FF下需要在mousedown取消默认操作;

            var target = $(event.target);

            if (!target.closest("[contenteditable='true']").length) {
                event.preventDefault();
            }


        })

        $(play.iframeDoc).on("mousemove", function (event) {
            //FF下需要在mousedown取消默认操作;
            event.preventDefault();


        })
        $(play.iframeDoc).on("mousedown", "img", function (event) {
            //FF下需要在mousedown取消默认操作;

            var target = $(event.target);

            if (!target.closest("[contenteditable='true']")) {
                event.preventDefault();
            }


        })


        $(play.iframeDoc).on("mousedown", "img", function (event) {
            //FF下需要在mousedown取消默认操作;
            event.preventDefault();


        })
        $(play.iframeDoc).on("mousemove", "img", function (event) {
            //FF下需要在mousedown取消默认操作;
            event.preventDefault();


        })


    })


})();