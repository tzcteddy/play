
#### canvas元素属性
| 属性| 简介|
|:---------|:------|
|width||
|height||


####canvas元素方法
| 方法| 简介|
|:---------|:------|
|getContext()||
|toDataURL(type,quality)||
|toBlob(callback,type,args...)||


####CanvasRenderingContext2D对象所含属性
|属性|简介|
|:------|:------|
|canvas||
|fillStyle||
|strokeStyle||
|font||
|globalAlpha||
|globalCompsiteOperation||
|lineCap||
|lineWidth||
|lineJoin||
|miterLimit||
|shadowColor||
|shadowOffsetX||
|shadowOffsetY||
|shadowBlur||
|textAlign||
|textBaseline||


####CanvasRenderingContext2D方法
| 方法|简介 ||
|:---------|:------|:------|
|save()||
|restore()||
|fill()||
|fillRect()||
|strokeRect()||
|stroke()||
|createLinearGradient(double x0,double y0,double x1,double y1)|创建线性渐变，传入方法的参数表示渐变线的两个断电，<br>该方法返回一个CanvasGradient实例，可以通过<br>CanvasGradient.addColorStop()方法来向该渐变色<br>增加颜色停止点gradient.addColorStop(0,'blue')...5个|
|createRadialGradient()|创建放射性渐变，该方法参数代表<br>位于圆锥形渐变区两端的圆形，<br>与createLinearGradient方法一样，返回CanvasGradient实例|
|createPattern(image,repeatString)|创建一个可以用来在canvas之中对图形<br>和文本进行描边和填充的图案<br>该方法第一个参数指定了图案所用的图像<br>它可以是image元素，canvas元素或者video元素；<br>第二个参数告诉浏览器对图形进行描边<br>或填充时如何重复图案,有效值repeat、repeat-x、repeat-y、no-repeat|
|beginPath()||
|closePath()||
|isPointInPath()||
|moveTo()||
|lineTo()||
|drawImage()||
|getImageData()||
|putImageData()||
|rect()||
|arc()||
|arcTo()||
|quadraticCurveTo()|二次贝塞尔曲线,曲线控制点坐标，锚点坐标|
