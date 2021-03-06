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

var clock = new Clock({
  timeCycles:0,
  timeScale:1,
  isPaused:false,
  cyclesPerSecond:30
})


