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

Graph.prototype.draw = function() {
  for (var i = 0; i < this.startPointList.length; i++) {
    var line = new Line({
      x1: this.startPointList[i].x,
      y1: this.startPointList[i].y,
      x2: this.endPointList[i].x,
      y2: this.endPointList[i].y,
      strokeStyle: '#444',
      lineWidth: 5
    })
    line.draw()
  }
}


var cir = new Circle({
  radii: 200,
  cx: cw / 2,
  cy: ch / 2,
  partNum: 1000,
})

var graph = new Graph({
  circle: cir,
  long: 100,
  randomScope: [150, 0]
})

graph.getPoint()
graph.draw()