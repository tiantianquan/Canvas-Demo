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

var vec = new Vector2(100,0)

ctx.fillStyle= '#000'
ctx.fillRect(vec.x,vec.y,10,10)

vec = vec.rotate(Math.PI/2)
ctx.fillRect(vec.x,vec.y,10,10)
