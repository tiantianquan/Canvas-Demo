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

var LowPoly = function(opt){
  this.opt = opt || {}
  this.gap = opt.gap
  this.cw = opt.cw
  this.ch = opt.ch
  this.points = []
}

LowPoly.prototype.getPoints = function(){
  var x = this.cw/this.gap
}