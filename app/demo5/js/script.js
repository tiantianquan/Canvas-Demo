var c = document.querySelector('#c')
var ctx = c.getContext('2d')
c.width = window.innerWidth
c.height = window.innerHeight

var tool = {
  //两点距离
  pointDistance: function(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
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
      if (!!that.moveTween)
        that.moveTween.kill()
      $(canv).on('mousemove', function(e) {
        // that.cx = e.pageX
        // that.cy = e.pageY
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
  this.moveTween = TweenLite.to(this, 2, {
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

Ball.check = function() {
  var that = this
  this.list.forEach(function(ball, index, list) {
    // for (var i = 1; i < list.length - index; i++) {
    //   var long = tool.pointDistance(ball.cx, ball.cy, list[list.length - i - 1].cx, list[list.length - i - 1].cy)
    //   console.log(that.radii)
    //   if (long <= 2 * 50) {
    //     if (!!ball.moveTween)
    //       ball.moveTween.kill()
    //   }
    // }
    if(!list[index + 1])
      return 
    var long = tool.pointDistance(ball.cx, ball.cy, list[index + 1].cx, list[index + 1].cy)
    if (long <= 2 * 50) {
      if (!!ball.moveTween){
        list[index + 1].moveTween.kill()
        ball.moveTween.kill()
        ball.move(ball.cx-100,ball.cy-100)
        list[index + 1].move(list[index + 1].cx+100,list[index + 1].cy+100)
      }
    }
  })
}


function main() {
  new Ball({
    radii: 50,
    cx: 100,
    cy: 100
  })
  new Ball({
    radii: 50,
    cx: 200,
    cy: 200,
    fillcolor: '#000'
  })

  function loop() {
    ctx.clearRect(0, 0, c.width, c.height)
    Ball.check()
    Ball.list.forEach(function(ball) {
      ball.drew()
    })
    window.requestAnimationFrame(loop)
  }
  loop()
}
main()