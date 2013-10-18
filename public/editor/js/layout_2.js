define(["utils", "position", "grid", "select", "history"], function (utils, position, grid, select, history) {
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

        //设置背影位置


        //拖动滑块

        var xr = $("#editor-rulers-x .right");

        xr.draggable({
            axis: "x",
            drag: function () {
                //  $("#editor-rulers-x").scrollLeft(4000)
                //  $("#editor-scroll").scrollLeft(4000)
                var w = parseFloat(xr.css("left")) - parseFloat($("#editor-rulers-x .bd").css("marginLeft"));
                synPageWidth(w);


                // xr.scrollIntoView();

            }
            //   containment: $("#editor-rulers-x .scroll")


        })

    }

    var synSize = function (width) {
        var height = $(play.iframeDoc).height();
        $(play.iframe).height(height);
    }

    var synPageWidth = function (width) {

        var margin = $("#editor-margin")

        $(margin).css("width", width + 200);

        var header = $("#header", play.iframeDoc);
        var footer = $("#footer", play.iframeDoc);
        var body = $("#body", play.iframeDoc);


        var f = function (el) {
            el.prop("parentable", true);
            el.width(width);
        }

        f(header);
        f(footer);
        f(body);


        var max = Math.max($("#editor-rulers-x").width(), width + 200);
        var left = $("#editor").offset().left;


        var bgp = Math.max(left, 100)


        $("#editor-rulers-x .scroll").css("width", max);

        $("#editor-rulers-x .scroll").css({
            "backgroundPosition": bgp + "px -4px"
        })


        $("#editor-rulers-x .bd").css({
            "marginLeft": bgp + "px"
        })


        $("#editor-rulers-x .right").css("left", $("#editor").width() + left)


    }


    var synPageHeight = function () {

        var header = $("#header", play.iframeDoc);
        var footer = $("#footer", play.iframeDoc);
        var body = $("#body", play.iframeDoc);


        $("#editor-rulers-y .bd").css("height", $(play.iframeDoc).height())
    }


    var resizePart = function(){


    }


    $(document).on("iframeload", function () {


        synSize();

        var width = 1000;
        var height = 1000


        //设计宽度

        synPageWidth(width)
        synPageHeight(height);
        initRulers();


        var header = $("#header", play.iframeDoc);
        var footer = $("#footer", play.iframeDoc);
        var body = $("#body", play.iframeDoc);

        var hXLine = $('<div class="hline"><span></span></div>');
        var bXLine = $('<div class="bline"><span></span></div>');
        var fXLine = $('<div class="fline"><span></span></div>');

        var yHeader = $("#editor-rulers-y .header");
        var yBody = $("#editor-rulers-y .body");
        var yFooter = $("#editor-rulers-y .footer");

        hXLine.appendTo(play.container);
        bXLine.appendTo(play.container);
        fXLine.appendTo(play.container);


        var po = function () {

            hXLine.css("top", header.height())
            yHeader.css("top",header.height()+30)

            bXLine.css("top", header.height()+body.height())
            yBody.css("top",header.height()+body.height()+30)


            fXLine.css("top", header.height()+body.height()+footer.height())
            yFooter.css("top",header.height()+body.height()+footer.height()+30)







        }

        po();


        var drag = function () {


            var s = $("<div></div>");
            s.css({
                height: "500px",
                width: 0,
                position: "absolute",
                top: 0,
                left: 0


            })
            s.appendTo($(play.container));
            var b = $("<div></div>");
            b.css({
                height: "400px",
                width: 0,
                position: "absolute",
                bottom: 0,
                left: 0



            })
            b.appendTo($(play.container));

            var cood = position.cood($(play.container));

            var yHeader = $("#editor-rulers-y .header");
            var yBody = $("#editor-rulers-y .body");
            var yFooter = $("#editor-rulers-y .footer");
            yHeader.draggable({
                axis: "y",
                containment: s,
                drag: function () {
                    var top = parseInt(yHeader.css("top")) - 30;
                    hXLine.css("top", top + "px");
                    header.css("height", top + "px");

                    $(document).trigger("resizeEl", [header])
                    synPageHeight();


                }



            });
            yBody.draggable({
                axis: "y",
                containment: b,
                drag: function () {
                    var top = parseInt(yBody.css("top")) - parseInt(yHeader.css("top"));
                    bXLine.css("top", top + "px");
                    body.css("height", top + "px");
                    $(document).trigger("resizeEl", [body])
                    synPageHeight();


                }



            });
            yFooter.draggable({
                axis: "y",
                containment: s,
                drag: function () {
                    var top = parseInt(yFooter.css("top")) - parseInt(yBody.css("top"));
                    // hXLine.css("top", top + "px");
                    footer.css("height", top + "px");
                    $(document).trigger("resizeEl", [footer])
                    synPageHeight();


                }



            });


            bXLine.draggable({
                axis: "y",
                handle: "span",
                containment: b
            });
            bXLine.draggable({
                drag: function () {

                    body.css("height", bXLine.offset().top - hXLine.offset().top)
                    footer.css("height", $(play.container).height() - parseInt(bXLine.css("top")))
                    $(document).trigger("resizeEl", [footer])
                    $(document).trigger("resizeEl", [body])
                }
            })
        }


        drag();




        $(window).on("resize", function () {
            synSize();
            po();

        })
        $(play.iframeWin).on("resize scroll", function () {
            synSize();
            po();

        })
        $(document).on("addNewEl moveEl cssChange resizeEl", function () {
            synSize();
            po();

        })


    })

})