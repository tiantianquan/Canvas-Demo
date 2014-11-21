var c = document.querySelector('#c')
var ctx = c.getContext('2d')
c.width = window.innerWidth
c.height = window.innerHeight
ctx.globalCompositeOperation = 'lighter'
ctx.clean = function() {
  ctx.fillStyle = '#ccc'
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

var Octagon = (function() {
  var gs = toolFn.getSetProp
  var _octagon = function() {
    this.list.push(this)
  }
  _octagon.list = _octagon.prototype.list = []
  _octagon.prototype.long = function(long) {
    return gs.call(this, arguments, '_long', function(o) {
      o.createPoint()
    })
  }
  _octagon.prototype.center = function(c) {
    return gs.call(this, arguments, '_center', function(o) {
      o.createPoint()
    })
  }
  _octagon.prototype.rotate = function(r) {
    return gs.call(this, arguments, '_rotate', function(o) {
      o.createPoint()
    })
  }
  _octagon.prototype.createPoint = function() {
    if (!this._long || !this._center)
      return

    var long = this._long
    var Rx = long / 2
    var Ry = Rx / Math.tan(22.5 / 180 * Math.PI)

    var radii = Rx / Math.sin(22.5 / 180 * Math.PI)
    var x = this._center[0]
    var y = this._center[1]
    this._point = []
    this._point[0] = this._p1 = [x - Rx, y + Ry]
    this._point[1] = this._p2 = [x + Rx, y + Ry]
    this._point[2] = this._p3 = [x + Ry, y + Rx]
    this._point[3] = this._p4 = [x + Ry, y - Rx]
    this._point[4] = this._p5 = [x + Rx, y - Ry]
    this._point[5] = this._p6 = [x - Rx, y - Ry]
    this._point[6] = this._p7 = [x - Ry, y - Rx]
    this._point[7] = this._p8 = [x - Ry, y + Rx]

    if (this._rotate) {
      var that = this
      this._point.forEach(function(p, index, list) {
        // var x = that._center[0]
        // var y = that._center[1]
        var lx = p[0] - x
        var ly = p[1] - y
        var _lx = lx * Math.cos(-that._rotate) - ly * Math.sin(-that._rotate);
        var _ly = ly * Math.cos(-that._rotate) + lx * Math.sin(-that._rotate);
        p[0] = _lx + x
        p[1] = _ly + y
      })
    }

  }
  _octagon.prototype.drew = function(st, fs) {
    // ctx.rotate(0.1 * 2 * Math.PI)
    ctx.beginPath()
    ctx.moveTo(this._p1[0], this._p1[1])
    for (var i = 1; i < 8; i++) {
      var point = this._point[i]
      ctx.lineTo(point[0], point[1])
    }
    ctx.closePath()

    if (!!fs) {
      ctx.fillStyle = fs
      ctx.fill()
    }
    if (!!st) {
      ctx.strokeStyle = st
      ctx.stroke()
    }
  }

  return _octagon
})()

var CirclePoint = (function() {
  var gs = toolFn.getSetProp
  var _circlePoint = function() {
    this.list.push(this)
  }
  _circlePoint.list = _circlePoint.prototype.list = []
  _circlePoint.prototype.radii = function(redii) {
    return gs.call(this, arguments, '_radii')
  }
  _circlePoint.prototype.center = function(c) {
    return gs.call(this, arguments, '_center')
  }

  _circlePoint.prototype.drew = function(st, fs) {
    ctx.beginPath()
      // ctx.moveTo(this._center[0], this._center[1])
    ctx.arc(this._center[0], this._center[1], this._radii, 0, Math.PI * 2);
    ctx.closePath()
    if (!!fs) {
      ctx.fillStyle = fs
      ctx.fill()
    }
    if (!!st) {
      ctx.strokeStyle = st
      ctx.stroke()
    }
  }
  return _circlePoint
})()

var Mixco = (function() {
  var gs = toolFn.getSetProp
  var _mixco = function() {
    this._circles = {
      green: [],
      blue: [],
      red: []
    }
    this.list.push(this)
    this._radii
  }
  _mixco.list = _mixco.prototype.list = []
  _mixco.prototype.octagon = function(o) {
    return gs.call(this, arguments, '_octagon', function(m) {
      m.createCircles(10)
    })
  }
  _mixco.prototype.createCircles = function(radii) {
    // return gs.call(this, arguments, '_circles')
    if (!this._octagon)
      return
    if (!!radii)
      this._radii = radii
    var that = this
    this._octagon._point.forEach(function(p, index) {
      // if (!!that._circles[index])
      //   that._circles[index].center(p).radii(that._radii)
      // else {
      var circleB = new CirclePoint().center(p).radii(that._radii)
      var circleR = new CirclePoint().center(p).radii(that._radii)
      var circleG = new CirclePoint().center(p).radii(that._radii)
      that._circles.blue[index] = circleB
      that._circles.red[index] = circleR
      that._circles.green[index] = circleG
        // }
    })
  }

  _mixco.prototype.circles = function(radii) {
    if (arguments.length === 0)
      return this._circles
    this.createCircles(radii)
    return this
  }

  _mixco.prototype.rotate = function(r) {
    this._octagon.rotate(r)
    this.createCircles()
  }
  _mixco.prototype.drew = function(ost, ofs, cst, cfs) {
    this._octagon.drew(ost, ofs)
    this._circles.blue.forEach(function(c) {
      c.drew(cst, 'rgba(0,0,255,1)')
    })
    this._circles.red.forEach(function(c) {
      c.drew(cst, 'rgba(255,0,0,1)')
    })
    this._circles.green.forEach(function(c) {
      c.drew(cst, 'rgba(0,255,0,1)')
    })
  }
  return _mixco

})()

function main() {
  var tween = {
    long: 0,
    centerX: c.width / 2,
    centerY: c.height / 2,
    rotate: 0,
    circleL: 0
  }
  tween.go = function() {
    TweenLite.to(tween, 2, {
      rotate: tween.rotate + 22.5 / 180 * Math.PI,
      circleL: tween.circleL + 50,
      delay: .5,
      onUpdate: function() {
        var that = this
        Mixco.list.forEach(function(m, index) {
          if (index % 2 === 0)
            m.rotate(tween.rotate + 22.5 / 180 * Math.PI)
          else
            m.rotate(-tween.rotate)

          var circleL = tween.circleL
          m._circles.blue.forEach(function(b) {
              var i1 = b._center[0]
              var i2 = b._center[1]
              b._center = [i1 - circleL, i2 - circleL]
            })
            // m._circles.red.forEach(function(b) {
            //   var i1 = b._center[0]
            //   var i2 = b._center[1]
            //   b._center = [i1 + circleL, i2 + circleL]
            // })

          m._circles.green.forEach(function(b) {
            var i1 = b._center[0]
            var i2 = b._center[1]
            b._center = [i1 + circleL, i2 - circleL]
          })
        })
      },
      onComplete: tween.rego,
      ease: Linear.easeNone
    })
  }

  tween.rego = function() {
    TweenLite.to(tween, 2, {
      rotate: tween.rotate + 22.5 / 180 * Math.PI,
      circleL: tween.circleL - 50,
      delay: .5,
      onUpdate: function() {
        var that = this
        Mixco.list.forEach(function(m, index) {
          if (index % 2 === 0)
            m.rotate(tween.rotate + 22.5 / 180 * Math.PI)
          else
            m.rotate(-tween.rotate)

          var circleL = tween.circleL
          m._circles.blue.forEach(function(b) {
              var i1 = b._center[0]
              var i2 = b._center[1]
              b._center = [i1 - circleL, i2 - circleL]
            })
            // m._circles.red.forEach(function(b) {
            //   var i1 = b._center[0]
            //   var i2 = b._center[1]
            //   b._center = [i1 + circleL, i2 + circleL]
            // })

          m._circles.green.forEach(function(b) {
            var i1 = b._center[0]
            var i2 = b._center[1]
            b._center = [i1 + circleL, i2 - circleL]
          })
        })
      },
      onComplete: tween.go,
      ease: Linear.easeNone
    })
  }



  for (var i = 1; i <= 20; i++) {
    var o = new Octagon().long(i * i * 0.002 * i * i).center([c.width / 2, c.height / 2])
    if (i % 2 !== 0) {
      o.rotate(22.5 / 180 * Math.PI)
    }
    var mixco = new Mixco().octagon(o).circles(i * i * i * i * 0.0002)
  }

  tween.go()

  function loop() {
    // ctx.clean()
    ctx.clearRect(0, 0, c.width, c.height)
    Mixco.list.forEach(function(m) {
      m.drew('', null, null, '#fff')
    })
    window.requestAnimationFrame(loop)
  }
  loop()
}
main()