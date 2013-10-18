(function () {


    $(document).on("iframeload", function () {
        var iframeDoc = play.iframeDoc;


        $(document).bind('keydown', 'Ctrl+s', function (evt) {

            $.post("/editor/insert", {type: "page", doc: iframeDoc.documentElement.outerHTML})
        });

        $(iframeDoc).bind('keydown', 'Ctrl+s', function (evt) {

            $.post("/editor/insert", {type: "page", doc: iframeDoc.documentElement.outerHTML})
        });

    })


})();