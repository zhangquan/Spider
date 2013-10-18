define([], function () {

    //画新元素
    var css =  jQuery.fn.css;

    jQuery.fn.css = function(){
        var result = css.apply( this, arguments );

        // call your function
        // this gets called everytime you use the addClass method
       if(arguments.length==2) $(this).trigger("cssChange");

        // return the original result
        return result;


    }



})