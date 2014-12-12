var c = document.querySelector('#c')
var ctx = c.getContext('2d')
c.width = window.innerWidth
c.height = window.innerHeight

function hackHighDpi(canvas, ctx) {
  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStorePixelRatio = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;

  var ratio = devicePixelRatio / backingStorePixelRatio;

  if (devicePixelRatio !== backingStorePixelRatio) {
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';

    ctx.scale(ratio, ratio);
  }
}

hackHighDpi(c, ctx)

ctx.fillStyle = '#eee'
ctx.fillRect(0, 0, c.width, c.height)

function loop(callback) {
  callback()
  requestAnimationFrame(function() {
    loop(callback)
  })
}


var Line = function(opt) {
  var opt = opt || {}
  this.gap = opt.gap
  this.maxWidth = opt.maxWidth
  this.minWidth = opt.minWidth
  this.long = opt.long
  this.cx = opt.cx
  this.cy = opt.cy
  this.strokeStyle = opt.strokeStyle
  this.pointList = []


  function init() {
    var lineNum = Math.floor((this.long + this.gap) / (this.gap + 1))
    var riseWidth = (this.maxWidth - this.minWidth) / (lineNum - 1)
    for (var i = 0; i < lineNum; i++) {
      var start = [this.cx - this.long / 2, this.cy - this.long / 2 + this.gap * i]
      var end = [this.cx + this.long / 2, this.cy - this.long / 2 + this.gap * i]
      this.pointList.push({
        startPoint: start,
        endPoint: end,
        width: this.minWidth + i * riseWidth
      })
    }
  }

  init.call(this)
}

Line.prototype.drew = function() {
  var that = this
  this.pointList.forEach(function(p) {
    ctx.beginPath()
    ctx.moveTo(p.startPoint[0], p.startPoint[1])
    ctx.lineTo(p.endPoint[0], p.endPoint[1])
    ctx.lineWidth = p.width
    ctx.strokeStyle = that.strokeStyle
    ctx.stroke()
  })
}

new Line({
  gap: 15,
  maxWidth: 5,
  minWidth: 1,
  long: 400,
  cx: window.innerWidth / 2,
  cy: window.innerHeight / 2,
  strokeStyle: '#9c3337',
}).drew()