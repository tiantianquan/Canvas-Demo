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
  this.x = opt.x
  this.y = opt.y
}

Circle.prototype.getCubePos = function() {
  var incPI = 2 * Math.PI / this.cubeNum
  var cubePos = this.cubePos = []

  for (var i = 1; i <= this.cubeNum; i++) {
    var cubeX = this.x + Math.cos(incPI * i) * this.radii
    var cubeY = this.y - Math.sin(incPI * i) * this.radii

    cubePos.push([cubeX, cubeY])
  }
}

Circle.prototype.drew = function() {
  this.getCubePos()

  ctx.fillStyle = '#000'
  var that = this
  this.cubePos.forEach(function(c) {
    var cube = new Cube({
      fillColor: that.cubeOpt.fillColor,
      lineColor: that.cubeOpt.lineColor,
      lineWidth: that.cubeOpt.lineWith,
      long: that.cubeOpt.long,
      x: c[0],
      y: c[1]
    })
    cube.drew()
  })
}

var Cube = function(opt) {
  var opt = opt || {}
  this.long = opt.long
  this.fillColor = opt.fillColor
  this.lineColor = opt.lineColor
  this.lineWidth = opt.lineWidth
  this.x = opt.x
  this.y = opt.y
}

Cube.prototype.getPos = function() {
  var pos = this.pos = []
  var firPI = Math.PI / 4
  var incPI = Math.PI / 2
  for (var i = 0; i <= 3; i++) {
    var thePI = firPI + incPI * i
    var x = this.x + Math.cos(thePI) * this.long / Math.sqrt(2)
    var y = this.y - Math.sin(thePI) * this.long / Math.sqrt(2)
    pos.push([x, y])
  }
}


Cube.prototype.drew = function() {
  this.getPos()
  ctx.beginPath()
  this.pos.forEach(function(p, i) {
    if (i === 0) ctx.moveTo(p[0], p[1])
    else ctx.lineTo(p[0], p[1])
  })
  ctx.closePath()
  ctx.fillStyle = this.fillColor || undefined
  ctx.lineWidth = this.lineWidth
  ctx.strokeStyle = this.lineColor || undefined
  ctx.fill()
  ctx.stroke()

  console.log(this.long)

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


test1()