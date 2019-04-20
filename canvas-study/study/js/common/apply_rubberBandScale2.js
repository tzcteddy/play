define(["require","exports","getContext"],function (require,exports,getContext) {
  let canvas=getContext.canvas.name,
    context=getContext.canvas.context,
    resetButton=document.getElementById("resetButton"),
    image=new Image(),
    imageData,
    mousedown={},
    rubberbandRectangle={},
    dragging=false;
  function windowToCanvas(canvas,x,y) {
    let canvasRectAngle=canvas.getBoundingClientRect();
    return {
      x:x-canvasRectAngle.left,
      y:y-canvasRectAngle.top
    };
  }
  function captureRubberbandPixels() {
    imageData=context.getImageData(rubberbandRectangle.left,
                                    rubberbandRectangle.top,
                                    rubberbandRectangle.width,
                                    rubberbandRectangle.height);
  }
  function restoreRubberbandPixels() {
    context.putImageData(imageData,rubberbandRectangle.left,rubberbandRectangle.top);
  }
  function drawRubberband() {
    context.strokeRect(rubberbandRectangle.left+context.lineWidth,
                        rubberbandRectangle.top-context.lineWidth,
                        rubberbandRectangle.width-2*context.lineWidth,
                        rubberbandRectangle.height-2*context.lineWidth)
  }
  function setRubberbandRectanglr(x,y) {
    rubberbandRectangle.left=Math.min(x,mousedown.x);
    rubberbandRectangle.top=Math.min(y,mousedown.y);
    rubberbandRectangle.width=Math.abs(x-mousedown.x);
    rubberbandRectangle.height=Math.abs(y-mousedown.y);
  }
  function updateRunbberband() {
    captureRubberbandPixels();
    drawRubberband();
  }
  function rubberbandStar(x,y) {
    mousedown.x=x;
    mousedown.y=y;
    rubberbandRectangle.left=mousedown.x;
    rubberbandRectangle.top=mousedown.y;
    dragging=true;
  }
  function rubberbandStretch(x,y) {
    if(rubberbandRectangle.width>2*context.lineWidth&&
      rubberbandRectangle.height>2*context.lineWidth){
      if(imageData!==undefined){
        restoreRubberbandPixels();
      }
    }
    setRubberbandRectanglr(x,y);
    if(rubberbandRectangle.width>2*context.lineWidth&&
      rubberbandRectangle.height>2*context.lineWidth){
      updateRunbberband();
    }
  }
  function rubberbandEnd() {
    context.drawImage(canvas,
                      rubberbandRectangle.left+context.lineWidth*2,
                      rubberbandRectangle.top+context.lineWidth*2,
                      rubberbandRectangle.width-4*context.lineWidth,
                      rubberbandRectangle.height-4*context.lineWidth);
    dragging=false;
    imageData=undefined;
  }
  canvas.onmousedown=function (e) {
    let  loc=windowToCanvas(canvas,e.clientX,e.clientY);
    e.preventDefault();
    rubberbandStar(loc.x,loc.y);
  }
  canvas.onmousemove=function (e) {
    let loc;
    if(dragging){
      loc=windowToCanvas(canvas,e.clientX,e.clientY);
      rubberbandStretch(loc.x,loc.y);
    }
  }
  canvas.onmouseup=function (e) {
    rubberbandEnd();
  }
  image.src="../image/huaban.jpg";
  image.onload=function () {
    context.drawImage(image,0,0,canvas.width,canvas.height);
  }
    resetButton.onclick=function () {
      context.clearRect(0,0,canvas.width,canvas.height);
      context.drawImage(image,0,0,canvas.width,canvas.height);
    }
    context.strokeStyle='navy';
  context.lineWidth=1.0;
})