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

//-------------------------------------------------
//二维向量
var Vector2 = function(x, y) {
  this.x = x
  this.y = y
}

//相减
Vector2.prototype.sub = function(v) {
  return new Vector2(this.x - v.x, this.y - v.y)
}

//相加
Vector2.prototype.add = function(v) {
  return new Vector2(this.x + v.x, this.y + v.y)
}

//点积
Vector2.prototype.dot = function(v) {
  return this.x * v.x + this.y * v.y
}

//包围体
var OBB = function(center, rotateAngle, width, height) {
  this.center = center
  this.rotateAngle = rotateAngle
  this.width = width
  this.height = height

  this.axisX = new Vector2(Math.cos(rotateAngle), Math.sin(rotateAngle))
  this.axisY = new Vector2(-Math.sin(rotateAngle), Math.cos(rotateAngle))
}

//获得在axis上的投影半径
OBB.prototype.getProjectionRadius = function(axis) {
  return Math.abs(this.width / 2 * axis.dot(this.axisX)) + Math.abs(this.height / 2 * axis.dot(this.axisY))
}


//碰撞机
var CollisionDetector = {}
CollisionDetector.OBBvsOBB = function(obb1, obb2) {
  var axis1 = obb1.axisX
  var axis2 = obb1.axisY
  var axis3 = obb2.axisX
  var axis4 = obb2.axisY

  var centerVec = obb1.center.sub(obb2.center)

  if (Math.abs(axis1.dot(centerVec)) >= obb1.getProjectionRadius(axis1) + obb2.getProjectionRadius(axis1)) return false
  if (Math.abs(axis2.dot(centerVec)) >= obb1.getProjectionRadius(axis2) + obb2.getProjectionRadius(axis2)) return false
  if (Math.abs(axis3.dot(centerVec)) >= obb1.getProjectionRadius(axis3) + obb2.getProjectionRadius(axis3)) return false
  if (Math.abs(axis4.dot(centerVec)) >= obb1.getProjectionRadius(axis4) + obb2.getProjectionRadius(axis4)) return false

  return true
}


var SquareBox = function(opt) {
  this.x = opt.x
  this.y = opt.y
  this.long = opt.long
  this.fillStyle = opt.fillStyle
  this.strokeStyle = opt.strokeStyle

  if (opt.isOBB === true) {
    this.obb = new OBB(new Vector2(this.x, this.y), 0, this.long, this.long)
  }
}

// SquareBox.prototype.set = function(prop,val){
//   this[prop] = val
//   this.obb
// }

SquareBox.prototype.setX = function(val) {
  this.x = val
  this.obb.center.x = val
}

SquareBox.prototype.setY = function(val) {
  this.y = val
  this.obb.center.y = val
}

SquareBox.prototype.draw = function() {
  var startPoint = [this.x - this.long / 2, this.y - this.long / 2]
  ctx.beginPath()
  ctx.moveTo(startPoint[0],startPoint[1])
  ctx.lineTo(startPoint[0] + this.long, startPoint[1])
  ctx.lineTo(startPoint[0] + this.long, startPoint[1] + this.long)
  ctx.lineTo(startPoint[0], startPoint[1] + this.long)
  ctx.closePath()
  ctx.strokeStyle = this.strokeStyle
  ctx.stroke()
}

var A = new SquareBox({
  x: 100,
  y: 100,
  long: 100,
  strokeStyle: 'blue',
  isOBB: true
})

var B = new SquareBox({
  x: 500,
  y: 100,
  long: 100,
  strokeStyle: 'red',
  isOBB: true
})


util.loop(function() {
  ctx.clearRect(0, 0, cw, ch)

  var x = A.x +1
  A.setX(x)
  if (CollisionDetector.OBBvsOBB(A.obb, B.obb)) {
    A.strokeStyle = 'black'
  }
  else{
    A.strokeStyle = 'blue'
  }
  A.draw()
  B.draw()
})
