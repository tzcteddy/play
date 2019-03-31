define(["require","exports","getContext"],function (require,exports,getContext) {
  var canvas=getContext.canvas.name,
    context=getContext.canvas.context;
  var readout=document.getElementById("readout");
  var spritesheet=new Image();
  function windowToCanvas(canvas,x,y) {
    var bbox=canvas.getBoundingClientRect();
    return {
      x:x-bbox.left,//*(canvas.width/bbox.width),
      y:y-bbox.top//*(canvas.height/bbox.height)
    }
  }
  function drawBackground() {
    var VERTICAL_LINE_SPACING=12,
      i=context.canvas.height;
    context.clearRect(0,0,canvas.width,canvas.height);
    context.strokeStyle='lightgray';
    context.lineWidth=0.5;
    while (i>VERTICAL_LINE_SPACING){
      context.beginPath();
      context.moveTo(0,i);
      context.lineTo(canvas.width,i);
      context.stroke();
      i-=VERTICAL_LINE_SPACING;
    }
  }
  function drawSpritesheet(){
    context.drawImage(spritesheet,0,0);
  }
  function drawGuidelines(x,y) {
    context.strokeStyle='rgba(0,0,230,0.8)';
    context.lineWidth=0.5;
    drawVerticalLine(x);
    drawHorizontalLine(y);
  }
  function updateReadout(x,y) {
    readout.innerText='('+x.toFixed()+','+y.toFixed()+')';
  }
  function drawHorizontalLine(y) {
    context.beginPath();
    context.moveTo(0,y+0.5);
    context.lineTo(context.canvas.width,y+0.5);
    context.stroke();
  }
  function drawVerticalLine(x) {
    context.beginPath();
    context.moveTo(x+0.5,0);
    context.lineTo(x+0.5,canvas.height);
    context.stroke();
  }
  canvas.onmousemove=function (e) {
    var loc=windowToCanvas(canvas,e.clientX,e.clientY);
    drawBackground();
    drawSpritesheet();
    drawGuidelines(loc.x,loc.y);
    updateReadout(loc.x,loc.y);
  };
  spritesheet.src='../image/car-12.png';
  spritesheet.onload=function (e) {
    drawSpritesheet();
  };
  drawBackground();
});