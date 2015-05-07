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
  this.x = opt.x
  this.y = opt.y
  this.long = opt.long
  this.fillStyle = opt.fillStyle
  this.snake = opt.snake

  this.state = opt.state || {}
}

Cube.prototype.set = function(prop, val) {
  this['_' + prop] = this[prop]
  this[prop] = val
}

Cube.prototype.checkState = function() {
  if (this.snake.state.direction == 'down') {
    if (this.x == this.snake.state.changePosX && this.y == this.snake.state.changePosY)
      this.state.direction = 'down'

  } else
    this.x += this.long

  if (this.state.direction == 'down') {
    this.y += this.long
  } else
    this.x += this.long
}

Cube.prototype.draw = function() {
  ctx.fillStyle = this.fillStyle
  ctx.fillRect(this.x, this.y, this.long, this.long)
}

var cc = new Cube({
  x: 100,
  y: 100,
  long: 100,
  fillStyle: '#444'
})

var Snake = function(opt) {
  this.cubeNum = opt.cubeNum
  this.cubeLong = opt.cubeLong
  this.fillStyle = opt.fillStyle
  this.state = opt.state || {}
  this.cubeList = []

  this.init()
}
Snake.prototype.init = function() {
  for (var i = 0; i < this.cubeNum; i++) {
    var cube = new Cube({
      long: this.cubeLong,
      fillStyle: this.fillStyle,
      x: i * this.cubeLong,
      y: 0,
      snake: this
    })
    this.cubeList.push(cube)
  }
  var that = this
  window.addEventListener('keyup', function(e) {
    //37,38,39,40
    //向下
    if (e.keyCode == 40) {
      that.setState('down')
    }
  })
}
Snake.prototype.setState = function(direction) {
  if (direction == 'down') {
    this.state.changePosX = this.cubeList[this.cubeList.length - 1].x
    this.state.changePosY = this.cubeList[this.cubeList.length - 1].y
    this.state.direction = 'down'
      // this.cubeList.forEach(function(cube) {
      //   cube.state.direction = 'down'
      // })
  }
}

Snake.prototype.draw = function() {
  this.cubeList.forEach(function(cube) {
    cube.draw()
  })
}

Snake.prototype.move = function(speed, direction) {
  var that = this

  setInterval(function() {
    that.cubeList.forEach(function(cube) {
      cube.checkState()
    })
  }, speed)
}

Snake.prototype.start = function() {
  this.move(100)
}

function start() {
  var s = new Snake({
    cubeNum: 10,
    cubeLong: 10,
    fillStyle: '#444',
  })
  s.start()

  util.loop(function() {
    ctx.clearRect(0, 0, cw, ch)
    s.draw()
  })
}

start()
