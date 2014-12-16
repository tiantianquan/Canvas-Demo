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

var timeDuration, time,p
  //半径,半径速度,半径加速度
var radii, rv, ra
  //角,角速度,角加速度
var theta, tv, ta
var x, y
var cx, cy


function init() {
  cx = window.innerWidth / 2
  cy = window.innerHeight / 2

  theta = 0
  radii = 0
  rv = 20
  tv = 20
  ra = 1
  ta = 3

  time = 0
  timeDuration = 5
}

function setup(t) {
  radii = (rv + ra * t) * t
  theta = (tv + ta * t) * t

  x = Math.cos(theta) * radii
  y = Math.sin(theta) * radii
}

function drew(k) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  ctx.moveTo(cx, cy)
  ctx.beginPath()
  for (var i = 0; i < 10; i = i + k) {
    setup(i)
    ctx.lineTo(cx + x, cy - y)
  }
  ctx.strokeStyle = '#222'
  ctx.stroke()
}

function drew2(k,p){
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  ctx.moveTo(cx, cy)
  ctx.beginPath()
  for (var i = 0; i < p; i = i + k) {
    setup(i)
    ctx.lineTo(cx + x, cy - y)
  }
  ctx.strokeStyle = '#222'
  ctx.stroke()
}

init()



TweenLite.to(window, timeDuration, {
  time: timeDuration,
  onUpdate: function() {
    // setup(this._time)
    var k = this._time / timeDuration * 0.05 < 0.001 ? 0.001 : this._time / timeDuration * 0.05
    drew(k)
  },
  onComplete:function(){
    this.reverse()
  },
  onReverseComplete:function(){
    this.play()
  }
})


// TweenLite.to(window, timeDuration, {
//   time: timeDuration,
//   onUpdate: function() {

//     p = this._time/2
    
//   },
//   onComplete:function(){
//     this.reverse()
//   },
//   onReverseComplete:function(){
//     this.play()
//   }
// })

// loop(function(){
//   drew2(0.001,p)
// })
