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

var Paper = function(opt) {
  var opt = opt || {}
  this.bottomPaperStyle = opt.bottomPaperStyle
  this.topPaperStyle = opt.topPaperStyle
  this.backPaperStyle = opt.backPaperStyle

  this.anglePoint = opt.anglePoint || {
    x: window.innerWidth,
    y: 0
  }

  this.movePoint = opt.movePoint || this.anglePoint
}

Paper.prototype.drew = function() {

  var topPoint = {
    x: this.anglePoint.x - (Math.sqrt((this.anglePoint.x - this.movePoint.x) * (this.anglePoint.x - this.movePoint.x) + this.movePoint.y * this.movePoint.y) / 2 / (this.anglePoint.x - this.movePoint.x) * Math.sqrt((this.anglePoint.x - this.movePoint.x) * (this.anglePoint.x - this.movePoint.x) + this.movePoint.y * this.movePoint.y)),
    y: 0
  }

  var long = (this.anglePoint.x - this.movePoint.x) / 2 / (this.movePoint.y) * (this.anglePoint.x - this.movePoint.x)
  var rightPoint = {
    x: window.innerWidth,
    y: (this.movePoint.y - this.anglePoint.y) / 2 + long
  }

  ctx.fillStyle = this.topPaperStyle
  ctx.fillRect(0, 0, c.width, c.height)

  ctx.fillStyle = this.bottomPaperStyle
  ctx.beginPath()
  ctx.moveTo(topPoint.x, topPoint.y)
  ctx.lineTo(this.anglePoint.x, this.anglePoint.y)
  ctx.lineTo(rightPoint.x, rightPoint.y)
  ctx.closePath()

  ctx.fill()


  ctx.fillStyle = this.backPaperStyle
  ctx.beginPath()
  ctx.moveTo(topPoint.x, topPoint.y)
  ctx.lineTo(this.movePoint.x, this.movePoint.y)
  ctx.lineTo(rightPoint.x, rightPoint.y)
  ctx.closePath()

  ctx.shadowColor = 'rgba(0,0,0,.1)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 20;
  
  ctx.fill()

}

var p = new Paper({
  bottomPaperStyle: '#444',
  topPaperStyle: 'steelblue',
  backPaperStyle: '#fff',
  movePoint: {
    x: window.innerWidth,
    y: 0
  }
})

TweenLite.to(p.movePoint, 2, {
  delay: 1,
  y: 200,
  x: window.innerWidth-200
})

$(c).on('mousemove', function(e) {

  p.movePoint.x = e.pageX
  p.movePoint.y = e.pageY
})

loop(function() {
  ctx.clearRect(0, 0, c.width, c.height)
  p.drew()
})