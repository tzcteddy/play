define(['require','exports','getContext'],function (require,exports,getContext) {
  let canvas=getContext.canvas.name,
    context=getContext.canvas.context,
    eraseAllButton=document.getElementById("eraseAllButton"),
  strokeStyleSelect=document.getElementById("strokeStyleSelect"),
    fillStyleSelect=document.getElementById("fillStyleSelect"),
    fillCheckBox=document.getElementById("fillCheckBox"),
    editCheckBox=document.getElementById("editCheckBox"),
    sidesCheckBox=document.getElementById("sidesCheckBox"),

    drawingSurfaceImageData,

    mousedown={},
    rubberbandReact={},

    dragging=false,
    dragingOffsetX,
    dragingOffsetY,

    sides=8,
    startAngle=0,

    guidewires=true,
    editing=false,
    polygons=[];
    
  function windowToCanvas(x,y) {
    var bbox=canvas.getBoundingClientRect();
    return {
      x:x-bbox.left*(canvas.width-bbox.width),
      y:y-bbox.top*(canvas.height/bbox.height)
    }
  }
  function saveDrawingSurface(){
    drawingSurfaceImageData=context.getImageData(0,0,canvas.width,canvas.height);
  }
  function restoreDrawingSurface(){
    context.putImageData(drawingSurfaceImageData,0,0)
  }
  function drawPolygon(polygon) {
    context.beginPath();
    polygon.createPath(context);
    polygon.stroke(context);
    if(fillCheckBox.checked){
      polygon.fill(context);
    }
  }

})