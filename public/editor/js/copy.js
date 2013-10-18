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

    var data = {};
    $(document).bind("keydown", "ctrl+c", function (e) {


        if (play.select.selectedEL) {
            e.preventDefault();
            data.el = play.select.selectedEL.clone();
            data.float = play.select.selectedEL.css("float");
            data.cood = position.cood(play.select.selectedEL)
            data.parentCood = position.cood(play.select.selectedEL.parent());



        }
    })
    $(document).bind("keydown", "ctrl+v", function (e) {
        if (data.el) {
            e.preventDefault();
            var el = data.el.clone();


            if (data.float !== "none") {
                data.cood.left += 10 + data.cood.width;
                data.cood.right = data.cood.left + data.cood.width;
            }
            else if ((data.cood.bottom+ data.cood.height + 10) > data.parentCood.bottom) {
                data.cood.left += 10 + data.cood.width;
                data.cood.right = data.cood.left + data.cood.width;
            }
            else {
                data.cood.top += 10 + data.cood.height;
                data.cood.bottom = data.cood.top + data.cood.height;
            }
            dom.add(el, data.cood)


            play.select.selectEL(el)

        }
    })


    $(document).on("iframeload", function (e) {
        var iframe = $("iframe");
        var iframeDoc = iframe.get(0).contentDocument;

        $(iframeDoc).bind("keydown", "ctrl+c", function (e) {


            if (play.select.selectedEL) {
                e.preventDefault();
                data.el = play.select.selectedEL.clone();
                data.float = play.select.selectedEL.css("float");
                data.cood = position.cood(play.select.selectedEL);
                data.parentCood = position.cood(play.select.selectedEL.parent());


            }
        })
        $(iframeDoc).bind("keydown", "ctrl+v", function (e) {
            if (data.el) {

                e.preventDefault();
                var el = data.el.clone();

                if (data.float !== "none") {
                    data.cood.left += 10 + data.cood.width;
                    data.cood.right = data.cood.left + data.cood.width;
                }
                else if ((data.cood.bottom+ data.cood.height + 10) > data.parentCood.bottom) {
                    data.cood.left += 10 + data.cood.width;
                    data.cood.right = data.cood.left + data.cood.width;
                }
                else {
                    data.cood.top += 10 + data.cood.height;
                    data.cood.bottom = data.cood.top + data.cood.height;
                }
                dom.add(el, data.cood)


                play.select.selectEL(el)

            }
        })
    })


})();