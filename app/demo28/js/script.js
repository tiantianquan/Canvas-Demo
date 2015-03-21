var c = document.querySelector('#c')
var ctx = c.getContext('2d')
var cw = window.innerWidth
var ch = window.innerHeight
c.width = cw
c.height = ch

util.hackHighDpi(c, ctx)

cw = window.innerWidth
ch = window.innerHeight

ctx.fillStyle = '#eee'
ctx.fillRect(0, 0, c.width, c.height)

//------------------------------

var Circle = function(opt) {
  var opt = opt || {}
  this.x = opt.x || cw / 2
  this.y = opt.y || ch / 2
  this.lineWidth = opt.lineWidth || 1
  this.strokeStyle = opt.strokeStyle || '#000'

  this.startPI = opt.startPI
  this.arcPI = opt.arcPI
  this.radii = opt.radii



}

Circle.prototype.draw = function() {
  this.endPI = this.startPI + this.arcPI

  ctx.beginPath()
  ctx.arc(this.x, this.y, this.radii, this.startPI, this.endPI)
  ctx.lineWidth = this.lineWidth
  ctx.strokeStyle = this.strokeStyle
  ctx.stroke()
}

//等值角度增加
function test1() {
  var num = 45
  var arcPI = Math.PI
  var addPI = Math.PI / 15
  var startRadii = 20
  var addRadii = 2


  var cc = new Circle({
    radii: startRadii,
    startPI: -Math.PI / 2,
    arcPI: arcPI,
    lineWidth: 2,
    strokeStyle: '#000'
  })

  for (var i = 1; i <= num; i++) {
    cc.startPI += addPI
    cc.radii += addRadii + i / 10
    cc.strokeStyle = '#' + i * 111
    cc.draw()
  }
}


//等值弧度增加
function test2() {
  var num = 60
  var arcPI = Math.PI
  var startRadii = 20
  var addRadii = 2

  var addL = 1
 
  var cc = new Circle({
    radii: startRadii,
    startPI: -Math.PI / 2,
    arcPI: arcPI,
    lineWidth: 2,
    strokeStyle: '#000'
  })

  for (var i = 1; i <= num; i++) {
    cc.radii += addRadii + i / 20

    cc.startPI += 2*Math.PI*addL/cc.radii + i/800

    cc.strokeStyle = '#' + i * 111
    cc.draw()
  }
}


// test1()

test2()