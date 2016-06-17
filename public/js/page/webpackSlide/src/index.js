require('jquery');

require('test.css');
;(function ($) {

    var slide = function (dom) {
        var self = this;
        this.self = $(dom);
        this.setting = {
            boxW: 1000,
            boxH: 270,
            imgBoxW: 640,
            imgBoxH: 270,
            scale: 0.9,
            speed: 500
        };
        this.preBtn = this.self.find('.icon-prev');
        this.nextBtn = this.self.find('.icon-next');
        this.slideItem = this.self.find('.slideItem');
        this.slideItemFirst = this.slideItem.first();
        this.slideItemLast = this.slideItem.last();

        this.getSetting();
        $.extend(this.setting, this.getSetting());
        this.setSettingVal();
        this.setItemPos();
        this.nextBtn.click(function () {

            self.prev();
        });
        this.preBtn.click(function () {

            self.next();
        })

    }
    slide.init = function (doms) {
        var self = this;
        doms.each(function () {
            new self(this);
        })
    }
    slide.prototype = {
        getSetting: function () {
            return this.self.data('setting');
        },
        next: function () {
            var self = this;
            var _data = [];

            self.slideItem.each(function () {
                var nextDom = $(this).next().get(0) ? $(this).next() : self.slideItemFirst;

                _data.push({
                    left: nextDom.css('left'),
                    top: nextDom.css('top'),
                    zIndex: nextDom.css('z-index'),
                    width: nextDom.css('width'),
                    height: nextDom.css('height'),
                    opacity: nextDom.css('opacity'),
                    right: nextDom.css('right')
                });
            });
            self.slideItem.each(function (i) {
                $(this).css({zIndex: _data[i].zIndex})
                $(this).animate({
                    left: _data[i].left,
                    top: _data[i].top,
                    width: _data[i].width,
                    height: _data[i].height,
                    opacity: _data[i].opacity,
                    right: _data[i].right
                },self.setting.speed);
            });
        },
        prev: function () {
            var self = this;
            var _data = [];

            self.slideItem.each(function () {
                var prevDom = $(this).prev().get(0) ? $(this).prev() : self.slideItemLast;
                _data.push({
                    left: prevDom.css('left'),
                    top: prevDom.css('top'),
                    zIndex: prevDom.css('z-index'),
                    width: prevDom.css('width'),
                    height: prevDom.css('height'),
                    opacity: prevDom.css('opacity'),
                    right: prevDom.css('right')
                });
            });
            self.slideItem.each(function (i) {

                $(this).css({zIndex: _data[i].zIndex})
                $(this).animate({
                    left: _data[i].left,
                    top: _data[i].top,
                    width: _data[i].width,
                    height: _data[i].height,
                    opacity: _data[i].opacity,
                    right: _data[i].right
                }, self.setting.speed);
            });
        },
        setItemPos: function () {
            var self = this,
                sliceItem = this.slideItem.slice(1),
                sliceSize = sliceItem.size() / 2,
                rightItem = sliceItem.slice(0, sliceSize),
                leftItem = sliceItem.slice(sliceSize),
                lev = Math.floor(this.slideItem.size() / 2),
                slideItemFirstLeft = parseInt(this.slideItemFirst.css('left')),
                _imgBoxW = self.setting.imgBoxW,
                _imgBoxH = self.setting.imgBoxH,
                _opcity = 1,
                _hold = [[], [], [], [], []];

            rightItem.each(function (i) {
                _imgBoxW *= self.setting.scale;
                _imgBoxH *= self.setting.scale;
                _opcity *= self.setting.scale;

                _hold[1].push(_opcity);
                _hold[2].push(_imgBoxW);
                _hold[3].push(_imgBoxH);
                _hold[4].push(slideItemFirstLeft + (slideItemFirstLeft / rightItem.length) * (i + 1) + (self.setting.imgBoxW - _imgBoxW));
                $(this).css({
                    left: slideItemFirstLeft + (slideItemFirstLeft / rightItem.length) * (i + 1) + (self.setting.imgBoxW - _imgBoxW),
                    top: (self.setting.imgBoxH - _imgBoxH) / 2,
                    zIndex: lev,
                    width: _imgBoxW,
                    height: _imgBoxH,
                    opacity: _opcity,

                });
                _hold[0].push(lev--);
            });
            //_imgBoxW = self.setting.imgBoxW;
            //_imgBoxH = self.setting.imgBoxH;
            //_opcity = 1;

            leftItem.each(function (i) {
                //_imgBoxW *= self.setting.scale;
                //_imgBoxH *= self.setting.scale;
                //_opcity *= self.setting.scale;
                //console.log( _hold[0][_hold[0].length-1-i],_hold[1][_hold[0].length-1-i]);
                $(this).css({

                    left: self.setting.boxW - _hold[2][_hold[0].length - 1 - i] - _hold[4][_hold[0].length - 1 - i],
                    top: (self.setting.imgBoxH - _hold[3][_hold[0].length - 1 - i]) / 2,
                    zIndex: _hold[0][_hold[0].length - 1 - i],
                    width: _hold[2][_hold[0].length - 1 - i],
                    height: _hold[3][_hold[0].length - 1 - i],
                    opacity: _hold[1][_hold[0].length - 1 - i],

                });
            });
        },
        setSettingVal: function () {
            var btnW = (this.setting.boxW - this.setting.imgBoxW) / 2;
            this.self.css({
                width: this.setting.boxW,
                height: this.setting.boxH
            });
            this.self.find('.slideBox').css({
                width: this.setting.boxW,
                height: this.setting.boxH
            })

            this.self.find('.btn').css({
                width: btnW,
                height: this.setting.boxH
            })

            this.slideItemFirst.css({
                opacity: 1,
                top: 0,
                left: btnW,
                zIndex: Math.ceil(this.slideItem.size() / 2)
            })

        }
    }
    window['slide'] = slide;
})(jQuery)