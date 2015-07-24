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

var worldSpace = new WorldSpace(new Vector2(cw / 2, ch / 2))


util.loop(function() {
  ctx.fillStyle = '#000'
  ctx.fillRect(a.x, a.y, 10, 10)
})
