(function (utils, position, select, dom, webc) {
    var iframe = $("iframe");

    var shortcutbar = $('<div class="shortcutbar" ><div class="btn-group"></div>' +

        '</div>');


    shortcutbar.css({
        maxWidth: 700
    })





    shortcutbar.add = function (cmds) {
        cmds = cmds || []

        var groups = shortcutbar.find(".btn-group");


        var cmdsEl = groups;
        for (var i = 0; i < cmds.length; i++) {
            var cmd = cmds[i];

            var name = cmd.name;
            var cmdType = cmd.type;
            var desc = cmd.desc;
            var func = cmd.func;

            if (!cmdType || cmdType == "button") {
                desc = cmd.icon || desc;

                var cmdEl = $('<button type="button" class="btn btn-default btn-small" data-name="' + name + '">' + desc + '</button>');
                cmdsEl.append(cmdEl);
                cmdEl.on("click", cmds[i].func);

            }
            else if (cmdType == "input") {

                var value = cmd.value;
                var cmdEl = $('<input  type="text" style="float:left;width: 60px" placeholder="' + name + '" data-name="' + name + '"/>');
                var btn = $("<span></span>")

                cmdsEl.append(cmdEl);
                cmdEl.on("keyup", cmds[i].func);


            }
            else if (cmdType == "select") {

            }
            else if (cmdType == "color") {

                var cmdEl = '<input class="minicolor" data-control="brightness" type="text" value="#7745ff">';

                cmdsEl.append(cmdEl);

                (function (f) {

                    $(".minicolor", cmdsEl).minicolors({
                            animationSpeed: 100,
                            animationEasing: 'swing',

                            changeDelay: 0,

                            //defaultValue: play.css.backgroundColor,
                            hide: null,
                            hideSpeed: 100,
                            inline: false,
                            letterCase: 'lowercase',
                            opacity: false,
                            position: 'default',
                            show: null,
                            showSpeed: 100,
                            swatchPosition: 'left',
                            textfield: false,
                            theme: 'default',
                            change: function (hex) {

                                console.log("hange", hex)

                                var rgba = $(this).minicolors('rgbaString');

                                console.log(func)
                                f(hex);

                            }

                        }
                    );
                })(func);


            }


        }


    }
   /*
    shortcutbar.css({
        "position": "absolute",
        top: 0,
        left: 0,
        zIndex: 10000
    })
    */
    shortcutbar.hide();

    shortcutbar.reflow = function (target) {

        var target = target || select.selectedEL;

        var cood = position.cood(target);
        cood.left -= 12;
        var top = cood.top - shortcutbar.height() - 20;

        if (top < 0) {
            top = cood.top + cood.height + 20;
        }
        if (top < 0) {
            top = 0;
        }
        cood.top = top;
        if (cood.left < 0) {
            cood.left = 0
        }

       // position.offset(shortcutbar, cood);

    }


    shortcutbar.iframeInit = function () {
        var iframeDoc = iframe.get(0).contentDocument;
        $(shortcutbar).appendTo($("toolbar"));


        $(document).on("selectEl reSelectEl", function (ev, target) {

            var groups = shortcutbar.find(".btn-group");
            groups.html("");

            shortcutbar.show();


            if (target.get("0") && target.get(0).editCallback) {
                target.get(0).editCallback();
            }


            if (target.prop("editable")) {


                function command(ev) {
                    if ($(target).attr("contenteditable") == "true") {


                        $(target).attr("contenteditable", false);
                        $(target).blur();
                    }
                    else {

                        $(target).attr("contenteditable", "true");
                        $(target).focus()
                    }


                }


                var cmds = [
                    {name: "edit", icon: '<i class="icon-edit"></i>', desc: "编辑", func: command}


                ]
                shortcutbar.add(cmds);

            }
            var remove = function () {
                dom.removeEl(play.select.selectedEL)

            }


            shortcutbar.add(target.prop("cmds"));

         /*   shortcutbar.add([
                {name: "del", icon: '<i class="icon-trash"></i>', desc: "删除", func: remove}
            ]);
            */


            shortcutbar.reflow(target);


        })
        $(iframeDoc).on("unselect", function (ev) {
            var target = $(ev.target);
            shortcutbar.hide();
            if (target.prop("editable")) {
                target.attr("contenteditable", "false")
            }
        })

        $(document).on("selectReflow", function (ev, target) {

            shortcutbar.reflow(target);
        })


    };


    $(document).on("iframeload", function () {
        shortcutbar.iframeInit()
    })


    play.shortcutbar = shortcutbar;


    return shortcutbar;


})();