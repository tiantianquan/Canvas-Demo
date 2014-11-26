var c = document.querySelector('#c')
var ctx = c.getContext('2d')
c.width = document.querySelector('header').offsetWidth
c.height = document.querySelector('header').offsetHeight

ctx.clean = function() {
  ctx.fillStyle = 'pink'
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

function circlemain() {
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

// circlemain()


var CurveDrew = (function() {
  var curveDrew = function(x, y, cx, cy, ex, ey) {
    this.x = x
    this.y = y
    this.cx = cx
    this.cy = cy
    this.ex = ex
    this.ey = ey
    this.r = 255
    this.g = 255
    this.b = 255

    this.list.push(this)
  }

  curveDrew.list = curveDrew.prototype.list = []

  curveDrew.updateAll = curveDrew.prototype.updateAll = function() {
    curveDrew.list.forEach(function(cd) {
      cd.update()
    })
    return this
  }

  curveDrew.prototype.tween = function() {
    var that = this
    TweenLite.to(that, that._tweenDur, {
      r: 230,
      g: 230,
      b: 230,
      cx: Math.random() * 1000,
      cy: Math.random() * 600,
      ex: Math.random() * 1000,
      ey: Math.random() * 600,
      ease: Linear.easeNone,
      onComplete: that._tweenOnComplete,
    })
    return this
  }
  curveDrew.prototype.tweenDur = function(dur) {
    this._tweenDur = dur
    return this
  }
  curveDrew.prototype.tweenOnComplete = function(onComplete) {
    var that = this
    this._tweenOnComplete = function() {
      onComplete(that)
    }
    return this
  }

  curveDrew.prototype.update = function() {
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.quadraticCurveTo(this.cx, this.cy, this.ex, this.ey)
    ctx.strokeStyle = 'rgba(' + parseInt(this.r) + ',' + parseInt(this.g) + ',' + parseInt(this.b) + ',.3)'
    ctx.stroke()
    return this
  };

  return curveDrew
})()

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function curvemain() {
  for (var i = 1; i <= 100; i++) {
    var cr = new CurveDrew(
      c.width / 2,
      c.height / 2,
      Math.random() * 1000,
      Math.random() * 600,
      Math.random() * 1000,
      Math.random() * 600
    )
    cr.tweenDur(20).tweenOnComplete(function(self) {
      self.tween()
    }).tween()
  }

  function loop() {
    ctx.clearRect(0, 0, c.width, c.height)
    cr.updateAll()
    return window.requestAnimationFrame(loop)
  }
  return loop()
}
var frame = curvemain()


// window.addEventListener('resize', function() {
//   c.width = document.querySelector('header').offsetWidth
//   c.height = document.querySelector('header').offsetHeight
//   curvemain()
// });


function scrollNavOpc() {
  var navBar = $('.navbar')
  var headTop = 600
  $(window).on('scroll', function(e) {
    var top = navBar.offset().top
    var newOpc = top <= headTop ? top / headTop * 0.9 : 0.9
    navBar.css('background', 'rgba(230,230,230,' + newOpc + ')')
    console.log(frame)
    // window.cancelAnimationFrame(frame)
  })
}
scrollNavOpc()