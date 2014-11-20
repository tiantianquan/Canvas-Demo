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
  }
  _octagon.prototype.drew = function() {
    ctx.beginPath()
    ctx.moveTo(this._p1[0], this._p1[1])
    for (var i = 1; i < 8; i++) {
      var point = this._point[i]
      ctx.lineTo(point[0], point[1])
    }
    ctx.closePath()
    ctx.strokeStyle = '#000'
    ctx.stroke()
  }

  return _octagon
})()

function main() {
  var long = 200
  var o = new Octagon().long(long).center([c.width/2, c.height/2])
  console.log(o)

  function loop() {
    ctx.clean()
    o.long(long)
    o.drew()
    long--
    window.requestAnimationFrame(loop)
  }
  loop()
}
main()