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

//----------------------------------------

var Cube = function(opt){
  this.x = opt.x
  this.y = opt.y
  this.long = opt.long
  this.fillStyle = opt.fillStyle
}

Cube.prototype.draw = function(){
  ctx.fillStyle = this.fillStyle
  ctx.fillRect(this.x,this.y,this.long,this.long)
}

var cc = new Cube({
  x:100,
  y:100,
  long:100,
  fillStyle:'#444'
})

cc.draw()