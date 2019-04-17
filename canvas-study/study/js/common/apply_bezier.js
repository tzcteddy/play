define(["require","exports","getContext"],function (require,exports,getContext) {
   let canvas=getContext.canvas.name,
     context=getContext.canvas.context,
     eraseAllButton=document.getElementById("eraseAllButton"),
     strokeStyleSelect=document.getElementById("strokeStyleSelect"),
     guidewireCheckBox=document.getElementById("guidewireCheckBox"),
     instructions=document.getElementById("instructions"),
     instructionsOkayButton=document.getElementById("instructionsOkayButton"),
     instructionsNoButton=document.getElementById("instructionsNoButton"),

     showInstructions=true,

     AXIS_MARGIN=40,
     HORIZONTAL_TICK_SPACING=10,
     VERTICAL_TICK_SPACING=10,
     TICK_SIZE=10,

     AXIS_ORIGIN={x:AXIS_MARGIN,y:canvas.height-AXIS_MARGIN},
     AXIS_TOP=AXIS_MARGIN,
     AXIS_RIGHT=canvas.width-AXIS_MARGIN,
     AXIS_WIDTH=AXIS_RIGHT-AXIS_ORIGIN.x,
     AXIS_HEIGHT=AXIS_ORIGIN.y-AXIS_TOP,

     NUM_VERTICAL_TICKS=AXIS_HEIGHT/VERTICAL_TICK_SPACING,
     NUM_HORIZONTAL_TICKS=AXIS_WIDTH/HORIZONTAL_TICK_SPACING,

     GRID_STROKE_STYLE='lightblue',
     GRID_SPACING=10,

     CONTROL_POINT_RADIUS=5,
     CONTROL_POINT_STROKE_STYLE='blue',
     CONTROL_POINT_FILL_STYLE='rgba(255,255,0,0.5)',

     END_POINT_STROKE_STYLE='navy',
     END_POINT_FILL_STYLE='rgba(0,255,0,0.5)',

     GUIDEWIRE_STROKE_STYLE='rgba(0,0,230,0.4)',

     drawingImageData,
     mousedown={},
     rubberbandReact={},

     dragging=false,
     draggingPoint=false,
     endPoints=[{},{}],
     controlPoint=[{},{}],
     editing=false,
     guidwires=guidewireCheckBox.checked;

  function windowToCanvas(x,y) {
    var bbox=canvas.getBoundingClientRect();
    return {
      x:x-bbox.left*(canvas.width/bbox.width),
      y:y-bbox.top*(canvas.height/bbox.height)
    }
  }
  function saveDrawingSurface(){
    drawingImageData=context.getImageData(0,0,canvas.width,canvas.height);
  }
  function restoreDrawingSurface(){
    context.putImageData(drawingImageData,0,0)
  }
  function updateRubberbandRectangle(loc) {
    rubberbandReact.width=Math.abs(loc.x-mousedown.x);
    rubberbandReact.height=Math.abs(loc.y-mousedown.y);
    if(loc.x>mousedown.x){
      rubberbandReact.left=mousedown.x;
    }else {
      rubberbandReact.left=loc.x;
    }
    if(loc.y>mousedown.y){
      rubberbandReact.top=mousedown.y;
    }else {
      rubberbandReact.top=loc.y;
    }
  }
  function drawBezierCurve() {
    context.beginPath();
    context.moveTo(endPoints[0].x,endPoints[0].y);
    context.bezierCurveTo(controlPoint[0].x,controlPoint[0].y,
                          controlPoint[1].x,controlPoint[1].y,
                          endPoints[1].x,endPoints[1].y);
    context.stroke();
  }
  function updateEndAndControlPoints(){
    endPoints[0].x=rubberbandReact.left;
    endPoints[0].y=rubberbandReact.top;

    endPoints[1].x=rubberbandReact.left+rubberbandReact.width;
    endPoints[1].y=rubberbandReact.top+rubberbandReact.height;

    controlPoint[0].x=rubberbandReact.left;
    controlPoint[0].y=rubberbandReact.top+rubberbandReact.height;

    controlPoint[1].x=rubberbandReact.left+rubberbandReact.width;
    controlPoint[1].y=rubberbandReact.top;
  }
  function drawRubberbandShap(loc) {
    updateEndAndControlPoints();
    drawBezierCurve();
  }
  function updateRubberband(loc) {
    updateRubberbandRectangle(loc);
    drawRubberbandShap(loc);
  }
  function drawHorizontalGuidewire(y) {
    context.beginPath();
    context.moveTo(0,y+0.5);
    context.lineTo(canvas.width,y+0.5);
    context.stroke();
  }
  function drawVerticalGuidewire(x){
    context.beginPath();
    context.moveTo(x+0.5,0);
    context.lineTo(x+0.5,canvas.height);
    context.stroke();
  }
  function drawGuidewires(x,y) {
    context.save();
    context.strokeStyle=GUIDEWIRE_STROKE_STYLE;
    context.lineWidth=0.5;
    drawVerticalGuidewire(x);
    drawHorizontalGuidewire(y);
    context.restore();
  }
  function drawControlPoint(index) {
    context.beginPath();
    context.arc(controlPoint[index].x,controlPoint[index].y,CONTROL_POINT_RADIUS,0,Math.PI*2,false);
    context.stroke();
    context.fill();
  }
  function drawControlPoints(){
    context.save();
    context.strokeStyle=CONTROL_POINT_STROKE_STYLE;
    context.fillStyle=CONTROL_POINT_FILL_STYLE;
    drawControlPoint(0);
    drawControlPoint(1);
    context.stroke();
    context.fill();
    context.restore();
  }
  function drawEndPoint(index) {
    context.beginPath();
    context.arc(endPoints[index].x,endPoints[index].y,CONTROL_POINT_RADIUS,0,Math.PI*2,false);
    context.stroke();
    context.fill();
  }
  function drawEndPoints() {
    context.save();
    context.strokeStyle=END_POINT_STROKE_STYLE;
    context.fillStyle=END_POINT_FILL_STYLE;
    drawEndPoint(0);
    drawEndPoint(1);
    context.stroke();
    context.fill();
    context.restore();
  }
  function drawControlAndPoints() {
    drawControlPoints();
    drawEndPoints();
  }
  function cursorInEndPoint(loc) {
    var pt;
    endPoints.forEach(point=>{
      context.beginPath();
      context.arc(point.x,point.y,CONTROL_POINT_RADIUS,0,Math.PI*2,false);
      if(context.isPointInPath(loc.x,loc.y)){
        pt=point;
      }
    });
    return pt;
  }
  function cursorInControlPoint(loc) {
    var pt;
    controlPoint.forEach(point=>{
      context.beginPath();
      context.arc(point.x,point.y,CONTROL_POINT_RADIUS,0,Math.PI*2,false);
      if(context.isPointInPath(loc.x,loc.y)){
        pt=point;
      }
    });
    return pt;
  }
  function updateDraggingPoint(loc) {
    draggingPoint.x=loc.x;
    draggingPoint.y=loc.y;
  }
  canvas.onmousedown=function (e) {
    var loc=windowToCanvas(e.clientX,e.clientY);
    e.preventDefault();
    console.log(editing);
    if(!editing){
      saveDrawingSurface();
      mousedown.x=loc.x;
      mousedown.y=loc.y;
      updateRubberbandRectangle(loc);
      dragging=true;
    }else {
      draggingPoint=cursorInControlPoint(loc);
      if(!draggingPoint){
        draggingPoint=cursorInEndPoint(loc);
      }
    }
  }
  canvas.onmousemove=function (e) {
    var loc=windowToCanvas(e.clientX,e.clientY);
    if(dragging||draggingPoint){
      e.preventDefault();
      restoreDrawingSurface();
      if(guidwires){
        drawGuidewires(loc.x,loc.y);
      }
    }
    if(dragging){
      updateRubberband(loc);
      drawControlAndPoints();
    }else if(draggingPoint){
      updateDraggingPoint(loc);
      drawControlAndPoints();
      drawBezierCurve();
    }
  }
  canvas.onmouseup=function (e) {
    var loc=windowToCanvas(e.clientX,e.clientY);
    restoreDrawingSurface();
    if(!editing){
      updateRubberband(loc);
      drawControlAndPoints();
      dragging=false;
      editing=true;
      if(showInstructions){
        instructions.style.display="inline";
      }
    }else {
      if(draggingPoint)drawControlAndPoints();
      else editing=false;
      drawBezierCurve();
      draggingPoint=undefined;
    }
  }
  eraseAllButton.onclick=function () {
    context.clearRect(0,0,canvas.width,canvas.height);
    saveDrawingSurface();
    editing=false;
    dragging=false;
    draggingPoint=undefined;
  }
  strokeStyleSelect.onchange=function () {
    context.strokeStyle=strokeStyleSelect.value;
  }
  guidewireCheckBox.onchange=function () {
    guidwires=guidewireCheckBox.checked;
  }
  instructionsOkayButton.onclick=function () {
    instructions.style.display='none';
  }
  instructionsNoButton.onclick=function () {
    instructions.style.display='none';
    showInstructions=false;
  }
  context.strokeStyle=strokeStyleSelect.value;

});