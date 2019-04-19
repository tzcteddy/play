define(["require","exports","getContext"],function (require,exports,getContext) {
  let canvas=getContext.canvas.name,
    context=getContext.canvas.context,
    image=new Image(),
    scaleSlider=document.getElementById("scaleSlider"),
    scaleOutput=document.getElementById("scaleOutput"),
    scale=1.0,
    MINIMUM_SCALE=1.0,
    MAXIMUM_SCALE=3.0;
  
  function drawImage() {
    var w=canvas.width,
      h=canvas.height,
      sw=w*scale,
      sh=h*scale;
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(image,-sw/2+w/2,-sh/2+h/2,sw,sh);
  }
  function drawScaleText(value) {
    var text=parseFloat(value).toFixed(2);
    var percent=parseFloat(value-MINIMUM_SCALE)/
                  parseFloat(MAXIMUM_SCALE-MINIMUM_SCALE);
    scaleOutput.innerText=text;
    percent=percent<0.35?0.35:percent;
    scaleOutput.style.fontSize=percent*MAXIMUM_SCALE/1.5+'em';
  }
  scaleSlider.onchange=function (e) {
    scale=e.target.value;
    if(scale<MINIMUM_SCALE)scale=MINIMUM_SCALE;
    else if(scale>MAXIMUM_SCALE)scale=MAXIMUM_SCALE;
    drawScaleText(scale);
    drawImage();
  }
  context.fillStyle="cornflowerblue";
  context.strokeStyle='yellow';
  context.shadowColor='rgba(50,50,50,1.0)';
  context.shadowOffsetX=5;
  context.shadowOffsetY=5;
  context.shadowBlur=10;
  image.src="//hbimg.huabanimg.com/27663bf369f7b5e05f26d4d8dcc1bf68ac35ae0e5825b-a6ATNV_fw658";
  image.onload=function () {
    drawImage();
    drawScaleText(scaleSlider.value);
  }
});