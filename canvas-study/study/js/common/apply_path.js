/**
 * Created by Administrator on 2019/3/31.
 */
define(["require","exports","getContext"],function (require,exports,getContext) {
  var canvas=getContext.canvas.name,
    context=getContext.canvas.context;
  context.font="48pt Helvetica";
  context.strokeStyle="blue";
  context.fillStyle="red";
  context.lineWidth=2;

  context.strokeText("Stroke",60,110);
  context.fillText("Fill",440,110);

  context.strokeText("Stroke&Fill",650,110);
  context.fillText("Stroke&Fill",650,110);
//rect
  context.lineWidth=5;
  context.beginPath();
  context.rect(80,150,150,100);
  context.stroke();

  context.beginPath();
  context.rect(400,150,150,100);
  context.fill();

  context.beginPath();
  context.rect(750,150,150,100);
  context.stroke();
  context.fill();

  //arc
  context.beginPath();
  context.arc(150,370,60,0,Math.PI*3/2);
  context.stroke();

  context.beginPath();
  context.arc(475,370,60,0,Math.PI*3/2);
  context.fill();

  context.beginPath();
  context.arc(820,370,60,0,Math.PI*3/2);
  context.stroke();
  context.fill();

  //close arc
  context.beginPath();
  context.arc(150,550,60,0,Math.PI*3/2);
  context.closePath();
  context.stroke();

  context.beginPath();
  context.arc(475,550,60,0,Math.PI*3/2);
  context.closePath();
  context.fill();

  context.beginPath();
  context.arc(820,550,60,0,Math.PI*3/2);
  context.closePath();
  context.stroke();
  context.fill();

  //subpath

  context.beginPath();
  context.rect(80,650,100,100);
  //context.fill();

  //context.beginPath();
  context.rect(100,670,100,100);
  context.rect(120,650,100,100);
  context.fill()

function rect(x,y,w,h,direction) {
    if(direction){
      context.moveTo(x,y);
      context.lineTo(x,y+h);
      context.lineTo(x+w,y+h);
      context.lineTo(x+w,y);
    }else {
      context.moveTo(x,y);
      context.lineTo(x+w,y);
      context.lineTo(x+w,y+h);
      context.lineTo(x,y+h);
    }
    context.closePath()
}
  function drawT() {
    context.beginPath();
    context.arc(475,650,20,0,Math.PI*2,true);
    context.arc(475,650,10,0,Math.PI*2,false);
    //context.fill();


    rect(80,650,100,100,true);
    rect(100,670,100,100,false);
    //rect(120,650,100,100,true);
    context.fill();

    context.shadowColor=undefined;
    context.shadowOffsetX=0;
    context.shadowOffsetY=0;
    context.stroke()
  }
function draw() {
    //context.clearRect(0,0,canvas.width,canvas.height)
  context.save();
  context.shadowColor="rgba(0,0,0,0.5)";
  context.shadowOffsetX=2;
  context.shadowOffsetY=2;
  context.shadowBlur=1;
  drawT();
  context.restore();

}
  context.fillStyle="rgba(100,140,230,0.5)";
  context.strokeStyle="rgba(100,140,230,0)";
  draw()

})