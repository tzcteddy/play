/**
 * Created by Administrator on 2019/3/30.
 */
define(["require","exports","getContext"],function (require,exports,getContext) {
  var canvas=getContext.canvas.name;
  var context=getContext.canvas.context;
  var rubberbandDiv=document.getElementById("rubberbandDiv");
  var resetButton=document.getElementById("resetButton");
  var image=new Image();
  var mousedown={};
  var rubberbandRectangle={};
  var dragging=false;
  function rubberbandStart(x,y) {
    mousedown.x=x;
    mousedown.y=y;
    rubberbandRectangle.left=mousedown.x;
    rubberbandRectangle.top=mousedown.y;
    moveRubberbandDiv();
    showRubberbandDiv();
    dragging=true;
  }
  function rubberbandStretch(x,y) {
    rubberbandRectangle.left=x<mousedown.x?x:mousedown.x;
    rubberbandRectangle.top=y<mousedown.y?y:mousedown.y;

    rubberbandRectangle.width=Math.abs(x-mousedown.x);
    rubberbandRectangle.height=Math.abs(y-mousedown.y);

    moveRubberbandDiv();
    resizeRubberbandDiv();
  }
  function rubberbandEnd() {
    var bbox=canvas.getBoundingClientRect();
    try{
      context.drawImage(canvas,
        rubberbandRectangle.left-bbox.left,
      rubberbandRectangle.top-bbox.top,
      rubberbandRectangle.width,
      rubberbandRectangle.height,
      0,0,canvas.width,canvas.height)
    }catch (e){

    }
    resetRubberbandRectangle();
    rubberbandDiv.style.width=0;
    rubberbandDiv.style.height=0;
    hideRubberbandDiv();
    dragging=false;
  }
  function moveRubberbandDiv() {
    rubberbandDiv.style.top=rubberbandRectangle.top+"px";
    rubberbandDiv.style.left=rubberbandRectangle.left+"px";
  }
  function resizeRubberbandDiv() {
    rubberbandDiv.style.width=rubberbandRectangle.width+"px";
    rubberbandDiv.style.height=rubberbandRectangle.height+"px";
  }
  function showRubberbandDiv() {
    rubberbandDiv.style.display="inline";
  }
  function hideRubberbandDiv() {
    rubberbandDiv.style.display="none"
  }
  function resetRubberbandRectangle() {
    rubberbandRectangle={top:0,left:0,width:0,height:0};
  }

  canvas.onmousemove=function (e) {
    var x=e.clientX;
    var y=e.clientY;
    e.preventDefault();
    rubberbandStart(x,y);
  }
  window.onmousemove =function (e) {
    var x=e.clientX;
    var y=e.clientY;
    e.preventDefault();
    if(dragging){
      rubberbandStretch(x,y);
    }
  };
  window.onmouseup=function (e) {
    e.preventDefault();
    rubberbandEnd();
  };
  image.onload=function () {
    context.drawImage(image,0,0,canvas.width,canvas.height);
  };
  resetButton.onclick=function (e) {
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(image,0,0,canvas.width,canvas.height);
  }
  image.src="../image/car-12.png";
})