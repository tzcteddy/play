define(["require","exports"],function (require,exports) {
  var canvas=document.getElementById("canvas");
  var context=canvas.getContext("2d");
  exports.canvas= {
    name:canvas,
    context:context
  }
});