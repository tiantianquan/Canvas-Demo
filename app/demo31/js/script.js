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

var Line = function(opt) {
  var opt = opt || {}
  this.x1 = opt.x1
  this.y1 = opt.y1
  this.x2 = opt.x2
  this.y2 = opt.y2
  this.lineWidth = opt.lineWidth
  this.strokeStyle = opt.strokeStyle
}

Line.prototype.draw = function() {
  ctx.lineWidth = this.lineWidth
  ctx.strokeStyle = this.strokeStyle

  ctx.beginPath()
  ctx.moveTo(this.x1, this.y1)
  ctx.lineTo(this.x2, this.y2)
  ctx.closePath()
  ctx.stroke()
}

var BezierCurve = function(opt) {
  this.cp1x = opt.cp1x

}

var Circle = function(opt) {
  this.radii = opt.radii
  this.cx = opt.cx
  this.cy = opt.cy
  this.partNum = opt.partNum
  this.pointList = []
}

Circle.prototype.getPoint = function() {
  var deltaPI = this.deltaPI = 2 * Math.PI / this.partNum
  for (var i = 0; i < this.partNum; i++) {
    var point = {}
    point.x = this.cx + Math.cos(i * deltaPI) * this.radii
    point.y = this.cy - Math.sin(i * deltaPI) * this.radii
    this.pointList.push(point)
  }
}

var Graph = function(opt) {
  this.circle = opt.circle
  this.long = opt.long
  this.randomScope = opt.randomScope
  this.strokeStyle = opt.strokeStyle
  this.lineWidth = opt.lineWidth
  this.startPointList = []
  this.endPointList = []
}

Graph.prototype.getPoint = function() {
  var cir = this.circle
  var randomInner = this.randomScope[0]
  var randomOuter = this.randomScope[1]


  cir.getPoint()
  for (var i = 0; i < cir.pointList.length; i++) {
    var randomRadii = util.random(cir.radii - randomInner, cir.radii + randomOuter)
    var startPoint = {}
    var endPoint = {}
    startPoint.x = cir.cx + Math.cos(i * cir.deltaPI) * randomRadii
    startPoint.y = cir.cy - Math.sin(i * cir.deltaPI) * randomRadii
    endPoint.x = cir.cx + Math.cos(i * cir.deltaPI) * (randomRadii + this.long)
    endPoint.y = cir.cy - Math.sin(i * cir.deltaPI) * (randomRadii + this.long)
    this.startPointList.push(startPoint)
    this.endPointList.push(endPoint)
  }
}

Graph.prototype.drawLine = function() {
  this.getPoint()
  for (var i = 0; i < this.startPointList.length; i++) {
    var line = new Line({
      x1: this.startPointList[i].x,
      y1: this.startPointList[i].y,
      x2: this.endPointList[i].x,
      y2: this.endPointList[i].y,
      strokeStyle: this.strokeStyle,
      lineWidth: this.lineWidth
    })
    line.draw()
  }
}

Graph.prototype.drawCurve = function() {
  this.getPoint()
  ctx.strokeStyle = this.strokeStyle
  ctx.lineWidth = this.lineWidth
  for (var i = 0; i < this.startPointList.length; i++) {
    ctx.beginPath()
    ctx.moveTo(this.startPointList[i].x, this.startPointList[i].y)
    ctx.bezierCurveTo(10, 20, 30, 30,
        this.endPointList[i].x,
        this.endPointList[i].y)
      // ctx.closePath()
    ctx.stroke()
  }
}

Graph.prototype.draw = function(fun) {
  this.getPoint()
  ctx.strokeStyle = this.strokeStyle
  ctx.lineWidth = this.lineWidth
  for (var i = 0; i < this.startPointList.length; i++) {
    fun(this, i)
  }
}


function test1() {
  var cir = new Circle({
    radii: 200,
    cx: cw / 2,
    cy: ch / 2,
    partNum: 1000,
  })

  var graph = new Graph({
    circle: cir,
    long: 130,
    randomScope: [150, 0],
    strokeStyle: '#444',
    lineWidth: 5
  })


  graph.drawLine()
}

function test2() {
  var cir = new Circle({
    radii: 250,
    cx: cw / 2,
    cy: ch / 2,
    partNum: 1000,
  })

  var graph = new Graph({
    circle: cir,
    long: 0,
    randomScope: [20, 0],
    strokeStyle: '#444',
    lineWidth: 0.5
  })

  graph.draw(function(item, i) {
    var delta = 20
    var w = cw/2
    var h = ch/2
    ctx.beginPath()
    ctx.moveTo(item.startPointList[i].x, item.startPointList[i].y)
    ctx.bezierCurveTo(
        util.random(w-delta, w+delta),
        util.random(h-delta, h+delta),
        util.random(w-delta, w+delta),
        util.random(h-delta, h+delta),
        item.endPointList[i].x,
        item.endPointList[i].y)
      // ctx.closePath()
    ctx.stroke()
  })
}


// test1()
test2()

// util.addSelect(test1,test2)