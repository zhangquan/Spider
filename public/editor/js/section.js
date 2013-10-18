define(["utils", "position"], function (utils, position) {

    var sections = [
        {
            name: "123",
            template: "<div><h3>header</h3><p>woef iw owf ow fowef lfjowef eflwefiwlekflweieflwefi wefi</p></div>"
        }

    ]


    //画新元素
    var iframe = $("iframe");


    //可选择插入文字
    var editableEL;
    return {
        init: function () {
            var iframeDoc = iframe.get(0).contentDocument;
            $(iframeDoc).on("typeInit typeClick", function (ev) {
                var target = $(ev.target);
                if (utils.isSection(target)) {

                    editableEL = target;
                    editableEL.html(sections[0].template)
                }
            })

            $(iframeDoc).on("select", function (ev) {

                var target = $(ev.target)
                if (utils.isSection(target)) {


                    editableEL = target;
                    editableEL.html(sections[0].template)
                }
            })


            $(iframeDoc).on("unselect", function (ev) {


            });
        }
    }


    return exports;


})