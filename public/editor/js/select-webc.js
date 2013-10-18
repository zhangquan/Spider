(function () {





    var html = '' +
        '<div class="modal fade in" id="myModal"> ' +
        '<div class="modal-dialog">              ' +
        '   <div class="modal-content">             ' +
        '       <div class="modal-header">             ' +
        '           <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button> ' +
        '           <h4 class="modal-title">组件中心</h4>  ' +
        '       </div>                                           ' +
        '       <div class="modal-body">                            ' +
        '<ul>' +
        '<!--<li><a data-tagname="p-logo" data-cmd="draw" data-href="/editor/webc/p-logo.html">LOGO</a></li>-->' +
        '<li><a data-tagname="p-nav-h" data-cmd="draw" data-href="/editor/webc/p-nav-h.html">导航</a></li>' +
        '<li><a data-tagname="p-nav-v" data-cmd="draw" data-href="/editor/webc/p-nav-v.html">竖向导航</a></li>' +
        '<li><a data-tagname="p-slide" data-cmd="draw" data-href="/editor/webc/p-slide.html">轮播图</a></li>' +
        '<li><a data-tagname="p-pagination" data-cmd="draw" data-href="/editor/webc/p-pagination.html">分页</a></li>' +
        '<li><a data-is="p-button" data-cmd="draw" data-tagname="button" data-href="/editor/webc/p-button.html">按钮</a></li>' +


        '</ul>';
    '       </div>                                                    ' +
        '       <div class="modal-footer">                                   ' +
        '           <a href="#" class="btn">Close</a>                           ' +
        '                     ' +
        '       </div>                                                                ' +
        '   </div><!-- /.modal-content -->                                               ' +
        '</div><!-- /.modal-dialog -->                                                      ' +
        '</div>' +
    '';

    var h = $(html);
    $(h).modal({
        show: false

    });

    $(h).on("click", "a",function(){
       $(h).modal("hide")


    })



    var showWebc = function () {
        $(h).modal("toggle");

    };

    var exports = {
        show: showWebc
    }

    play.selectWebc = exports;

    $(document).on("cmd", function(e, value){
         if(value=="select_webc"){
             exports.show();
         }

    })



})();