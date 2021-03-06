var c = document.querySelector('#c')
var ctx = c.getContext('2d')
var cw = window.innerWidth
var ch = window.innerHeight
c.width = cw
c.height = ch

util.hackHighDpi(c, ctx)

var Box = function(opt) {
  var opt = opt || {}
  var cx = this.cx = opt.cx
  var cy = this.cy = opt.cy
  var long = this.long = opt.long
  this.fillStyle = opt.fillStyle
  this.strokeStyle = opt.strokeStyle
  this.lineWidth = opt.lineWidth
  this._rotate = opt.rotate || 0
  this._scale = opt.scale === 0 ? 0 : opt.scale === undefined ? 1 : opt.scale

  this.isTrans = false

  this._points = opt.points || [
    [-long / 2, long / 2],
    [long / 2, long / 2],
    [long / 2, -long / 2],
    [-long / 2, -long / 2]
  ]

  this.points = util.copyArray(this._points)

  this.getRealXY()

  this.rotate(this._rotate).scale(this._scale)
}

Box.prototype.translate = function(m, baseOnLast) {
  if (this.isTrans === true)
    baseOnLast = true

  if (baseOnLast !== true)
    this.points = util.copyArray(this._points)

  this.points.forEach(function(p) {
    var x = p[0]
    var y = p[1]

    p[0] = m[0][0] * x + m[0][1] * y
    p[1] = m[1][0] * x + m[1][1] * y
    return p
  })

  this.isTrans = true
  this.getRealXY()
  return this
}

Box.prototype.rotate = function(theta, baseOnLast) {
  if (baseOnLast === true)
    this._rotate += theta
  else
    this._rotate = theta

  var cos = Math.cos
  var sin = Math.sin
  var m = [
    [cos(theta), -sin(theta)],
    [sin(theta), cos(theta)]
  ]

  return this.translate(m, baseOnLast)
}

Box.prototype.scale = function(times, baseOnLast) {
  if (baseOnLast === true)
    this._scale += times
  else
    this._scale = times

  var m = [
    [times, 0],
    [0, times]
  ]

  return this.translate(m, baseOnLast)
}
Box.prototype.default = function() {
  this.scale(1).rotate(0)
  this.isTrans = false
  this._tween.kill()
}

Box.prototype.getRealXY = function() {
  var that = this

  this.realPoints = util.copyArray(this.points)
  this.realPoints.forEach(function(p) {
    var x = p[0]
    var y = p[1]
    p[0] = that.cx + p[0]
    p[1] = that.cy - p[1]
    return p
  })
}

Box.prototype.tween = function(opt) {
  var that = this
  this._tween = TweenLite.to(this, opt.duration, {
    cx: opt.cx,
    cy: opt.cy,
    delay: opt.delay,
    _rotate: opt.rotate || this._rotate,
    _scale: opt.scale === 0 ? 0 : opt.scale === undefined ? this._scale : opt.scale,
    ease: Quad.easeInOut,
    onComplete: opt.onComplete,
    onUpdate: function() {
      that.rotate(that._rotate).scale(that._scale)
      that.isTrans = false
    }
  })
}

Box.prototype.drew = function() {
  this.getRealXY()
  ctx.beginPath()
  for (var i = 0; i < this.realPoints.length; i++) {
    if (i === 0)
      ctx.moveTo(this.realPoints[0][0], this.realPoints[0][1])
    else
      ctx.lineTo(this.realPoints[i][0], this.realPoints[i][1])
  }
  ctx.closePath()
  ctx.fillStyle = this.fillStyle
  ctx.strokeStyle = this.strokeStyle
  ctx.fill()
  this.isTrans = false
}

var boxes = []

for (var i = 0; i < 100; i++) {
  var b = new Box({
    cx: cw / 2 + i,
    cy: ch / 2 + i,
    long: 100,
    fillStyle: 'hsla(0,0%,'+ (100-i)+'%,'+ (100-i)/100 +')',
    rotate: 0,
    scale: 1
  })
  boxes.push(b)
}

function main() {
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, cw, ch)
  b.drew()

  boxes.forEach(function(b){
    b.drew()
  })
}
main()