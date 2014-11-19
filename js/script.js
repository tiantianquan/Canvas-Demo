var c = document.querySelector('#c')
var ctx = c.getContext('2d')
  // ctx.globalCompositeOperation = 'source-atop'
c.width = window.innerWidth
c.height = window.innerHeight

ctx.clean = function() {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, c.width, c.height)
}

var CircleDrew = (function() {
  var circleDrew = function(x, y, radii) {
    this.x = x
    this.y = y
    this.radii = radii
    this.endAngle = 0

    this.list.push(this)
  }

  circleDrew.list = circleDrew.prototype.list = []

  circleDrew.updateAll = circleDrew.prototype.updateAll = function() {
    circleDrew.list.forEach(function(cd) {
      cd.update()
    })
    return this
  }

  circleDrew.prototype.tween = function() {
    var that = this
    TweenLite.to(that, that._tweenDur, {
      endAngle: 2 * Math.PI,
      ease: Linear.easeNone,
      onComplete: that._tweenOnComplete,
    })
    return this
  }
  circleDrew.prototype.tweenDur = function(dur) {
    this._tweenDur = dur
    return this
  }
  circleDrew.prototype.tweenOnComplete = function(onComplete) {
    var that = this
    this._tweenOnComplete = function() {
      onComplete(that)
    }
    return this
  }

  circleDrew.prototype.update = function() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radii, 0, this.endAngle)
    ctx.strokeStyle = 'red'
    ctx.stroke()
    return this
  };

  return circleDrew
})()

function main() {
  for (var i = 1; i <= 100; i++) {
    var cd = new CircleDrew(c.width / 2, c.height / 2, 10 * i)
    cd.tweenDur(.5).tweenOnComplete(function(self) {
      var next = self.list[self.list.indexOf(self) + 1]
      if (!!next)
        next.tween()
    })
  }
  cd.list[0].tween()

  function loop() {
    ctx.clean()
    cd.updateAll()
    window.requestAnimationFrame(loop)
  }
  loop()
}

main()