(function () {





    var html = '' +
        '<div class="modal fade in selectImg" id="" > ' +
        '<div class="modal-dialog">              ' +
        '   <div class="modal-content">             ' +
        '       <div class="modal-header">             ' +
        '           <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button> ' +
        '           <h4 class="modal-title">我的图片</h4>  ' +
        '       </div>                                           ' +
        '       <div class="modal-body">                            ' +
        '<div  class="row" style="overflow: hidden"></div>' +

        '       </div>                                                    ' +
        '       <div class="modal-footer"> ' +
        '<button type="button" class="btn btn-primary upload">上传</button> ' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button> ' +

        '                     ' +
        '       </div>                                                                ' +
        '   </div><!-- /.modal-content -->                                               ' +
        '</div><!-- /.modal-dialog -->                                                      ' +
        '</div>' +
        '';


    var h = $(html);
    $(h).modal({
        show: false,
        keyboard:true


    });

    var addImg = function (src) {



        $(h).find(".row").append('<div class="col-lg-2" ><img class="img-thumbnail" src="' + src + '"></div>')
    }

    var init = function () {

        $.getJSON("/list", function (data) {
            if (data) {
                for (var p in data) {

                    addImg("/uploads/" + p);
                }
            }
        })


    }
    var initState = false;
    var show = function () {
        if (!initState) init();
        initState = true;
        $(h).modal("show");

        return function () {
            $(h).modal("show");
        }

    }


    $(h).on("click", "img", function (e) {
        $(h).modal("hide");


        play.selectImg.onSelect && play.selectImg.onSelect(e.target.src)

        $(e.target).trigger("selectImg", e.target.src)

    })
    $(h).on("click", ".upload", function (e) {


        play.utils.upload(function (result) {
            console.log(result)

            addImg(result[0].url)
        })

    })


    play.selectImg = {
        show: show
    }





})();