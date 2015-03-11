var c = document.querySelector('#c')
var ctx = c.getContext('2d')
var cw = window.innerWidth
var ch = window.innerHeight
c.width = cw
c.height = ch

util.hackHighDpi(c, ctx)

ctx.fillStyle = '#eee'
ctx.fillRect(0, 0, c.width, c.height)

function loop(callback) {
  callback()
  requestAnimationFrame(function() {
    loop(callback)
  })
}


var Circle = function(opt) {
  var opt = opt || {}
  this.radii = opt.radii
  this.cubeNum = opt.cubeNum
  this.cubeOpt = opt.cubeOpt
  this.startPI = opt.startPI || 0
  this.x = opt.x
  this.y = opt.y
}

Circle.prototype.getCubePos = function() {
  var incPI = 2 * Math.PI / this.cubeNum
  var cubePos = this.cubePos = []

  for (var i = 1; i <= this.cubeNum; i++) {
    var cubeX = this.x + Math.cos(this.startPI + incPI * i) * this.radii
    var cubeY = this.y - Math.sin(this.startPI + incPI * i) * this.radii

    cubePos.push([cubeX, cubeY])
  }
}

Circle.prototype.drew = function() {
  this.getCubePos()

  var that = this
  this.cubePos.forEach(function(c, i, arr) {
    that.cubeOpt.x = that.cubeOpt.cx = c[0]
    that.cubeOpt.y = that.cubeOpt.cy = c[1]


    // that.cubeOpt.fillStyle = '#' + i * 22

    that.cubeOpt.rotate = 2 * Math.PI / (arr.length) * i
    var cube = new Box(that.cubeOpt)

    cube.drew()
  })
}

// var Cube = function(opt) {
//   var opt = opt || {}
//   this.long = opt.long
//   this.fillColor = opt.fillColor
//   this.lineColor = opt.lineColor
//   this.lineWidth = opt.lineWidth
//   this.x = opt.x
//   this.y = opt.y
// }

// Cube.prototype.getPos = function() {
//   var pos = this.pos = []
//   var firPI = Math.PI / 4
//   var incPI = Math.PI / 2
//   for (var i = 0; i <= 3; i++) {
//     var thePI = firPI + incPI * i
//     var x = this.x + Math.cos(thePI) * this.long / Math.sqrt(2)
//     var y = this.y - Math.sin(thePI) * this.long / Math.sqrt(2)
//     pos.push([x, y])
//   }
// }


// Cube.prototype.drew = function() {
//   this.getPos()
//   ctx.beginPath()
//   this.pos.forEach(function(p, i) {
//     if (i === 0) ctx.moveTo(p[0], p[1])
//     else ctx.lineTo(p[0], p[1])
//   })
//   ctx.closePath()
//   ctx.fillStyle = this.fillColor || undefined
//   ctx.lineWidth = this.lineWidth
//   ctx.strokeStyle = this.lineColor || undefined
//   ctx.fill()
//   ctx.stroke()
// }


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


function test1() {
  for (var i = 0; i < 20; i++) {
    var cc = new Circle({
      radii: i * i * i / 20,
      cubeNum: 50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      cubeOpt: {
        long: 0.1 + i * 0.03,
        fillColor: '#000',
      }
    })

    cc.drew()
  }
}


function test2() {
  for (var i = 0; i < 20; i++) {
    var cc = new Circle({
      radii: i * i * i / 20,
      cubeNum: 50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      cubeOpt: {
        fillStyle: '#000',
        rotate: 0,
        scale: 1,
        long: 0.1 + i * 0.1
      }
    })
    cc.drew()
  }
}

function test3() {
  for (var i = 0; i < 30; i++) {

    var cc = new Circle({
      radii: 5 + i * i * i / 80,
      cubeNum: i * 3,
      startPI: i,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      cubeOpt: {
        fillStyle: '#000',
        rotate: 0,
        scale: 1,
        long: i * 0.1
      }
    })
    cc.drew()
  }

}

function test4() {
  for (var i = 1; i <= 5; i++) {

    var cc = new Circle({
      radii: 40*i,
      cubeNum: 20,
      // startPI: 0,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      cubeOpt: {
        fillStyle: '#444',
        rotate: 0,
        scale: 0.3*i,
        long: 25
      }
    })
    cc.drew()
  }
}


function main() {
  // test1()

  // test2()

  // test3()

  test4()
}

main()