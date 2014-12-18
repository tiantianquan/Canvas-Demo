var c = document.querySelector('#c')
var ctx = c.getContext('2d')



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

  this._points = [
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

var Rect = function(opt) {
  this.points = opt.points
  this.fillStyle = opt.fillStyle

  var originPoints = this.originPoints = this.points
    //TODO:clone
  this.originPoints = JSON.parse(JSON.stringify(this.points));

}

Rect.prototype.drew = function() {
  ctx.fillStyle = this.fillStyle
  ctx.fillRect(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y)
}

var rects = []
var bigBox
var boxes = []
var dur
var delay
var w
var h
var windowL
var ratio
var smallL
var bigL


function init() {
  dur = 2
  delay = 2
  w = window.innerWidth
  h = window.innerHeight
  windowL = w > h ? h : w
  ratio = 1.4
  smallL = windowL / (1 + ratio)
  bigL = ratio * smallL
    //-------------------------
  c.width = windowL
  c.height = windowL
  util.hackHighDpi(c, ctx)
    //----------------------------

  bigBox = new Box({
    cx: windowL / 2,
    cy: windowL / 2,
    long: bigL,
    rotate: 0,
    scale: 1,
  })

  for (var i = 0; i < 4; i++) {
    var box = new Box({
      fillStyle: '#fff',
      cx: bigBox.realPoints[i][0],
      cy: bigBox.realPoints[i][1],
      rotate: 0,
      scale: 1,
      long: smallL
    })
    boxes.push(box)
  }

  rects.push(new Rect({
    points: [{
      x: 0,
      y: 0,
    }, {
      x: windowL / 2,
      y: windowL
    }],
    fillStyle: '#fff'
  }))
  rects.push(new Rect({
    points: [{
      x: windowL / 2,
      y: 0
    }, {
      x: windowL,
      y: windowL
    }],
    fillStyle: '#fff'
  }))
  rects.push(new Rect({
    points: [{
      x: 0,
      y: 0
    }, {
      x: windowL,
      y: smallL
    }],
    fillStyle: '#fff'
  }))
  rects.push(new Rect({
    points: [{
      x: 0,
      y: windowL - smallL
    }, {
      x: windowL,
      y: windowL
    }],
    fillStyle: '#fff'
  }))

}

function setup() {
  rects.forEach(function(r, index, list) {
    if (index === 0) {
      TweenLite.to(r.points[1], delay / 2, {
        x: 0,
      })
    }
    if (index === 1) {
      TweenLite.to(r.points[0], delay / 2, {
        x: windowL,
      })
    }
    if (index === 2) {
      TweenLite.to(r.points[1], delay / 2, {
        delay: delay / 2,
        y: 0,
      })
    }
    if (index === 3) {
      TweenLite.to(r.points[0], delay / 2, {
        delay: delay / 2,
        y: windowL,
      })
    }
  })

  bigBox.tween({
    delay: delay,
    rotate: a.rotate1,
    scale: 0,
    duration: dur,
  })

  boxes.forEach(function(b) {
    var tween = {
      go: function() {
        b.tween({
          delay: delay,
          rotate: a.rotate2,
          scale: 0,
          duration: dur,
        })
      },
    }

    tween.go()
  })
}

function boot(opt) {
  bigBox.default()
  boxes.forEach(function(b) {
    b.default()
    b.fillStyle = opt.color
  })

  rects.forEach(function(r) {
    r.fillStyle = opt.color
    r.points = JSON.parse(JSON.stringify(r.originPoints));
  })
}

var a = {
  fillStyle: '#222',
  rotate1: Math.PI,
  rotate2: 2 * Math.PI
}

function drew() {
  ctx.fillStyle = a.fillStyle
  ctx.fillRect(0, 0, windowL, windowL)

  rects.forEach(function(r) {
    r.drew()
  })

  for (var i = 0; i < 4; i++) {
    boxes[i].cx = bigBox.realPoints[i][0]
    boxes[i].cy = bigBox.realPoints[i][1]
    boxes[i].drew()
  }
}


setTimeout(function() {
  init()
  setup()

  var t = true
  setInterval(function() {
    if (t) {
      boot({
        color: '#222',
      })
      a.fillStyle = '#fff'
      a.rotate1 = -a.rotate1
      a.rotate2 = -a.rotate2
      t = false
    } else {
      boot({
        color: '#fff',
      })
      a.fillStyle = '#222'
      a.rotate1 = -a.rotate1
      a.rotate2 = -a.rotate2
      t = true
    }
    setup()

  }, 4000)

  util.loop(function() {

    drew()
  })
}, 1000)