var c = document.querySelector('#c')
var ctx = c.getContext('2d')
c.width = window.innerWidth
c.height = window.innerHeight
ctx.globalCompositeOperation = 'lighter'

var tool = {
  //两点距离
  pointDistance: function(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
  },
  getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}
var Ball = function(opt) {
  var opt = opt || {}
  this.cx = opt.cx || c.width / 2
  this.cy = opt.cy || c.height / 2
  this.radii = opt.radii || 10
  this.origincolor = this.fillcolor = opt.fillcolor || '#fff'
  this.strokecolor = opt.strokecolor || '#fff'

  this.moveTween


  var canv = this.canv = opt.canvas || c

  var that = this

  function bindEvent() {
    //绑定事件
    //-----------move
    $(canv).on('click', function(e) {
      var cx = e.pageX
      var cy = e.pageY
        //move
      if (!isInBall.call(that, e.pageX, e.pageY))
        that.move(cx, cy)
    })

    //----------click changeColor
    function isInBall(x, y) {
      var cx = this.cx
      var cy = this.cy
      var long = tool.pointDistance(cx, cy, x, y)
      if (long < this.radii)
        return true
      else
        return false
    }
    $(canv).on('mousedown', function(e) {
      if (isInBall.call(that, e.pageX, e.pageY))
        that.changeColor('red')

      $(canv).on('mousemove', function(e) {
        if (!!that.moveTween)
          that.moveTween.kill()
        that.move(e.pageX, e.pageY)
      })

    })
    $(window).on('mouseup', function(e) {
        that.changeColor(that.origincolor)
        $(canv).off('mousemove')
      })
      //----------------
  }
  bindEvent()
  this.list.push(this)
}

Ball.list = Ball.prototype.list = []

Ball.prototype.move = function(targetX, targetY) {
  var that = this
  this.moveTween = TweenLite.to(this, 5, {
    cx: targetX,
    cy: targetY,
  })
}

Ball.prototype.changeColor = function(color) {
  this.fillcolor = color
}

Ball.prototype.drew = function() {
  ctx.beginPath()
  ctx.arc(this.cx, this.cy, this.radii, 0, 2 * Math.PI)
  ctx.fillStyle = this.fillcolor
  ctx.fill()
}

Ball.prototype.crash = function(otherball) {
  var distance = this.radii * 20
  var angle = Math.asin((otherball.cy - this.cy) / (this.radii + otherball.radii))
  var mx = distance * Math.cos(angle + Math.random() * 0.1 * Math.PI)
  var my = distance * Math.sin(angle + Math.random() * 0.1 * Math.PI)
  mx = this.cx < otherball.cx ? mx : -mx
  this.moveTween.kill()
  this.move(this.cx - mx, this.cy - my)
}

Ball.prototype.crashWall = function() {
  var distance = this.radii * 20
  var mx = distance * Math.cos(Math.random() * 2 * Math.PI)
  var my = distance * Math.sin(Math.random() * 2 * Math.PI)
  this.moveTween.kill()
  this.move(this.cx - mx, this.cy - my)
}

Ball.prototype.check = Ball.check = function() {
  var that = this
  this.list.forEach(function(ball, index, list) {
    var i = index + 1
    while (i <= list.length - 1) {
      if (!list[i])
        return
      var otherBall = list[i]
        //球体碰撞
      var long = tool.pointDistance(ball.cx, ball.cy, otherBall.cx, otherBall.cy)
      if (long <= 10/*ball.radii + otherBall.radii */) {
        if (!!ball.moveTween) {
          ball.crash(otherBall)
          otherBall.crash(ball)
        }
      }
      i++
    }

    if (ball.cx - ball.radii <= 0 ||
      ball.cx + ball.radii >= ball.canv.width ||
      ball.cy + ball.radii >= ball.canv.height ||
      ball.cy - ball.radii <= 0) {
      if (!!ball.moveTween) {
        ball.crashWall()
      }
    }

  })
}

Ball.isCheck = true


function main() {
  for (var i = 0; i < 100; i++) {
    new Ball({
      radii: 30,
      cx: tool.getRandomInt(c.width),
      cy: tool.getRandomInt(c.height),
      fillcolor: 'rgba(' + tool.getRandomInt(0, 255) + ',' + tool.getRandomInt(0, 255) + ',' + tool.getRandomInt(0, 255) + ',0.3)'
    })
  }

  function loop() {
    ctx.clearRect(0, 0, c.width, c.height)
    $(window).on('mouseup', function() {
      Ball.isCheck = true
    })
    $(c).on('mousedown', function() {
      Ball.isCheck = false
    })
    if (Ball.isCheck)
      Ball.check()
    Ball.list.forEach(function(ball) {
      ball.drew()
    })
    window.requestAnimationFrame(loop)
  }
  loop()
}
main()