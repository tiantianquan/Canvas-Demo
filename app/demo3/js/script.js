var c = document.querySelector('#c')
var ctx = c.getContext('2d')
c.width = window.innerWidth
c.height = window.innerHeight
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
  var _octagon = function() {}
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

    // if (this._rotate) {
    //   var x = Rx
    //   var y = Ry
    //   var that = this
    //   Rx = x * Math.cos(-that._rotate) - y * Math.sin(-that._rotate);
    //   Ry = y * Math.cos(-that._rotate) + x * Math.sin(-that._rotate);
    // }

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
  _octagon.prototype.drew = function() {
    // ctx.rotate(0.1 * 2 * Math.PI)
    ctx.beginPath()
    ctx.moveTo(this._p1[0], this._p1[1])
    for (var i = 1; i < 8; i++) {
      var point = this._point[i]
      ctx.lineTo(point[0], point[1])
    }
    ctx.closePath()
    ctx.strokeStyle = '#fff'
    ctx.stroke()
  }
  return _octagon
})()

function main() {
  var tween = {
    long: 200,
    centerX: c.width / 2,
    centerY: c.height / 2,
    rotate: 0,
  }

  tween.go = function() {
    tween.rotate = 0
    TweenLite.to(tween, .8, {
      rotate: 2 * Math.PI,
      onUpdate: function() {
        list.forEach(function(o,index) {
          if(index%2===0)
            o.rotate(tween.rotate)
          else
            o.rotate(-tween.rotate)
        })
      },
      onComplete: tween.go,
      ease: Linear.easeNone
    })
  }

  var list = []
  for (var i = 1; i <= 2; i++) {
    var o = new Octagon().long(tween.long * (.2 + .01 * i)).center([c.width / 2, c.height / 2])
    list.push(o)
  }

  tween.go()

  function loop() {
    // ctx.clean()
    ctx.clearRect(0, 0, c.width, c.height)
    list.forEach(function(o){
      o.drew()
    })
    window.requestAnimationFrame(loop)
  }
  loop()
}
main()