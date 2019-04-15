define(["require","exports","getContext"],function (require,exports,getContext){
  var canvas=getContext.canvas.name,
    context=getContext.canvas.context,
    eraseAllButton=document.getElementById("eraseAllButton"),
    strokeStyleSelect=document.getElementById("strokeStyleSelect"),
    guidewireCheckBox=document.getElementById("guidewiresCheckBox"),
    drawingSurfaceImageData,
    mousedown={},
    rubberbandRect={},
    dragging=false,
    guidewires=guidewireCheckBox.checked;

  function drawGrid(color,stepx,stepy){}
  function windowToCanvas(x,y) {
    var bbox=canvas.getBoundingClientRect();
    return {x:x-bbox.left*(canvas.width/bbox.width),
            y:y-bbox.top*(canvas.height/bbox.height)};
  }
  function saveDrawingSurface() {
    drawingSurfaceImageData=context.getImageData(0,0,canvas.width,canvas.height);
  }
  function restoreDrawingSurface(){
    context.putImageData(drawingSurfaceImageData,0,0)
  }
  function updateRubberbandRectangle(loc) {
    rubberbandRect.width=Math.abs(loc.x-mousedown.x);
    rubberbandRect.height=Math.abs(loc.y-mousedown.y);
    loc.x>mousedown.x?rubberbandRect.left=mousedown.x:rubberbandRect.left=loc.x;
    loc.y>mousedown.y?rubberbandRect.top=mousedown.y:rubberbandRect.top=loc.y;
  }
  function drawRubberbandShape(loc,arc){
    if(arc){
      drawRubberbandArc(loc);
      return;
    }
    context.beginPath();
    context.moveTo(mousedown.x,mousedown.y);
    context.lineTo(loc.x,loc.y);
    context.stroke();
  }
  function drawRubberbandArc(loc) {
    var angle,
      radius;
    if(mousedown.y===loc.y){
      radius=Math.abs(loc.x-mousedown.x);
    }else {
      angle=Math.atan(rubberbandRect.height/rubberbandRect.width);
      radius=rubberbandRect.height/Math.sin(angle);
    }
    context.beginPath();
    context.arc(mousedown.x,mousedown.y,radius,0,Math.PI*2,false);
    context.stroke();
    if(fillCheckbox.checked){
      context.fill();
    }
  }
  function updateRubberband(loc){
    updateRubberbandRectangle(loc);
    drawRubberbandShape(loc);
  }
  function drawHorizontalLine(y) {
    context.beginPath();
    context.moveTo(0,y+0.5);
    context.lineTo(context.width,y+0.5);
    context.stroke();
  }
  function drawVerticalLine(x) {
    context.beginPath();
    context.moveTo(x+0.5,0);
    context.lineTo(x+0.5,canvas.height);
    context.stroke();
  }
  function drawGuidewires(x,y) {
    context.save();
    context.strokeStyle='rgba(0,0,230,0.4)';
    context.lineWidth=0.5;
    drawVerticalLine(x);
    drawHorizontalLine(y);
    context.restore();
  }
  canvas.onmousedown=function (e) {
    var loc=windowToCanvas(e.clientX,e.clientY);
    e.preventDefault();
    saveDrawingSurface();
    mousedown.x=loc.x;
    mousedown.y=loc.y;
    dragging=true;
  }
  canvas.onmousemove=function (e) {
    var  loc;
    if(dragging){
      e.preventDefault();
      loc=windowToCanvas(e.clientX,e.clientY);
      restoreDrawingSurface();
      updateRubberband(loc);
      if(guidewires){
        drawGuidewires(loc.x,loc.y);
      }
    }
  }
  canvas.onmouseup=function (e) {
    var loc=windowToCanvas(e.clientX,e.clientY);
    restoreDrawingSurface();
    updateRubberband(loc);
    dragging=false;
  }
  eraseAllButton.onclick=function (e) {
    context.clearRect(0,0,canvas.width,canvas.height);
    drawGrid("lightgray",10,10);
    saveDrawingSurface();
  }
  strokeStyleSelect.onchange=function (e) {
    context.strokeStyle=strokeStyleSelect.value;
  }
  guidewireCheckBox.onchange=function () {
    guidewires=guidewireCheckBox.checked;
  }
  context.strokeStyle=strokeStyleSelect.value;
  drawGrid("lightgray",10,10)
})