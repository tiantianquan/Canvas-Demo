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


var Circle = function(opt) {
  var opt = opt || {}
  this.cx = opt.cx || window.innerWidth / 2
  this.cy = opt.cy || window.innerHeight / 2
  this.inRadii = opt.inRadii || 50
  this.outRadii = opt.outRadii || 100
  this.lineWidth = opt.lineWidth || 1
  this.strokeStyle = opt.strokeStyle || '#000'
  this.gapAngle = opt.gapAngle || 0.1 * 2 * Math.PI
  this.rotateAngle = opt.rotateAngle || 0

  this.animate = opt.animate || false
  this.circlePI = opt.circlePI === undefined ? 2 * Math.PI : opt.circlePI
  this.arcPI = opt.arcPI || {
    x: 0.1 * Math.PI,
    y: 0.1 * Math.PI
  }
}
Circle.prototype.getX = function(angle, inOutRadii, percent) {
  if (percent != undefined)
    return this.cx + Math.cos(angle) * inOutRadii * percent
  else
    return this.cx + Math.cos(angle) * inOutRadii
}

Circle.prototype.getY = function(angle, inOutRadii, percent) {
  if (percent != undefined)
    return this.cy - Math.sin(angle) * inOutRadii * percent
  else
    return this.cy - Math.sin(angle) * inOutRadii
}

Circle.prototype.linedrew = function() {
  ctx.beginPath()
  for (var i = 0; i < this.circlePI; i += this.gapAngle) {
    ctx.moveTo(this.getX(i, this.outRadii), this.getY(i, this.outRadii))
    ctx.lineTo(this.getX(i + this.rotateAngle, this.inRadii), this.getY(i + this.rotateAngle, this.inRadii))
  }

  ctx.strokeStyle = this.strokeStyle
  ctx.lineWidth = this.lineWidth
  ctx.stroke()

}

Circle.prototype.arcdrew = function() {
  ctx.beginPath()
  for (var i = 0; i < this.circlePI; i += this.gapAngle) {
    ctx.moveTo(this.getX(i, this.outRadii), this.getY(i, this.outRadii))
    ctx.quadraticCurveTo(this.getX(i + this.arcPI.x, this.outRadii), this.getY(i + this.arcPI.y, this.outRadii), this.getX(i + this.rotateAngle, this.inRadii), this.getY(i + this.rotateAngle, this.inRadii))
  }
  ctx.strokeStyle = this.strokeStyle
  ctx.lineWidth = this.lineWidth
  ctx.stroke()

}


var c1 = new Circle({
  gapAngle: 0.005 * 2 * Math.PI,
  inRadii: 240,
  outRadii: 250,
  rotateAngle: 1.1 * Math.PI,
  lineWidth: 1.5,
  strokeStyle: '#222',
})

// c1.linedrew()

var c2 = new Circle({
    gapAngle: 0.005 * 2 * Math.PI,
    inRadii: 250,
    outRadii: 250,
    rotateAngle: 0.5 * 2 * Math.PI,
    lineWidth: 1.5,
    strokeStyle: '#222',
  })
  // c2.linedrew()

var c3 = new Circle({
  gapAngle: 0.005 * 2 * Math.PI,
  inRadii: 200,
  outRadii: 250,
  rotateAngle: 0.6 * 2 * Math.PI,
  lineWidth: 1.5,
  strokeStyle: '#222',
  circlePI: 0
})

TweenLite.to(c3, 20, {
    circlePI: 2 * Math.PI,
    ease: Linear.easeNone,
  })
  // loop(c3)


var c4 = new Circle({
  gapAngle: 0.005 * 2 * Math.PI,
  inRadii: 80,
  outRadii: 250,
  rotateAngle: 0.2 * 2 * Math.PI,
  lineWidth: 1.5,
  strokeStyle: '#222',
  arcPI: {
    x: 0.1 * Math.PI,
    y: 0.1 * Math.PI
  }
})

var tween = {
  x:  0.1 * Math.PI,
  y:  0.1 * Math.PI,
  go: function() {
    TweenLite.to(tween, 2, {
      // inRadii: 0,
      x: Math.PI / 2,
      ease: Linear.easeNone,
      onUpdate: function() {
        c4.arcPI.x = tween.x
      },
      onComplete: function() {
        TweenLite.to(tween, 2, {
          // inRadii: 0,
          y: Math.PI / 2,
          ease: Linear.easeNone,
          onUpdate: function() {
            c4.arcPI.y = tween.y
          },
          onComplete: function() {
            tween.rego()
          }
        })
      }
    })
  },
  rego: function() {
    TweenLite.to(tween, 2, {
      // inRadii: 0,
      x: 0.1 * Math.PI,
      ease: Linear.easeNone,
      onUpdate: function() {
        c4.arcPI.x = tween.x
      },
      onComplete: function() {
        TweenLite.to(tween, 2, {
          // inRadii: 0,
          y: 0.1 * Math.PI,
          ease: Linear.easeNone,
          onUpdate: function() {
            c4.arcPI.y = tween.y
          },
          onComplete: function() {
            tween.go()
          }
        })
      }
    })
  }
}

// tween.go()


loop(function() {
  // ctx.clearRect(0, 0, c.width, c.height)
  ctx.fillRect(0,0,c.width,c.height)
  c4.arcdrew()
})
