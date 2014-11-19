var c = document.querySelector('#c')
var ctx = c.getContext('2d')
  // ctx.globalCompositeOperation = 'source-atop'
c.width = window.innerWidth
c.height = window.innerHeight

ctx.clean = function() {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, c.width, c.height)
}

var CircleDrew = function(x, y, radii) {
  this.x = x
  this.y = y
  this.radii = radii
  this.endAngle = 0

  CircleDrew.list.push(this)
  this.tween()
}

CircleDrew.prototype.tween = function() {
  var that = this
  TweenLite.to(that, 2, {
    endAngle: 2 * Math.PI,
    ease: Linear.easeNone,
    onComplete: function() {},
  })
}

CircleDrew.prototype.update = function() {
  ctx.beginPath()
  ctx.arc(this.x, this.y, this.radii, 0, this.endAngle)
  ctx.strokeStyle = 'red'
  ctx.stroke()
};

CircleDrew.list = []
CircleDrew.update = function() {
  CircleDrew.list.forEach(function(cd) {
    cd.update()
  })
}

function beginAnimate() {
  for (var i = 0; i < 10; i++) {
    var cd = new CircleDrew(c.width / 2, c.height / 2, 10 * i)
  }

  function loop() {
    ctx.clean()
    CircleDrew.update()
    window.requestAnimationFrame(loop)
  }
  loop()
}

beginAnimate()