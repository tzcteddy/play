
let Paragraph=function (context,left,top,imageData,cursor) {
  this.context=context;
  this.left=left;
  this.top=top;
  this.lines={};
  this.activeLine=undefined;
  this.drawingSurface=imageData;
  this.cursor=cursor;
  this.blinkingInterval=undefined;
};
Paragraph.prototype={
  isPointInside:function (loc) {
    let c=this.context;
    c.beginPath();
    c.rect(this.left,this.top,this.getWidth(),this.getHeight());
    return c.isPointInPath(loc.x,loc.y);
  },
  getHeight:function () {
    let h=0;
    this.lines.forEach(line=>{
      h+=line.getHeight(this.context);
    });
    return h;
  },
  getWidth:function () {
    let w=0,
      widest=0;
    this.lines.forEach(line=>{
      w=line.getWidth(this.context);
      if(w>widest){
         widest=w;
      }
    });
    return widest;
  },
  draw:function () {
    this.lines.forEach(line=>{
      line.draw(this.context);
    })
  },
  erase:function (context,imageData) {
    context.putImageData(imageData,0,0);
  },
  addLine:function (line) {
    this.lines.push(line);
    this.activeLine=line;
    this.moveCursor(line.left,line.bottom);
  },
  insert:function (text) {
    this.erase(this.context,this.drawingSurface);
    this.activeLine.insert(text);

    let t=this.activeLine.text.substring(0,this.activeLine.caret),
      w=this.context.measureText(t).width;

    this.moveCursor(this.activeLine.left+w,this.activeLine.bottom);
    this.draw(this.context);
  },
  blinkCursor:function () {
    let self=this,
      BLINK_OUT=200,
      BLINK_INTERVAL=900;
    this.blinkingInterval=setInterval(function () {
      cursor.erase(context,self.drawingSurface);
      setTimeout(function (e) {
        cursor.draw(context,cursor.left,cursor.top+cursor.getHeight(context));
      },BLINK_OUT)
    },BLINK_INTERVAL);
  },
  moveCursorCloseTo:function (x,y) {
    var line=this.getLine(y);
    if(line){
      line.caret=this.getColumn(line,x);
      this.activeLine=line;
      this.moveCursor(line.getCaretX(context),line.bottom);
    }
  },
  moveCursor:function (x,y) {
    this.cursor.erase(this.context,this.drawingSurface);
    this.cursor.draw(this.context,x,y);
    if(!this.blinkingInterval){
      this.blinkCursor(x,y);
    }
  },
  moveLinesDown:function (start) {
    for(var  i=start;i<this.lines.length;++i){
      line=this.lines[i];
      line.bottom+=line.getHeight(this.context);
    }
  },
  newLine:function () {
    var textBeforeCursor=this.activeLine.text.substring(0,this.activeLine.caret),
        textAfterCursor=this.activeLine.text.substring(this.activeLine.caret),
      height=this.context.measureText("W").width+this.context.measureText("W").width/6,
      bottom=this.activeLine.bottom+height,
      activeIndex,
      line;
    this.erase(this.context,this.drawingSurface);
    this.activeLine.text=textBeforeCursor;

    line=new TextLine(this.activeLine.left,bottom);
    line.insert(textAfterCursor);
    activeIndex=this.lines.indexOf(this.activeLine);
    this.lines.splice(activeIndex+1,0,line);
    this.activeLine=line;
    this.activeLine.caret=0;

    activeIndex=this.lines.indexOf(this.activeLine);
    for(var i=activeIndex+1;i<this.lines.length;++i){
      line=this.lines[i];
      line.bottom+=height;
    }
    this.draw();
    this.cursor.draw(this.context,this.activeLine.left,this.activeLine.bottom);

  },
  getLine:function (y) {
    var line;
    for(var i=0;i<this.lines.length;++i){
      line=this.lines[i];
      if(y>line.bottom-line.getHeight(context)&&y<line.bottom){
        return line;
      }
    }
    return undefined;
  },
  getColumn:function (line,x) {
    var found=false,
      before,
      after,
      closest,
      tmpLine,
      column;
    tmpLine=new TextLine(line.left,line.bottom);
    tmpLine.insert(line.text);
    while (!found&&tmpLine.text.length>0){
      before=tmpLine.left+tmpLine.getWidth(context);
      tmpLine.removeLastCharacter();
      after=tmpLine.left+tmpLine.getWidth(context);
      if(after<x){
        closest=x-after<before-x?after:before;
        column=closest===before?tmpLine.text.length+1:tmpLine.text.length;
        found=true;
      }
    }
    return column;
  },
  activeLineIsOutOfText:function () {
    return this.activeLine.text.length===0;
  },
  activeLineIsTopLine:function () {
    return this.lines[0]===this.activeLine;
  },
  moveUpOneLine:function () {
    var lastActiveLine,lastActiveText,line,before,after,activeIndex;
    lastActiveLine=this.activeLine;
    lastActiveText=""+lastActiveLine.text;
     activeIndex=this.lines.indexOf(this.activeLine);
    this.activeLine=this.lines[activeIndex-1];
    this.activeLine.caret=this.activeLine.text.length;

    this.lines.splice(activeIndex,1);
    this.moveCursor(this.activeLine.left+this.activeLine.getWidth(this.context),
                    this.activeLine.bottom);
    this.activeLine.text+=lastActiveText;

    for(var i=activeIndex;i<this.lines.length;++i){
      line=this.lines[i];
      line.bottom-=line.getHeight(this.context);
    }
  },
  backspace:function () {
    var lastActiveLine,
      activeIndex,
      t,w;
    this.context.save();
    if(this.activeLine.caret===0){
      if(!this.activeLineIsTopLine()){
        this.erase(this.context,this.drawingSurface);
        this.moveUpOneLine();
        this.draw();
      }
    }else {
      this.context.strokeStyle=strokeStyleSelect.value;
      this.context.fillStyle=fillStyleSelect.value;
      this.erase(this.context,this.drawingSurface);
      this.activeLine.removeCharacterBeforeCaret();
      t=this.activeLine.text.slice(0,this.activeLine.caret);
      w=this.context.measureText().width;
      this.moveCursor(this.activeLine.left+w,this.activeLine.bottom);
      this.draw(this.context);
      this.context.restore();
    }
  }
};