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




function loop(callback) {
  callback()
  requestAnimationFrame(function() {
    loop(callback)
  })
}


var Circle = function(opt) {
  var opt = opt || {}
  this.cx = opt.cx || window.innerWidth / 2
  this.cy = opt.cy || window.innerHeight / 2
  this.inRadii = opt.inRadii || 50
  this.outRadii = opt.outRadii || 100
  this.lineWidth = opt.lineWidth || 1
  this.strokeStyle = opt.strokeStyle || '#000'
  this.gapAngle = opt.gapAngle || 0.1 * 2 * Math.PI
  this.rotateAngle = opt.rotateAngle || 0
  this.tiltAngle = opt.tiltAngle || 0

  this.gapWidth = opt.gapWidth || 1

  this.animate = opt.animate || false
  this.circlePI = opt.circlePI === undefined ? 2 * Math.PI : opt.circlePI
  this.arcPI = opt.arcPI || {
    x: 0.1 * Math.PI,
    y: 0.1 * Math.PI
  }
}
Circle.prototype.getX = function(angle, inOutRadii, percent) {
  if (percent != undefined)
    return this.cx + Math.cos(angle) * inOutRadii * percent
  else
    return this.cx + Math.cos(angle) * inOutRadii
}

Circle.prototype.getY = function(angle, inOutRadii, percent) {
  if (percent != undefined)
    return this.cy - Math.sin(angle) * inOutRadii * percent
  else
    return this.cy - Math.sin(angle) * inOutRadii
}

Circle.prototype.angeldrew = function() {
  ctx.beginPath()
  for (var i = 0, l = 0; i <= this.circlePI; i += this.gapAngle, l++) {
    var endAngle = l * (2 * this.gapAngle) + this.tiltAngle
    ctx.moveTo(this.getX(i, this.outRadii), this.getY(i, this.outRadii))
    ctx.lineTo(this.getX(i - endAngle, this.outRadii), this.getY(i - endAngle, this.outRadii))
  }
  ctx.strokeStyle = this.strokeStyle
  ctx.lineWidth = this.lineWidth
  ctx.stroke()
}
Circle.prototype.linedrew = function() {
  ctx.beginPath()
  for (var i = -this.outRadii; i <= this.outRadii; i += this.gapWidth) {
    var angle = Math.acos(i / this.outRadii)
    ctx.moveTo(this.getX(this.tiltAngle + angle, this.outRadii), this.getY(this.tiltAngle + angle, this.outRadii))
    ctx.lineTo(this.getX(this.tiltAngle - angle, this.outRadii), this.getY(this.tiltAngle - angle, this.outRadii))
  }
  ctx.strokeStyle = this.strokeStyle
  ctx.lineWidth = this.lineWidth
  ctx.stroke()
}

var cc = new Circle({
  outRadii: 250,
  gapAngle: 0.004 * 2 * Math.PI,
  lineWidth: 0.5,
  strokeStyle: 'rgba(255,255,255,.6)',
  tiltAngle: 0.25 * Math.PI,
  gapWidth: 2,
})


ctx.fillStyle = '#eee'
ctx.fillRect(0, 0, c.width, c.height)

ctx.beginPath()
ctx.arc(cc.cx, cc.cy, cc.outRadii, 0, 2 * Math.PI)
ctx.closePath()

// ctx.fillStyle = 'hsl(200,30%,35%)'
var gradient = ctx.createLinearGradient(
  cc.cx, cc.cy - 250,
  cc.cx, cc.cy + 350
)
gradient.addColorStop(0, "hsl(200,30%,35%)")
gradient.addColorStop(1, "hsl(0,70%,50%)")
ctx.fillStyle = gradient;

ctx.fill()

cc.linedrew()
  // cc.angeldrew()