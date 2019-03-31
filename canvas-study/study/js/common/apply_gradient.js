/**
 * Created by Administrator on 2019/3/31.
 */
define(["require","exports","getContext"],function (require,exports,getContext) {
  var canvas=getContext.canvas.name;
  var context=getContext.canvas.context;
  function linearGradient() {
    var gradient=context.createLinearGradient(100,90,180,90);
    gradient.addColorStop(0,"red");
    gradient.addColorStop(0.25,"yellow");
    gradient.addColorStop(0.5,"green");
    gradient.addColorStop(0.75,"cadetblue");
    gradient.addColorStop(1,"blue");
    return gradient;
  }
  function radialGradient() {
    var gradient=context.createRadialGradient(canvas.width/2,canvas.height,10,canvas.width/2,0,100);
    gradient.addColorStop(0,"red");
    gradient.addColorStop(0.25,"yellow");
    gradient.addColorStop(0.5,"green");
    gradient.addColorStop(0.75,"cadetblue");
    gradient.addColorStop(1,"blue");
    return gradient;
  }
   context.lineJoin="round";
  context.lineWidth=10;

  context.font="18px Helvetical";
  context.fillText("点击任何地方",30,20);

  context.strokeStyle="burlywood";
  context.fillStyle="rgba(255,0,0,0.5)";
  context.fillStyle=linearGradient();
  context.fillStyle=radialGradient();
  context.strokeRect(10,50,80,80);
  context.fillRect(100,0,80,300);
  canvas.onclick=function () {
    context.clearRect(0,0,canvas.width,canvas.height)
  }
})