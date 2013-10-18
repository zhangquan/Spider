(function () {


    var select = play.select;

    var index = -1;

    var stack = [];
    var run = function (action, args) {

    }
    var exports = {
        maxLength: 100,
        index: 0,
        push: function (cmd, args, oldArgs) {

            if (index < stack.length - 1) {
                stack.splice(index, stack.length - 1 - index);
            }

            if (stack.length >= this.maxLength) {
                this.shift();
            }

            stack.push({cmd: cmd, args: args, oldArgs: oldArgs});

            index++;

        },
        shift: function () {
            this.stack.shift();
        },
        back: function () {
            if (index >= 0) {

                var action = stack[index];

                var cmd = action.cmd;

                var args = action.oldArgs;

                if (cmd == "addNewEl") {
                    cmd = "removeEl";
                }
                else if (cmd == "removeEl") {
                    cmd = "addNewEl";
                }



                play.dom["_" + cmd].apply(play.dom, args);
                index--;

            }


        },


        forward: function () {

            if (index < stack.length - 1) {
                index++;
                var action = stack[index];

                var cmd = action.cmd;

                var args = action.args;

                if (cmd == "add") {
                    cmd = "remove";
                }
                else if (cmd == "remove") {
                    cmd = "add";
                }
                play.dom["_" + cmd].apply(play.dom, args);
            }
        }


    };


    $(document).on("cmd", function (e, cmd) {

        if (cmd == "history_back") {
            exports.back();
            play.cmd = "select"

        }
        if (cmd == "history_forward") {
            exports.forward();
            play.cmd = "select"
        }


    })


    play.history =  exports;


})();