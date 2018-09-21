/**
 * Created by YYBJ on 2018/9/21.
 */
var cubeRender = (function () {
    var index=8;
    var $threeWrap = $(".three-wrap");
    function setCanvs(img) {
        var canvas=document.getElementById("canvas");
        if (canvas.getContext){
            var ctx=canvas.getContext('2d');
            ctx.clearRect(0,0,1000,1000);
            ctx.drawImage(img,27,53,330,206);
            return ctx;
            //ctx.clearRect(0,0,0,100)
        }
    }
    function createImg(index) {
        var img=new Image();
        img.src = "./image/car-"+index+".png";
        img.onload=function () {
            setCanvs(img);
        };

        return img;
    }
    function count(index,flag){
        var index=index||0;
        if (flag){
            index = index>=23?0:++index;
        }else {
            index = index ==0?23:--index;
        }
        createImg(index);
        //setCanves().drawImage(createImg(index),0,0,330,206);
        return index;
    }


    function startFn(e) {
        var point = e.changedTouches[0];
        $(this).attr({
            strX: point.pageX,
            strY: point.pageY,
            changeX: 0,
            changeY: 0,
            isMove: false
        });//使用JQ或者ZP存储的自定义属性值都是字符串，及时你写的不是，他也会当做字符串去存储，以后通过Attr方法获取到的结果是字符串。
    }

    function moveFn(e) {
        var point = e.changedTouches[0];
        var changeX = point.pageX - parseFloat($(this).attr("strX")),
            changeY = point.pageY - parseFloat($(this).attr("strY"));
        var obj={
            changeX: changeX,
            changeY: changeY,
            isMove: (Math.abs(changeX) > 20 )
        };
        if (obj.isMove){
            if (changeX>0){
                index = count(index,true);
            }else {
                index = count(index,false);
            }
        }

    }

    function endFn(e) {
        var isMove = $(this).attr("isMove");
        if (isMove === "false") return;
        var changeX = parseFloat($(this).attr("changeX")),
            changeY = parseFloat($(this).attr("changeY"));
        var rotateX = parseFloat($(this).attr("rotateX")),
            rotateY = parseFloat($(this).attr("rotateY"));
        rotateY+=(changeX/3);
        rotateX-=(changeY/3);

        $(this).css("transform","scale(0.6) rotateY("+rotateY+"deg) rotateX("+rotateX+"deg)").attr({
            rotateX: rotateX,
            rotateY: rotateY, /*随时更新自定义属性，保证下一次滑动基于上一次角度*/
            strX: null,
            strY: null,
            changeX: null,
            changeY: null,
            isMove: null
        })
    }


    return {
        init: function () {
            count(index);
            $threeWrap.on("touchstart", startFn).on("touchmove", moveFn).on("touchend", endFn);
        },
    }


})();
cubeRender.init();