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

//点------------------------------
// var Point = function() {
//   this.strokeStyle = '#444'
//   this.getPoint()
//   this.addPoint()
//   this.linePoint = []
// }

// Point.list = []

// Point.prototype.addPoint = function() {
//   Point.list.push(this)
// }

// Point.prototype.getPoint = function() {
//   this.x = util.random(0, cw)
//   this.y = util.random(0, ch)
// }

// Point.prototype.getNearPoint = function() {
//   var l1
//   var that = this
//   Point.list.forEach(function(p2,i,arr) {
//     //判断相同点，则返回
//     if (Object.is(that, p2)) return

//     var l2 = that.getLength(that, p2)
//     if (l1 == undefined || l2 < l1 ) {
//       l1 = l2
//       that.nearPoint = p2
//     }
//   })

// }

// Point.prototype.getLength = function(p1, p2) {
//   return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))
// }

// Point.prototype.draw = function() {
//   ctx.fillStyle = '#444'
//   ctx.fillRect(this.x, this.y, 5, 5)
// }

// for (var i = 100; i >= 0; i--) {
//   var point = new Point()
//   point.draw()
// }

// // var p1 = Point.list[0]
// // Point.list.forEach(function(p1, i, arr) {
// //   var l1
// //   Point.list.forEach(function(p2) {
// //     var l2 = p1.getLength(p1, p2)
// //     if(l1 == undefined || l1<l2){
// //       l1 = l2
// //       p1.nearPoint = p2
// //     }
// //   })

// //   p1
// // })

// Point.list.forEach(function(p1) {
//   var linePoint = p1.linePoint
//   p1.linePoint.push(p1)

//   p1.getNearPoint()
//   linePoint.push(p1.nearPoint)

//   p1.nearPoint.getNearPoint()
//   linePoint.push(p1.nearPoint.nearPoint)

//   ctx.beginPath()
//   ctx.moveTo(linePoint[0].x, linePoint[0].y)
//   ctx.lineTo(linePoint[1].x, linePoint[1].y)
//   ctx.lineTo(linePoint[2].x, linePoint[2].y)
//   ctx.closePath()
//   ctx.strokeStyle = '#000'
//   ctx.lineWidth = 1
//   ctx.stroke()
// })

var LowPoly = function(opt) {
  this.opt = opt || {}
  this.gap = opt.gap
  this.cw = opt.cw || cw
  this.ch = opt.ch || ch
  this.pointStyle = opt.pointStyle
  this.lineStyle = opt.lineStyle
  this.pointRadii = opt.pointRadii
  this.lineWidth = opt.lineWidth
  this.points = []
  this._points = []

  this.getPoints()
}

LowPoly.prototype.getPoints = function() {
  var startX = (this.cw % this.gap) / 2
  var startY = (this.ch % this.gap) / 2
  var numX = Math.round(this.cw / this.gap)
  var numY = Math.round(this.ch / this.gap)

  for (var i = 0; i <= numX; i++) {
    var verticalList = []
    for (var j = 0; j <= numY - 1; j++) {
      var point = {}
      point.x = startX + this.gap * i
      point.y = startY + this.gap * j
      verticalList.push(point)
    }
    this.points.push(verticalList)
  }

}

LowPoly.prototype.movePoints = function(moveDis) {
  var gap = this.gap
  var points = this.points

  for (var i = 0; i < points.length; i++) {
    for (var j = 0; j < points[i].length; j++) {
      this.randomPoint(points[i][j], [-moveDis, moveDis])
    }
  }
}

LowPoly.prototype.randomPoint = function(point, dis) {
  var randomX, randomY
  randomX = util.random(dis)
  randomY = util.random(dis)
  point.x += randomX
  point.y += randomY
}

LowPoly.prototype.drawPoint = function() {
  var color = this.pointStyle
  var radii = this.pointRadii

  ctx.fillStyle = color
  this.points.forEach(function(vl) {
    vl.forEach(function(p) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, radii, 0, Math.PI * 2, false)
      ctx.fill()
    })
  })
}

LowPoly.prototype.drawLine = function(isdiagonal) {
  ctx.strokeStyle = this.lineStyle
  ctx.lineWidth = this.lineWidth
  var points = this.points

  ctx.beginPath()
  for (var i = 0; i < points.length; i++) {
    for (var j = 0; j < points[i].length; j++) {
      if (j === 0)
        ctx.moveTo(points[i][j].x, points[i][j].y)
      else
        ctx.lineTo(points[i][j].x, points[i][j].y)
    }
  }

  for (var j = 0; j < points[0].length; j++) {
    for (var i = 0; i < points.length; i++) {
      if (i === 0)
        ctx.moveTo(points[i][j].x, points[i][j].y)
      else
        ctx.lineTo(points[i][j].x, points[i][j].y)
    }
  }

  if (isdiagonal === true) {
    for (var i = 0; i + 1 < points.length; i++) {
      for (var j = 0; j + 1 < points[i].length; j++) {
        ctx.moveTo(points[i][j + 1].x, points[i][j + 1].y)
        ctx.lineTo(points[i + 1][j].x, points[i + 1][j].y)
      }
    }
  }
  ctx.stroke()
}

LowPoly.prototype.drawColor = function() {
  var points = this.points
  for (var i = 0; i < points.length - 1; i++) {
    for (var j = 0; j < points[0].length; j++) {
      var l1 = points[i][j]
      var l2 = points[i + 1][j]
      var l3 = points[i][j + 1]

      var r1 = points[i + 1][j]
      var r2 = points[i + 1][j + 1]
      var r3 = points[i][j + 1]


      var color = tinycolor({
        h: i*5,
        s: .5,
        l: .5
      })

      function fillPath(f1, f2, f3) {
        if (f1 != undefined && f2 != undefined && f3 != undefined) {
          ctx.beginPath()
          ctx.moveTo(f1.x, f1.y)
          ctx.lineTo(f2.x, f2.y)
          ctx.lineTo(f3.x, f3.y)
          ctx.closePath()
            // ctx.fillStyle = '#' + (i + 1) * 111112
          ctx.fillStyle = color.toHexString()
          ctx.fill()
        }
      }

      fillPath(l1, l2, l3)
      fillPath(r1, r2, r3)


    }
  }
}

LowPoly.prototype.draw = function(opt) {
  var opt = opt || {}

  this.movePoints(opt.moveDis)

  if (!!opt.point)
    this.drawPoint()
  if (!!opt.line)
    this.drawLine(true)
  if (!!opt.color)
    this.drawColor()
}


function test1() {
  var lowP = new LowPoly({
    lineStyle: '#fff',
    lineWidth: 0.5,
    pointStyle: '#000',
    pointRadii: 2,
    gap: 50,
  })

  lowP.draw({
    moveDis: lowP.gap / 3,
    color: true,
  })

  c.addEventListener('mousemove', function(e) {
    ctx.fillStyle = '#eee'
    ctx.fillRect(0, 0, cw, ch)
    lowP.draw({
      moveDis: 1,
      color: true,
      line: true,
    })
  })
}

test1()