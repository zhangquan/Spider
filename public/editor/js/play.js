(function (select) {
    function stepRun(fun) {


        if (fun.__timer) {
            clearTimeout(fun.__timer);
            fun.__timer = null;
        }

        fun.__timer = setTimeout(fun, 200)


    }


    $(window).on("resize", function () {

        stepRun(function () {
            var target = $('[data-height-auto]');
            target.each(function (index, el) {
                $(el).css("marginTop", "0")
                $(el).css("marginBottom", "0")
                $(el).height($(el).parent().innerHeight());

            })


        })


    })


})();