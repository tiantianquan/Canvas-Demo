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

function loop(callback) {
  callback()
  requestAnimationFrame(function() {
    loop(callback)
  })
}


var Te = function(opt) {
  var opt = opt || {}
  this.ctx = opt.ctx || ctx
  this.c = opt.c || c
  this.font = opt.font
  this.text = opt.text
  this.fillStyle = opt.fillStyle
  this.strokeStyle = opt.strokeStyle

  this.cx = opt.x || window.innerWidth / 2
  this.cy = opt.y || window.innerHeight / 2
}

Te.prototype.drew = function() {
  var ctx = this.ctx
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.globalCompositeOperation = 'lighter'
  ctx.font = this.font
  ctx.fillStyle = this.fillStyle
  this.strokeStyle = this.strokeStyle
  return this
}
Te.prototype.fill = function() {

  this.ctx.fillText(this.text, this.cx, this.cy)
  return this
}
Te.prototype.stroke = function() {

  this.ctx.strokeText(this.text, this.cx, this.cy)
  return this
}

var te = function(opt) {
  var opt = opt || {}
  for (var i in opt) {
    this[i] = opt[i]
  }
  // this.fillStyle = opt.fillStyle
}
te.prototype = new Te({
  font: '800 800px Roboto',
  text: 'L',
})

var rTe = new te({
  fillStyle: 'rgba(255,0,0,1)',
})
var gTe = new te({
  fillStyle: 'rgba(0,255,0,1)',
})
var bTe = new te({
  fillStyle: 'rgba(0,0,255,1)',
})

TweenLite.to(rTe, .1, {
  cx: rTe.cx - 3,
  // delay:2,
  onComplete: function() {
    this.reverse()

  },
  onReverseComplete: function() {
    this.play()
  }
})

TweenLite.to(bTe, .1, {
  cx: bTe.cx + 3,
  delay:.1,
  onComplete: function() {
    this.reverse()

  },
  onReverseComplete: function() {
    this.play()
  }
})



loop(function() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
  rTe.drew().fill()
  gTe.drew().fill()
  bTe.drew().fill()
})



// var gTe = new Te({
//   font: '100px Helvetica',
//   text: 'Tiantianquan',
//   fillStyle: 'rgba(255,0,0)',
// })

// var bTe = new Te({
//   font: '100px Helvetica',
//   text: 'Tiantianquan',
//   fillStyle: 'rgba(255,0,0)',
// })

// redTe.drew().fill()