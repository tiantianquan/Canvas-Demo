var w = window.innerWidth
var h = window.innerHeight

var cw = w / 2
var ch = h / 2

var d = 500


function setup() {
  var t = Date.now()

  createCanvas(w, h)

  colorMode(HSB, 100); // Use HSB with scale of 0-100

  for (var i = 0; i < d; i++) {
    for (var j = 0; j < d; j++) {
      var c = color(random(0, 200), 150, 80, 100)
      stroke(c)
      point(cw - d / 2 + i, ch - d / 2 + j)
    }
  }
  t = Date.now() - t

  console.log(t)
}

function draw() {

}