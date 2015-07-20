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
        h: i * 5,
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


LowPoly.prototype.drawColor2 = function() {

  var color = []
  color[0] = '#eee'
  color[1] = '#ec0044'
  color[2] = '#bcc8c8'
  color[3] = '#122434'
  color[4] = '#5b615f'

  var points = this.points
  for (var i = 0; i < points.length - 1; i++) {
    for (var j = 0; j < points[0].length; j++) {
      var v = []
      v[1] = points[i][j]
      v[2] = points[i + 1][j]
      v[3] = points[i + 1][j + 1]
      v[0] = points[i][j + 1]

      function fillPath(f1, f2, f3) {
        if (f1 != undefined && f2 != undefined && f3 != undefined) {
          ctx.beginPath()
          ctx.moveTo(f1.x, f1.y)
          ctx.lineTo(f2.x, f2.y)
          ctx.lineTo(f3.x, f3.y)
          ctx.closePath()
            // ctx.fillStyle = '#' + (i + 1) * 111112
          ctx.fillStyle = color[Math.round(Math.random() * 5)]
          ctx.fill()
        }
      }

      var randomIndex = Math.round(Math.random() * 4)
      var sec = randomIndex + 1
      var thr = randomIndex + 2
      if (sec > 3) {
        sec = randomIndex - 1
      }
      if (thr > 3) {
        thr = randomIndex - 2
      }
      fillPath(v[randomIndex], v[sec], v[thr])
    }
  }
}

LowPoly.prototype.draw = function(opt) {
  var opt = opt || {}

  if (opt.randomPoint)
    this.movePoints(opt.moveDis)

  if (!!opt.point)
    this.drawPoint()
  if (!!opt.line)
    this.drawLine(true)
  if (!!opt.color)
    this.drawColor2()
}

function test1() {
  ctx.beginPath()
  ctx.arc(cw/2, ch/2, 300, 0, Math.PI * 2)
  ctx.clip()
  ctx.closePath()



  var lowP = new LowPoly({
    lineStyle: '#000',
    lineWidth: 0.5,
    pointStyle: '#000',
    pointRadii: 2,
    gap: 20,
  })

  lowP.draw({
    randomPoint: false,
    color: true,
  })

  // var scratchCanvas = document.createElement("canvas");
  // scratchCanvas.width = 300;
  // scratchCanvas.height = 300;
  // var scratchCTX = scratchCanvas.getContext("2d");
  // scratchCTX.save(); // 创建一个单独的区域
  // // 先把要裁剪的图像画出来
  // scratchCTX.fillStyle = '#0a87d6';
  // scratchCTX.fillRect(0, 0, 300, 300);
  // // 然后利用globalCompositeOperation实现裁剪效果
  // scratchCTX.fillStyle = "#000"; // 颜色不重要，但是需要全不透明
  // scratchCTX.globalCompositeOperation = 'destination-in';
  // scratchCTX.beginPath();
  // scratchCTX.arc(150, 150, 70, 0, Math.PI * 2, true);
  // scratchCTX.closePath();
  // scratchCTX.fill();
  // scratchCTX.restore();
  // // 将裁剪出来的图像绘制在原canvas上
  // ctx.drawImage(scratchCanvas, 0, 0);


}

test1()
