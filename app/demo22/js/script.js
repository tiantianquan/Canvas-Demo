var w = window.innerWidth
var h = window.innerHeight

var lineWidth = 5

function setup() {
  createCanvas(w, h)

  colorMode(HSB, 100); // Use HSB with scale of 0-100

  for (var i = 0; i < 100; i++) {
    strokeWeight(lineWidth)
 
    var c = color(random(100,200), 150,80, 100); 
    stroke(c)
    ellipse(w / 2, h / 2, i * lineWidth, i * lineWidth)
    noFill()
  }
}

function draw() {

}