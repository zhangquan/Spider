define(["utils", "position", "drag", "select", "align", "grid", 'widgets'], function (utils, position, drag, select, align, grid, widgets) {

    //画新元素
    var iframe = $("iframe");

    var getFristNoChildEL = function (el) {
        var result = el;


        while (result.children().length != 0) {

            result = result.children().eq(0)
        }

        return result;
    }


    //可选择插入文字
    var editableEL;
    return {
        init: function () {
            var iframeDoc = iframe.get(0).contentDocument;

            $(iframeDoc).on("mouseover", "[p-type='text']", function (e) {
                var target = $(e.target)
                target.css("-webkit-user-select", "all");
                target.attr("contenteditable", "true");
            })

            $(iframeDoc).on("blur", "[p-type='text']", function (e) {
                var target = $(e.target)
                target.css("-webkit-user-select", "");
                target.removeAttr("contenteditable");
            })


            $(iframeDoc).on("typeInit", function (ev) {
                var target = $(ev.target);
                if (utils.isText(target)) {

                    target.focus();

                    editableEL = target;
                }
            })


        }
    }


})