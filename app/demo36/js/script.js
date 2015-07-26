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

var rightSpeed = new Vector2(10, 0)
var g = new Vector2(0, -1)
var downSpeed = new Vector2(0,0)

var vec = new Vector2(0, 0, worldSpace)

util.loop(function() {
  downSpeed = downSpeed.add(g)
  vec = vec.add(rightSpeed).add(downSpeed)
  var vec2 = worldSpace.getRealPoint(vec)

  ctx.fillStyle = '#777'
  ctx.beginPath()
  ctx.arc(vec2.x, vec2.y, 5, 0, Math.PI * 2, true)
  ctx.closePath()
  ctx.fill()
})