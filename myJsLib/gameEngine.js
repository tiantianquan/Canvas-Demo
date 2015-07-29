//矢量
var Vector2 = function(x, y, space) {
  this.x = x
  this.y = y
  this.push(x, y)
  this.space = space
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
  var arr = this.convertToArr()
  arr.push(1)

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

//转换为普通数组
Vector2.prototype.convertToArr = function() {
  return [this[0], this[1]]
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

//空间

//@{origin} vec 相对父空间原点
//@{theta} PI 旋转角度
var Space = function(origin, theta, superSpace) {
  this.origin = origin
  this.rotateAngle = theta === undefined ? 0 : theta
  this.superSpace = superSpace
}

//转换到父空间
Space.prototype.convertToSuperMat = function() {
  //相对平移
  var transVec = this.origin
    //轴单位矢量
    // var xAxisNormal = this.origin.add(new Vector2(1, 0).rotate(this.rotateAngle))
    // var yAxisNormal = this.origin.add(new Vector2(0, 1).rotate(this.rotateAngle))
  var xAxisNormal = new Vector2(1, 0).rotate(this.rotateAngle)
  var yAxisNormal = new Vector2(0, 1).rotate(this.rotateAngle)

  var arr1 = xAxisNormal.convertToArr()
  var arr2 = yAxisNormal.convertToArr()
  var arr3 = transVec.convertToArr()
  arr1.push(0)
  arr2.push(0)
  arr3.push(0)

  return new Matrix(arr1, arr2, arr3)
}

//世界空间,默认为屏幕中心
var WorldSpace = function(center) {
  this.center = center
}

WorldSpace.prototype = new Space(new Vector2(0, 0))

WorldSpace.prototype.getRealPoint = function(vec) {
  return new Vector2(this.center.x + vec.x, this.center.y - vec.y)
}

//转换到另一空间(另一空间不能有旋转)
// Space.prototype.convertToOtherSpaceMat = function(otherSpace) {
//   //相对平移
//   var transVec = this.origin.sub(otherSpace.origin)
//     //轴单位矢量
//   var xAxisNormal = this.origin.add(new Vector2(1, 0).rotate(this.rotateAngle)).sub(oterSpace.origin)
//   var yAxisNormal = this.origin.add(new Vector2(0, 1).rotate(this.rotateAngle)).sub(oterSpace.origin)

//   return new Matrix(
//     xAxisNormal.convertToArr().push(0),
//     yAxisNormal.convertToArr().push(0),
//     transVec.convertToArr().push(0)
//   )
// }


//时间线
var TimeLine = function(opt) {
  this.deltTime = 1 / opt.frame
}

TimeLine.prototype.start = function(mainFun) {
  setInterval(mainFun, this.deltTime)
}


var Clock = function(opt) {
  this.timeCycles = opt.timeCycles
  this.timeScale = opt.timeScale
  this.isPaused = opt.isPaused
  this.cyclesPerSecond = opt.cyclesPerSecond
}

Clock.prototype = {
  secondsToCycles: function(timeSeconds) {
    return timeSeconds * this.cyclesPerSecond
  },
  cyclesToSeconds: function(timeCycles) {
    return timeCycles / this.cyclesPerSecond
  },
  getTimeCycles: function() {
    return this.timeCycles
  },
  update: function(dtRealSeconds) {
    if (!this.isPaused) {
      var dtScaledCycles = this.secondsToCycles(dtRealSeconds * this.timeScale)
      this.timeCycles += dtScaledCycles
    }
  },
  setPaused: function(isPaused) {
    this.isPaused = isPaused
  },
  setTimeScale: function(scale) {
    this.timeScale = scale
  },
  singleStep: function() {
    if (this.isPaused) {
      var dtScaledCycles = this.secondsToCycles(1 / 30 * this.timeScale)

      this.timeCycles += dtScaledCycles
    }
  }

}