var c = document.querySelector('#c')
var ctx = c.getContext('2d')
c.width = window.innerWidth
c.height = window.innerHeight
  // ctx.globalCompositeOperation = 'lighter'
ctx.clean = function() {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, c.width, c.height)
}

var toolFn = {
  getSetProp: function(arg, propStr, setCallback, getCallback) {
    if (arg.length === 0) {
      if (!!getCallback)
        getCallback(this)
      return this[propStr]
    } else {
      this[propStr] = arg[0]
      if (!!setCallback)
        setCallback(this, arg)
      return this;
    }
  }
}

var Curve = function(opt) {
  this.fnx = opt.fnx
  this.fny = opt.fny
  this.center = opt.center
  this.dataRange = opt.dataRange
  this.realRange = opt.realRange

  // this.drew()
}
Curve.prototype.convertRange = function(data) {
  var dataRange = this.dataRange
  var realRange = this.realRange

  var x = realRange[0] + (data[0] - dataRange[0]) / (dataRange[1] - dataRange[0]) * (realRange[1] - realRange[0])
  var y = realRange[0] + (data[1] - dataRange[0]) / (dataRange[1] - dataRange[0]) * (realRange[1] - realRange[0])
  return [x, y]
}
Curve.prototype.transPoint = function(point) {
  var center = this.center
  return [center[0] + point[0], center[1] - point[1]]
}

Curve.prototype.drew = function() {
  var center = this.center
  var fnx = this.fnx
  var fny = this.fny
  var dataRange = this.dataRange
  var realRange = this.realRange

  // ctx.moveTo(center[0], center[1])
  //所有lineTo 以一个像素为单位

  // var i = dataRange[0];
  var p = (realRange[1] - realRange[0]) / (dataRange[1] - dataRange[0])
  var i = 0
  var v = this.v
  ctx.beginPath()
  while (i <= p) {
    var t = this.transPoint(this.convertRange([fnx(i), fny(i)]))
    if (i === 0)
      ctx.moveTo(t[0], t[1])
    ctx.lineTo(t[0], t[1])
      // ctx.strokeStyle='rgba('+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+',0.3)'
    i += v
  }
  // ctx.closePath()
  ctx.strokeStyle='#fff'
  ctx.stroke()

}

var curve = new Curve({
  fnx: function(x) {
    return Math.cos(x)
  },
  fny: function(y) {
    return Math.sin(4 * y)
  },
  center: [c.width / 2, c.height / 2],
  dataRange: [0, 2 * Math.PI],
  realRange: [0, 2000]
})

var tween = {
  v: 1.1,
}
TweenLite.to(tween, 20, {
  v: 1,
  delay: 1,
  onUpdate: function() {
    // console.log(tween.v)
    curve.v = tween.v
    // ctx.strokeStyle = 'rgba(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',0.3)'

  }
})

function loop() {
  ctx.clearRect(0, 0, c.width, c.height)
  curve.drew()
  window.requestAnimationFrame(loop)
}
loop()