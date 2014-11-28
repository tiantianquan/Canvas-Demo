var c = document.querySelector('#c')
var ctx = c.getContext('2d')
c.width = window.innerWidth
c.height = window.innerHeight


function hackHighDpi(canvas, ctx) {
  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStorePixelRatio = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;

  var ratio = devicePixelRatio / backingStorePixelRatio;

  if (devicePixelRatio !== backingStorePixelRatio) {
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';

    ctx.scale(ratio, ratio);
  }

}

hackHighDpi(c, ctx)

var LineCircle = function(opt) {
  this.canvas = opt.canvas || document.querySelector('#c')
  this.radii = opt.radii || 200
  this.cx = opt.cx || window.innerWidth / 2
  this.cy = opt.cy || window.innerHeight / 2
  this.startAngle = opt.startAngle || 0
  this.gapAngle = opt.gapAngle || 0.01 * 2 * Math.PI
  this.strokeStyle = opt.strokeStyle || '#000'
  this.lineWidth = opt.lineWidth || 1
}

LineCircle.prototype.getX = function(angle) {
  return this.cx + Math.cos(angle) * this.radii
}

LineCircle.prototype.getY = function(angle) {
  return this.cy - Math.sin(angle) * this.radii
}
LineCircle.prototype.drew = function() {
  ctx.beginPath()
  for (var i = 0; i < 2 * Math.PI; i += this.gapAngle) {
    ctx.moveTo(this.getX(this.startAngle), this.getY(this.startAngle))
    ctx.lineTo(this.getX(i), this.getY(i))
  }
  ctx.strokeStyle = this.strokeStyle
  ctx.lineWidth = this.lineWidth
  ctx.stroke()
}

LineCircle.prototype.drew2 = function() {
  for (var i = 0; i < 2 * Math.PI; i += this.gapAngle) {
    ctx.moveTo(this.getX(i), this.getY(0))
    ctx.lineTo(this.getX(i), this.getY(i))
  }
  ctx.strokeStyle = this.strokeStyle
  ctx.lineWidth = this.lineWidth
  ctx.stroke()
}


// new LineCircle({
//   cy: 200,
//   cx: 200,
//   gapAngle: 0.01 * 2 * Math.PI,
//   radii: 100,
//   lineWidth: 1,
//   startAngle: 0 * 2 * Math.PI
// }).drew2()

// new LineCircle({
//   cx: 500,
//   cy: 200,
//   gapAngle: 0.01 * 2 * Math.PI,
//   radii: 100,
//   lineWidth: 1,
//   startAngle: 0 * 2 * Math.PI
// }).drew()

new LineCircle({
  gapAngle: 0.005 * 2 * Math.PI,
  radii: 250,
  lineWidth: 2,
  strokeStyle: '#222',
  startAngle: 0 * 2 * Math.PI,
}).drew()
