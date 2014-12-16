var c = document.querySelector('#c')
var ctx = c.getContext('2d')
c.width = window.innerWidth
c.height = window.innerHeight

util.hackHighDpi(c, ctx)


var cx = window.innerWidth / 2
var cy = window.innerHeight / 2
var long = 100
var m = [
  [1, 0],
  [0, 1]
]

var points = [
  [-long / 2, long / 2],
  [long / 2, long / 2],
  [long / 2, -long / 2],
  [-long / 2, -long / 2]
]

ctx.translate(cx, cy)

function drew(ps, fs) {
  ctx.beginPath()
  ctx.moveTo(ps[0][0], ps[0][1])
  for (var i = 1; i < ps.length; i++) {
    ctx.lineTo(ps[i][0], ps[i][1])
  }
  ctx.closePath()
  ctx.fillStyle = fs
  ctx.fill()
}

function translate(p) {
  var x = p[0]
  var y = p[1]

  p[0] = m[0][0] * x + m[0][1] * y
  p[1] = m[1][0] * x + m[1][1] * y
}

drew(points, 'rgba(0,0,0,.1)')



util.loop(function() {
  ctx.clearRect(-200, -200, window.innerWidth, window.innerHeight)
  m[0][1] += 0.001
  m[1][0] -= 0.001

  points.forEach(function(p) {
    translate(p)
  })

  drew(points)
})