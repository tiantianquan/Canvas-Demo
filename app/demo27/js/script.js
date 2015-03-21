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

//------------------------------

var Line = function(opt) {
  var opt = opt || {}

  //起始点
  this.x1 = opt.x1
  this.y1 = opt.y1
    //结束点
  this.x2 = opt.x2
  this.y2 = opt.y2 || this.y1

  //节点数量
  this.pointNum = opt.pointNum
    //偏移量
  this.maxOffset = opt.maxOffset

  this.lineWidth = opt.lineWidth || 1
  this.strokeStyle = opt.strokeStyle || '#000'
}

Line.prototype.draw = function() {
  ctx.beginPath()
  ctx.moveTo(this.x1, this.y1)

  for (var i = 1; i <= this.pointNum - 1; i++) {
    var x = this.x1 + (this.x2 - this.x1) / this.pointNum * i
    var y = util.random(this.y1 - this.maxOffset, this.y1 + this.maxOffset)
      // console.log(x, y)
    ctx.lineTo(x, y)
  }

  ctx.lineTo(this.x2, this.y2)
    // ctx.closePath()
  ctx.strokeStyle = this.strokeStyle
  ctx.lineWidth = this.lineWidth
  ctx.stroke()

}

var Img = function(opt) {
  var opt = opt || {}

  var img = new Image()
  this.img = img
  this.src = this.img.src = opt.src
  this.cx = opt.cx || window.innerWidth / 2
  this.cy = opt.cy || window.innerHeight / 2


}

Img.prototype.draw = function(callback) {
  var that = this
  this.img.addEventListener('load', function() {
    var width = that.width = that.img.width
    var height = that.height = that.img.height

    ctx.drawImage(that.img, that.cx - that.width / 2, that.cy - this.height / 2)

    callback(that)
  })
}

function test1() {
  var midWidth = 30
  var lineNum = 10

  var startY = (ch - midWidth * lineNum) / 2

  var l = new Line({
    x1: 100,
    y1: startY,
    x2: cw - 100,
    y2: startY,
    pointNum: 300,
    maxOffset: 20,
    lineWidth: 0.5

  })

  var img = new Img({
    src: 'http://img3.douban.com/lpic/s2982331.jpg'
  })

  util.loop(function() {
    ctx.fillStyle = '#eee'
    ctx.fillRect(0, 0, cw, ch)

    for (var i = 0; i < lineNum; i++) {
      l.y1 = startY + midWidth * i
      l.y2 = startY + midWidth * i
      l.draw()
    }
  })

}

function test2() {
  var l = new Line({
    x1: 100,
    y1: ch / 2,
    x2: cw - 100,
    pointNum: 300,
    maxOffset: 50,
    lineWidth: 0.5
  })


  util.loop(function() {
    ctx.fillStyle = '#eee'
    ctx.fillRect(0, 0, cw, ch)

    l.draw()

  })
}

// test1()

test2()