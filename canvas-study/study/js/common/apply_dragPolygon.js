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
  let Point=function (x,y) {
    this.x=x;
    this.y=y;
  };

  let Polygon=function (centerX,centerY,radius,sides,startAngle,strokeStyle,fillStyle,filled) {
    this.x=centerX;
    this.y=centerY;
    this.radius=radius;
    this.sides=sides;
    this.startAngle=startAngle;
    this.strokeStyle=strokeStyle;
    this.fillStyle=fillStyle;
    this.filled=filled;
  };
  Polygon.prototype={
    getPoints:function () {
      let points=[],
        angle=this.startAngle||0;
      for(var i=0;i<this.sides;++i){
        points.push(new Point(this.x+this.radius*Math.sin(angle),this.y-this.radius*Math.cos(angle)));
        angle+=2*Math.PI/this.sides;
      }
      return points;
    },
    createPath:function (context) {
      var points=this.getPoints();
      context.beginPath();
      context.moveTo(points[0].x,points[0].y);
      for(var i=1;i<this.sides;++i){
        context.lineTo(points[i].x,points[i].y);
      }
      context.closePath();
    },
    stroke:function(context){
      context.save();
      this.createPath(context);
      context.strokeStyle=this.strokeStyle;
      context.stroke();
      context.restore();
    },
    fill:function (context) {
      context.save();
      this.createPath(context);
      context.fillStyle=this.fillStyle;
      context.fill();
      context.restore();
    },
    move:function (x,y) {
      this.x=x;
      this.y=y;
    }
  };

  function windowToCanvas(x,y) {
    var bbox=canvas.getBoundingClientRect();
    return {
      x:x-bbox.left*(canvas.width/bbox.width),
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
  function drawRubberbandShape(loc,sides,startAngle) {
    var polygon=new Polygon(mousedown.x,
                              mousedown.y,
                              rubberbandReact.width,
                              parseInt(sidesSelect.value),
                              (Math.PI/180)*parseInt(startAngleSelect.value),
                              context.strokeStyle,
                              context.fillStyle,
                              fillCheckBox.checked);
    drawPolygon(polygon);
    if(!dragging){
      polygons.push(polygon);
    }
  }
  function updateRubberband(loc,sides,startAngle) {
    updateRubberbandRectangle(loc);
    drawRubberbandShape(loc,sides,startAngle);
  }
  function drawHorizontalLine(y) {
    context.beginPath();
    context.moveTo(0,y+0.5);
    context.lineTo(canvas.width,y+0.5);
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
  function drawPolygons() {
    polygons.forEach(function (polygon) {
      drawPolygon(polygon);
    })
  }
  function startDragging(loc) {
    saveDrawingSurface();
    mousedown.x=loc.x;
    mousedown.y=loc.y;
  }
  function startEditing() {
    canvas.style.cursor='pointer';
    editing=true;
  }
  function stopEditing() {
    canvas.style.cursor='crosshair';
    editing=false;
  }
  canvas.onmousedown=function (e) {
    var loc=windowToCanvas(e.clientX,e.clientY);
    e.preventDefault();
    if(editing){
      polygons.forEach(polygon=>{
        polygon.createPath(context);
        if(context.isPointInPath(loc.x,loc.y)){
          startDragging(loc);
          dragging=polygon;
          dragingOffsetX=loc.x-polygon.x;
          dragingOffsetY=loc.y-polygon.y;
          return;
        }
      })
    }else {
      startDragging(loc);
      dragging=true;
    }
  }
  canvas.onmousemove=function (e) {
    var loc=windowToCanvas(e.clientX,e.clientY);

    e.preventDefault();
    if(editing&&dragging){
      dragging.x=loc.x-dragingOffsetX;
      dragging.y=loc.y-dragingOffsetY;
      context.clearRect(0,0,canvas.width,canvas.height);
      //drawGrid("lightgray",10,10);
      drawPolygons();
    }else {
      if(dragging){
        restoreDrawingSurface();
        updateRubberband(loc,sides,startAngle);
        if(guidewires){
          drawGuidewires(mousedown.x,mousedown.y);
        }
      }
    }
  }
 canvas.onmouseup=function (e) {
   var loc=windowToCanvas(e.clientX,e.clientY);
   dragging=false;
   if(editing){

   }else {
     restoreDrawingSurface();
     updateRubberband(loc);
   }
 }
 eraseAllButton.onclick=function (e) {
   context.clearRect(0,0,canvas.width,canvas.height);
   //drawGrid("lightgray",10,10);
   saveDrawingSurface();
 }
 strokeStyleSelect.onchange=function (e) {
   context.strokeStyle=strokeStyleSelect.value;
 }
 fillStyleSelect.onchange=function (e) {
   context.fillStyle=fillStyleSelect.value;
 }
 editCheckBox.onchange=function (e) {
   if(editCheckBox.checked){
     startEditing();
   }else {
     stopEditing();
   }
 }
 context.strokeStyle=strokeStyleSelect.value;
  context.fillStyle=fillStyleSelect.value;

  context.shadowColor='rgba(0,0,0,0.4)';
  context.shadowOffsetX=2;
  context.shadowOffsetY=2;
  context.shadowBlur=4;
  //drawGrid("lightgray",10,10)
})