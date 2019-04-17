define(["require","exports","getContext"],function (require,exports,getContext) {
  let canvas=getContext.canvas.name;
  let context=getContext.canvas.context;
  function drawText() {
    context.save();
    context.shadowColor='rgba(100,100,150,0.8)';
    context.shadowOffsetX=5;
    context.shadowOffsetY=5;
    context.shadowBlur=10;
    context.fillStyle='cornflowerblue';
    context.fillText('HTML',20,250);
    context.strokeStyle='yellow';
    context.strokeText("HTML",20,250);
    context.restore();
  }
  function setClippingRegion(radius) {
    context.beginPath();
    context.arc(canvas.width/2,canvas.height/2,radius,0,Math.PI*2,false);
    context.clip();
  }
  function fillCanvas(color) {
    context.fillStyle=color;
    context.fillRect(0,0,canvas.width,canvas.height);
  }
  function endAnimation(loop) {
    clearInterval(loop);
    setTimeout(function (e) {
      context.clear(0,0,canvas.width,canvas.height);
      drawText();
    },1000);
  }
  function drawAnimationFrame(radius) {
    setClippingRegion(radius);
    fillCanvas("lightgray");
    drawText();
  }
  function animation() {
    var radius=canvas.width/2,
      loop;
    loop=window.setInterval(function () {
      radius-=canvas.width/1000;
      fillCanvas('charcoal');
      if(radius>0){
        context.save();
        drawAnimationFrame(radius);
        context.restore();
      }else {
        endAnimation(loop)
      }
    })
  }
  canvas.onmousedown=function () {
    animation();
  };
  context.lineWidth=0.5;
  context.font='128pt Comic-sans';
  drawText();
});