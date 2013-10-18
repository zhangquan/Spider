(function () {

    var utils = play.utils,
        position = play.position;
    var setRulersWidth = function () {

        var width = $(play.iframe).width();

        var max = Math.max($("#editor-rulers-x").width(), width + 60);
        var left = $("#editor").offset().left;


        var bgp = Math.max(left, 30)


        $("#editor-rulers-x .scroll").css("width", max);

        $("#editor-rulers-x .scroll").css({
            "backgroundPosition": bgp + "px -4px"
        })


        $("#editor-rulers-x .bd").css({
            "marginLeft": bgp + "px"
        })


        $("#editor-rulers-x .right").css("left", $("#editor").width() + left)

    }

    var setRulersHeight = function () {


        var yHeader = $("#editor-rulers-y .header");
        var yBody = $("#editor-rulers-y .body");
        var yFooter = $("#editor-rulers-y .footer");
        $("#editor-rulers-y .bd").css("height", $(play.iframeDoc).height())
        yHeader.css("top", $(".hline").css("top"))
        yBody.css("top", $(".bline").css("top"))
        yFooter.css("top", $(".fline").css("top"))
    }

    var initRulers = function () {
        //初始化rulers;

        for (var i = 0; i < 30; i++) {
            var num = $("<div></div>");
            num.css({
                position: "absolute",
                top: 0,
                height: 20,
                left: i * 100,
                padding: "0 5px"
            })
            num.html(i * 100)
            $("#editor-rulers-x .bd").append(num)

        }
        for (var i = 0; i < 30; i++) {
            var num = $("<div></div>");
            num.css({
                position: "absolute",
                left: 0,
                width: 20,
                top: i * 100,
                padding: "0px 0"
            })
            num.html(i * 100)

            $("#editor-rulers-y .bd").append(num)
        }
        var scroll = $("#editor-scroll");

        scroll.on("scroll", function (ev) {

            $("#editor-rulers-x").scrollLeft(scroll.scrollLeft())
            $("#editor-rulers-y").scrollTop(scroll.scrollTop())

        })


        setRulersWidth();
        setRulersHeight();


    }


    var synPageWidth = function (width) {


        var margin = $("#editor-margin")

        $(margin).css("width", width + 60);

        var header = $("#header", play.iframeDoc);
        var footer = $("#footer", play.iframeDoc);
        var body = $("#body", play.iframeDoc);

        var f = function (el) {
            el.prop("parentable", true);


            if (!el.attr("data-width-auto")) {
                el.width(width);
            }

        }

      //  f(header);
       // f(footer);
       // f(body);


        setRulersWidth();


    }


    var synPageHeight = function () {
        var h = $(play.iframeDoc.body).height();
              console.log("body height",h)

        $(play.iframe).height(h);


        var hline = $('.hline');
        var bline = $('.bline');
        var fline = $('.fline');

        hline.css("top", position.cood($("#header", play.iframeDoc)).botttom)
        bline.css("top", position.cood($("#body", play.iframeDoc)).bottom)
        fline.css("top", position.cood($("#footer", play.iframeDoc)).bottom)


        setRulersHeight();
    }


    var setHeight = function () {

        var header = $("#header", play.iframeDoc);
        var footer = $("#footer", play.iframeDoc);
        var body = $("#body", play.iframeDoc);

        var hline = $('<div class="hline"><span class="icon-resize-horizontal"></span></div>');
        var bline = $('<div class="bline"><span class="icon-resize-horizontal"></span></div>');
        var fline = $('<div class="fline"><span class="icon-resize-horizontal"></span></div>');
        hline.appendTo(play.container);
        bline.appendTo(play.container);
        fline.appendTo(play.container);


        hline.find("span").click(function (ev) {
            var target = $(ev.target);

            if (target.hasClass("selected")) {
                header.width($(play.iframe).width())
                header.removeAttr("data-width-auto")

            }
            else {
                header.css("width", "100%");
                header.attr("data-width-auto", "100%");
            }
            target.toggleClass("selected");


        })


        var top;

        var startDrag = function (startX, startY, target) {

            top = parseInt(target.css("top"));
            target.addClass("hover")


        }
        var ondrag = function (startX, startY, endX, endY, target) {


            var temp = top + (endY - startY);

            if (temp < 0)return;
            target.css("top", temp)
            if (target.hasClass("hline")) {

                header.height(temp - position.cood(header).top);
            }
            else if (target.hasClass("bline")) {




                body.height(temp - position.cood(body).top);


            }
            else if (target.hasClass("fline")) {
                footer.height(temp - position.cood(footer).top);
            }


            synPageHeight();
            $(document).trigger("resizeEl", [target])


        }
        var endDrag = function (startX, startY, endX, endY, target, endTarget) {


            var temp = top + (endY - startY);
            if (temp < 0)return;

            if (target.hasClass("hline")) {
                header.height(temp - position.cood(header).top);
            }
            else if (target.hasClass("bline")) {

                body.height(temp - position.cood(body).top);


            }
            else if (target.hasClass("fline")) {
                footer.height(temp - position.cood(footer).top);
            }


            synPageHeight();
            $(document).trigger("resizeEl", [target])

            target.removeClass("hover")


        }

        play.drag.ondrag(hline, startDrag, ondrag, endDrag);
        play.drag.ondrag(bline, startDrag, ondrag, endDrag);
        play.drag.ondrag(fline, startDrag, ondrag, endDrag);


    }
    var setWidth = function () {


        var lline = $('<div class="lline"><span></span></div>');
        var rline = $('<div class="rline"><span></span></div>');

        lline.appendTo(play.container);
        rline.appendTo(play.container);


        var width;

        var startDrag = function (startX, startY, target) {

            width = $(play.iframe).width();

            if (width < 0)return;

            target.addClass("hover")


        }
        var ondrag = function (startX, startY, endX, endY, target) {


            if (target.hasClass("rline")) {

                var w = width + endX - startX;
                if (w < 0)return;

                synPageWidth(w)
            }
            else if (target.hasClass("lline")) {
                var w = width + startX - endX;
                if (w < 0)return;

                synPageWidth(w)


            }

            $(document).trigger("resizeEl", [target])


        }
        var endDrag = function (startX, startY, endX, endY, target, endTarget) {


            if (target.hasClass("rline")) {

                var w = width + endX - startX;
                if (w < 0)return;

                synPageWidth(w)
            }
            else if (target.hasClass("lline")) {
                var w = width + startX - endX;
                if (w < 0)return;

                console.log("wwwwwww")

                synPageWidth(w)


            }

            $(document).trigger("resizeEl", [target])

            target.removeClass("hover")


        }

        play.drag.ondrag(lline, startDrag, ondrag, endDrag);
        play.drag.ondrag(rline, startDrag, ondrag, endDrag);


    }


    $(document).on("iframeload", function () {

        //synPageHeight()
        $("#editor-margin").width(1000)

        initRulers();
        setHeight();
        setWidth();


        $(window).on("resize", function () {
            synPageWidth();
            synPageHeight();

        })
        $(play.iframeWin).on("resize scroll", function () {
            synPageWidth();
            synPageHeight();


        })
        $(document).on("addNewEl moveEl cssChange resizeEl", function () {
            synPageWidth();
            synPageHeight();


        })


    })

})();