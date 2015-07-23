//矢量
var Vector2 = function(x, y) {
  this.x = x
  this.y = y
  this.push(x, y)
}

Vector2.prototype = new Array()
  //标量乘法
Vector2.prototype.multiply = function(d) {
    return new Vector2(this.x * d, this.y * d)
  }
  //加法
Vector2.prototype.add = function(vec) {
    return new Vector2(this.x + vec.x, this.y + vec.y)
  }
  //减法
Vector2.prototype.sub = function(vec) {
    return new Vector2(this.x - vec.x, this.y - vec.y)
  }
  //矢量模
Vector2.prototype.magnitude2 = function() {
  return this.x * this.x + this.y * this.y
}
Vector2.prototype.magnitude = function() {
    return Math.sqrt(this.magnitudeSquare())
  }
  //归一化
Vector2.prototype.normalization = function() {
    return this.multiply(1 / this.magnitude())
  }
  //点积
Vector2.prototype.dot = function(vec) {
    return this.x * vec.x + this.y * vec.y
  }
  //夹角
Vector2.prototype.cosAngle = function(vec) {
  return this.dot(vec) / (this.magnitude() * vec.magnitude())
}

//乘以矩阵
Vector2.prototype.multiplyMat = function(mat) {
  var arr = []
  arr[0] = this[0]
  arr[1] = this[1]
  arr[2] = 1

  return [
    arr[0] * mat[0][0] + arr[1] * mat[1][0] + arr[2] * mat[2][0],
    arr[0] * mat[0][1] + arr[1] * mat[1][1] + arr[2] * mat[2][1],
    arr[0] * mat[0][2] + arr[1] * mat[1][2] + arr[2] * mat[2][2]
  ]
}
Vector2.prototype.multiplyMatToVec = function(mat) {
  var arr = this.multiplyMat(mat)
  return new Vector2(arr[0], arr[1])
}

Vector2.prototype.rotate = function(theta) {
  return this.multiplyMatToVec(Matrix.rotateMat(theta))
}

Vector2.prototype.trans = function(tx, ty) {
  return this.multiplyMatToVec(Matrix.transMat(tx, ty))
}

Vector2.prototype.scale = function(sx, sy) {
  if (arguments.length === 1)
    return this.multiplyMatToVec(Matrix.scaleMat(sx))
  else
    return this.multiplyMatToVec(Matrix.scaleMat(sx, sy))
}

//矩阵
var Matrix = function(r0, r1, r2) {
  this.push(r0, r1, r2)
}

Matrix.prototype = new Array()

Matrix.prototype.multiply = function(mat) {
  return new Matrix(
    [
      this[0][0] * mat[0][0] + this[0][1] * mat[1][0] + this[0][2] * mat[2][0],
      this[0][0] * mat[0][1] + this[0][1] * mat[1][1] + this[0][2] * mat[2][1],
      this[0][0] * mat[0][2] + this[0][1] * mat[1][2] + this[0][2] * mat[2][2]
    ], [
      this[1][0] * mat[0][0] + this[1][1] * mat[1][0] + this[1][2] * mat[2][0],
      this[1][0] * mat[0][1] + this[1][1] * mat[1][1] + this[1][2] * mat[2][1],
      this[1][0] * mat[0][2] + this[1][1] * mat[1][2] + this[1][2] * mat[2][2]
    ], [
      this[2][0] * mat[0][0] + this[2][1] * mat[1][0] + this[2][2] * mat[2][0],
      this[2][0] * mat[0][1] + this[2][1] * mat[1][1] + this[2][2] * mat[2][1],
      this[2][0] * mat[0][2] + this[2][1] * mat[1][2] + this[2][2] * mat[2][2]
    ]
  )
}

//旋转矩阵
Matrix.rotateMat = function(theta) {
  var cosTheta = Math.cos(theta)
  var sinTheta = Math.sin(theta)
  return new Matrix([cosTheta, sinTheta, 0], [-sinTheta, cosTheta, 0], [0, 0, 1])
}

//平移矩阵
Matrix.transMat = function(tx, ty) {
  return new Matrix([1, 0, 0], [0, 1, 0], [tx, ty, 1])
}

//缩放矩阵
Matrix.scaleMat = function(sx, sy) {
  if (argument.length === 1)
    return new Matrix([sx, 0, 0], [0, sx, 0], [0, 0, 1])
  else
    return new Matrix([sx, 0, 0], [0, sy, 0], [0, 0, 1])
}
