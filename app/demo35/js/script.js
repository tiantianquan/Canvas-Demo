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

var gap = 20
var radii = 50
var deltPi = 2 * Math.PI / gap

var state = true
var startPi = Math.PI/10

util.loop(function() {
  if (state) {
    radii--
    startPi++
  } else {
    radii++
    startPi--
  }

  if (radii == 0)
    state = false
  if (radii == 100)
    state = true


  ctx.clearRect(0, 0, cw, ch)
  ctx.fillStyle = '#eee'
  ctx.fillRect(0, 0, c.width, c.height)


  for (var i = 0; i < gap; i++) {
    var x = Math.cos(deltPi * i+startPi) * radii
    var y = Math.sin(deltPi * i+startPi) * radii
    var vec = new Vector2(x, y)
    vec = worldSpace.getRealPoint(vec)
    ctx.fillStyle = '#777'
    ctx.beginPath()
    ctx.arc(vec.x, vec.y, 5*radii/100, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
  }
})