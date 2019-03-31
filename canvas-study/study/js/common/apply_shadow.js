/**
 * Created by Administrator on 2019/3/31.
 */
define(["require","exports","getContext"],function (require,exports,getContext) {
  var canvas=getContext.canvas.name,
    context=getContext.canvas.context,
    SHADOW_COLOR="rgba(0,255,255,0.5)";
  context.strokeStyle="red";
  context.fillStyle='red';
  context.shadowColor=SHADOW_COLOR;
  context.shadowOffsetX=-10;
  context.shadowOffsetY=-10;
  context.shadowOffset=-5;
  context.shadowBlur=0.5;
  context.strokeRect(50,10,30,30);
  context.fillRect(10,10,30,30);
})