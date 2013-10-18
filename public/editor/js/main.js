var globleStatus = {
    position: "static"
};

window.pfm = {
    start: function (msg) {
        this.time = new Date().getTime();
        // console.log("pfm start "+(this.time),msg)
    },
    step: function (msg) {
        var t = new Date().getTime();
        //  console.log("pfm step "+(t- this.time),msg)  ;

        this.time = t;
    }
}
var play = {
    container: "#editor",
    position: "static",
    css: {
        borderColor: "#000",
        borderStyle: "solid",
        borderWidth: 0,
        color: "#5a5a5a",
        backgroundColor: "#fff"

    },
    cmd: "select" ,
    createStepRun: function (time) {


        return {


            run: function (fun, time) {


                if (this.__timer) {
                    clearTimeout(this.__timer);
                    this.__timer = null;
                }

                this.__timer = setTimeout(fun, time || 200)


            }
        }


    }





};

play._iframeOnloadCallbacks = [];
play.iframeOnload = function (callback) {

    var iframe = play.iframe;

    if (iframe.prop("__uploaded")) {
        callback && callback()
    }

    iframe.on("load", function () {
        iframe.prop("_uploaded", true);
        callback && callback();


    });


}

