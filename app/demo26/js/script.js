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

var Point = function() {
  this.strokeStyle = '#444'
  this.getPoint()
    //最近的四个点
  this.nearPoint = []
}

Point.prototype.getPoint = function() {
  this.x = util.random(0, cw)
  this.y = util.random(0, ch)
}

Point.prototype.getLength = function(p1, p2) {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))
}

Point.prototype.move = function() {
  var that = this
  TweenLite.to(this, 10, {
    x: util.random(0, window.innerWidth),
    y: util.random(0, window.innerHeight),
    ease: Linear.easeNone,
    onComplete: function() {
      that.move()
    }
  })
}

Point.prototype.draw = function() {
  ctx.strokeStyle = this.strokeStyle
  ctx.lineWidth = 0.3
  ctx.beginPath()
  for (var i = 0; i < this.nearPoint.length; i++) {
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.nearPoint[i].x, this.nearPoint[i].y)
  }
  ctx.closePath()
  ctx.stroke()

  var l = 3
  ctx.fillStyle = '#777'
  ctx.fillRect(this.x-l/2, this.y-l/2, l, l)

}

var points = []


function main() {
  for (var i = 0; i < 30; i++) {
    var point = new Point()
    points.push(point)
  }

  points.forEach(function(p, i, arr) {
    for (var n = 1; n < arr.length - i; n++) {
      p.nearPoint.push(arr[i + n])
    }

    p.move()
  })

  util.loop(function() {
    ctx.fillStyle = '#eee'
    ctx.fillRect(0, 0, c.width, c.height)

    // points.forEach(function(p, i, arr) {
    //   p.x = util.random(0, window.innerWidth)
    //   p.y = util.random(0, window.innerHeight)

    // })

    points.forEach(function(p) {
      p.draw()
    })
  })

}



main()