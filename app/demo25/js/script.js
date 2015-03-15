var c = document.querySelector('#c')
var ctx = c.getContext('2d')
var cw = window.innerWidth
var ch = window.innerHeight
c.width = cw
c.height = ch

util.hackHighDpi(c, ctx)

ctx.fillStyle = '#eee'
ctx.fillRect(0, 0, c.width, c.height)

//------------------------------

var Img = function(opt) {
  var opt = opt || {}

  var img = new Image()
  this.img = img
  this.src = this.img.src = opt.src
  this.cx = opt.cx || window.innerWidth / 2
  this.cy = opt.cy || window.innerHeight / 2


}

Img.prototype.drew = function(callback) {
  var that = this
  this.img.addEventListener('load', function() {
    console.dir(that.img)
    var width = that.width = that.img.width
    var height = that.height = that.img.height

    ctx.drawImage(that.img, that.cx - that.width / 2, that.cy - this.height / 2)

    callback(that)
  })
}

// var img = new Img({
//   src: 'http://img5.douban.com/lpic/s28013319.jpg'
// })

// img.drew(function() {

// })


function main() {

}


main()