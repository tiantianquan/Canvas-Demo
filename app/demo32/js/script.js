var c = document.querySelector('#c')
var ctx = c.getContext('2d')
var cw = window.innerWidth
var ch = window.innerHeight
c.width = cw
c.height = ch

util.hackHighDpi(c, ctx)

cw = window.innerWidth
ch = window.innerHeight

ctx.fillStyle = '#eee'
ctx.fillRect(0, 0, c.width, c.height)

//----------------------------------------

var Cube = function(opt) {
  var opt = opt ||{}
  this.x = opt.x
  this.y = opt.y
  this.long = opt.long
  this.fillStyle = opt.fillStyle
  this.snake = opt.snake

  this.state = opt.state
}

Cube.prototype.checkState = function() {
  if (this.state == 'down') {
    this.y += this.long
  }
  if (this.state == 'up') {
    this.y -= this.long
  }
  if (this.state == 'left') {
    this.x -= this.long
  }
  if (this.state == 'right') {
    this.x += this.long
  }
}

Cube.prototype.draw = function() {
  ctx.fillStyle = this.fillStyle
  ctx.fillRect(this.x, this.y, this.long, this.long)
}

var Snake = function(opt) {
  this.cubeNum = opt.cubeNum
  this.cubeLong = opt.cubeLong
  this.fillStyle = opt.fillStyle
  this.cubeList = []
  this.turnPos = []

  this.state = opt.state
  this.crash = false
  this.init()
}
Snake.prototype.init = function() {
  var w = cw/2 - Math.round(cw/2)%10
  //初始化方块数组
  for (var i = 0; i < this.cubeNum; i++) {
    var cube = new Cube({
      long: this.cubeLong,
      fillStyle: this.fillStyle,
      x: w+(this.cubeNum- i) * this.cubeLong,
      y: 0,
      snake: this,
      state: 'right'
    })
    this.cubeList.push(cube)
  }
  //绑定事件
  var that = this

  window.addEventListener('keyup', function(e) {
    //37,38,39,40
    //向下
    if (e.keyCode == 40) {
      that.setState('down')
    }
    if (e.keyCode == 37) {
      that.setState('left')
    }
    if (e.keyCode == 38) {
      that.setState('up')
    }
    if (e.keyCode == 39) {
      that.setState('right')
    }
  })
}
Snake.prototype.draw = function() {
  this.cubeList.forEach(function(cube) {
    cube.draw()
  })
}

Snake.prototype.setState = function(direction) {
  if (this.state == 'up' && direction == 'down') {
    return
  }
  if (this.state == 'down' && direction == 'up') {
    return
  }
  if (this.state == 'right' && direction == 'left') {
    return
  }
  if (this.state == 'left' && direction == 'right') {
    return
  }
  this.state = direction
  this.turnPos.push({
    x: this.cubeList[0].x,
    y: this.cubeList[0].y,
    direction: direction
  })
}

Snake.prototype.checkState = function() {
  var that = this
  this.cubeList.forEach(function(c, index, arr) {
    for (var i = 0; i < that.turnPos.length; i++) {
      if (c.x == that.turnPos[i].x && c.y == that.turnPos[i].y) {
        c.state = that.turnPos[i].direction
        if (index == arr.length - 1) {
          that.turnPos.splice(i, 1)
        }
      }
    }
    c.checkState()
  })
}

Snake.prototype.setCrash = function(bool) {
  this.crash = bool
  if (this.crash) {
    this.moveStop()
  }
}

Snake.prototype.checkCrash = function() {
  var that = this
  this.cubeList.forEach(function(c, index, arr) {
    //自我碰撞
    for (var i = 0; i < arr.length; i++) {
      if (c.x == arr[i].x && c.y == arr[i].y && c !== arr[i]) {
        that.setCrash(true)
      }
    }

    //边界碰撞
    if (index == 0) {
      if (c.x >= cw - c.long || c.x <= 0 || c.y >= ch - c.long || c.y <= 0) {}

      if (c.x >= cw - c.long && (that.state == 'left' || that.state == 'right')) {
        that.setCrash(true)
      }
      if (c.x <= 0 && (that.state == 'left' || that.state == 'right')) {
        that.setCrash(true)
      }
      if (c.y >= ch - c.long && (that.state == 'up' || that.state == 'down')) {
        that.setCrash(true)
      }
      if (c.y <= 0 && (that.state == 'up' || that.state == 'down')) {
        that.setCrash(true)
      }
    }
  })
}

Snake.prototype.addEgg = function(egg) {
  this.egg = egg
}

Snake.prototype.checkEat = function() {
  if (this.egg.x == this.cubeList[0].x && this.egg.y == this.cubeList[0].y)
    this.eat(this.egg)
}

Snake.prototype.eat = function(egg) {
  egg.refrush()
  // var lastIndex = this.cubeList.length - 1
  // var cube = new Cube()
  // for (var i in this.cubeList[lastIndex]) {
  //   cube[i] = this.cubeList[lastIndex][i]
  // }
  // this.cubeList.push(cube)
  var cube = new Cube()

  for(var i in this.cubeList[0]){
    cube[i] = this.cubeList[0][i]
  }
  cube.checkState()
  this.cubeList.splice(0,0,cube)
}

Snake.prototype.moveStart = function(speed) {
  var that = this
  this.intervalID = setInterval(function() {
    if (!that.crash) {
      that.checkState()
      that.checkEat()
    }
    that.checkCrash()
  }, speed)
}

Snake.prototype.moveStop = function() {
  clearInterval(this.intervalID)
}


var Egg = function(opt) {
  this.long = opt.long
  this.fillStyle = opt.fillStyle
  this.snake = opt.snake
  this.refrush(this.snake)
}

Egg.prototype.draw = function() {
  ctx.fillStyle = this.fillStyle
  ctx.fillRect(this.x, this.y, this.long, this.long)
}

Egg.prototype.refrush = function() {
  var numX = Math.round((Math.random() * cw))
  var numY = Math.round((Math.random() * ch))
  this.x = numX - numX % 10
  this.y = numY - numY % 10

  var that = this
  this.snake.cubeList.forEach(function(c, index, arr) {
    if (that.x == c.x && that.y == c.y) {
      that.refrush()
    }
  })
}


function start() {
  var s = new Snake({
    cubeNum: 3,
    cubeLong: 10,
    fillStyle: '#444',
    state: 'right'
  })

  var egg = new Egg({
    fillStyle: '#444',
    long: 10,
    snake: s
  })

  s.addEgg(egg)
  s.moveStart(100)

  util.loop(function() {
    ctx.clearRect(0, 0, cw, ch)
    s.draw()
    egg.draw()
  })
}

start()
