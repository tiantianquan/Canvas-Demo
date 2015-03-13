var time = Date.now()

var c = document.querySelector('#c')
var ctx = c.getContext('2d')
var w = window.innerWidth
var h = window.innerHeight


c.width = w
c.height = h
util.hackHighDpi(c, ctx)

function circleBar(x, y, radii, barWidth, borderWidth) {
  //中心半径
  var barRadii = radii + barWidth / 2

  ctx.beginPath()
  ctx.arc(x, y, barRadii, 0, Math.PI * 2)
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = barWidth
  ctx.stroke()
  ctx.closePath()

  ctx.beginPath()
  ctx.arc(x, y, barRadii + barWidth / 2 + borderWidth / 2, 0, Math.PI * 2)
  ctx.strokeStyle = '#000'
  ctx.lineWidth = borderWidth
  ctx.stroke()
  ctx.closePath()


  ctx.beginPath()
  ctx.arc(x, y, barRadii - barWidth / 2 - borderWidth / 2, 0, Math.PI * 2)
  ctx.strokeStyle = '#000'
  ctx.lineWidth = borderWidth
  ctx.stroke()
  ctx.closePath()
}

var LineCircle = function(opt) {
  this.canvas = opt.canvas || document.querySelector('#c')
  this.radii = opt.radii || 200
  this.cx = opt.cx || window.innerWidth / 2
  this.cy = opt.cy || window.innerHeight / 2
  this.startAngle = opt.startAngle || 0
  this.gapAngle = opt.gapAngle || 0.01 * 2 * Math.PI
  this.strokeStyle = opt.strokeStyle || '#000'
  this.lineWidth = opt.lineWidth || 1

  this.dynamicPercent = opt.dynamicPercent || 1
}

LineCircle.prototype.getX = function(angle, percent) {
  if (percent != undefined)
    return this.cx + Math.cos(angle) * this.radii * percent
  else
    return this.cx + Math.cos(angle) * this.radii
}

LineCircle.prototype.getY = function(angle, percent) {
  if (percent != undefined)
    return this.cy - Math.sin(angle) * this.radii * percent
  else
    return this.cy - Math.sin(angle) * this.radii
}
LineCircle.prototype.drew = function() {
  for (var i = 0; i < 2 * Math.PI; i += this.gapAngle) {
    // ctx.moveTo(this.getX(this.startAngle), this.getY(this.startAngle))
    circleBar(this.getX(i), this.getY(i), 50, 3, 1)
  }
}

function main() {
  var cc = new LineCircle({
    gapAngle: 0.02 * 2 * Math.PI,
    radii: 250,
    lineWidth: 2,
    strokeStyle: '#222',
    startAngle: 0 * 2 * Math.PI,
  })

  // for(var radii = 250;radii>=120;radii-=30){
  //   cc.radii = radii
  //   cc.drew()
  // }
  for(var radii = 100;radii<=250;radii+=30){
    cc.radii = radii
    cc.drew()
  }
}
util.getTime(main)