var initRender = (function () {
    $('#bgm')[0].pause();
    $('.back').hide().click(function () {
        $('.back').hide();
        $('.works').css('display','block');
        $('.pro').each(function (index,item) {
           $(item).css('display','none');
        });
    });
    $('.desc').each(function (index,item) {
        $(item).addClass('animated fadeInDown');
    });
    $('.self').addClass('animated fadeInLeftBig');
    $('.need').addClass('animated fadeInRightBig');
    $('.info .detail img').each(function (index,item) {
        $(item).addClass('animated fadeInLeftBig');
    });
    $('.info .msg').each(function (index,item) {
        $(item).addClass('animated fadeInRightBig');
    });

    $('.skills .detail div').each(function (index,item) {
        $(item).addClass('animated fadeInUpBig');
    });
    $('.works .detail').addClass('animated rotateIn');
    $('.title').addClass('animated slideInDown');
    $('.content').addClass('animated slideInLeft');
    $('.head').each(function(index,item){
       $(item).animate({
           width:'2rem',
           height:'2rem'
       },2000);
    });
    $('.end').addClass('animated bounce infinite');
})();

$('#bgmBtn').on('click',function () {
    this.flag = !this.flag;
    if(!this.flag){
        clearInterval(this.timer);
        this.val = 0;
        $(this).css('transform','rotate('+ this.val +'deg)');
        $('.bgmBtn .btn').hide();
        $('#bgm')[0].pause();
        return;
    }else{
        $('.bgmBtn .btn').show();
        $('#bgm')[0].play();
    }
    var that = this;
    this.timer = setInterval(function () {
        if(!that.val){
            that.val = 0;
        }
        that.val = (parseInt(that.val) + 3)%360;
        $(that).css('transform','rotate('+ that.val +'deg)');
    },20);
});

(function () {
    setInterval(function (){
        var $swipe = $('.swipe-tip');
        $swipe.animate({
            bottom:'1.2rem',
            opacity:0
        }, "slow",function () {
            $swipe.css({
                bottom:'0.2rem',
                opacity:1
            })
        });
    },1000);
})();
$('.pro').each(function (index,item) {
    item.index = index;
});

$('.img-clip-wrap').each(function (index,item) {
    item.index = index;
    $(item).click(function () {
        var indexCur = this.index;
        $('.back').show();
        $('.works').css('display','none');
        $('.pro').each(function (index,item) {
            if(indexCur == item.index){
                console.log(item.index,'block');
                $(item).css('display','block');
            }else{
                console.log(item.index);
                $(item).css('display','none');
            }
        });
    });
});

