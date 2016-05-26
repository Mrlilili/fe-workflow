function LightBox(dom) {
    this.dom = $(dom);
    this.initEvent();
}
LightBox.prototype = {
    initEvent: function () {

        var item = this.dom.find('.lightBoxItem');
        item.on('click', this.openImg);
    },
    openImg: function () {
        var imgSrc = $(this).children('img').attr('src');
        if ($('#lightBoxMask').length === 0) {
            $('body').append('<div id="lightBoxMask"><div class="imgBox"><img src="" alt=""></div></div>');
            $('#lightBoxMask .imgBox img').attr('src',imgSrc);
            $('#lightBoxMask').click(function(){
                $(this).remove();
            });
        }

    }
}