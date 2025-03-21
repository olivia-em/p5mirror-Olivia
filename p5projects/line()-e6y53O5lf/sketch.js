// function mouseMoved() {
//   console.log(`Mouse X: ${mouseX}, Mouse Y: ${mouseY}`);
// }

function setup() {
  createCanvas(400,400);
}

function draw() {
  background(1, 9, 61);
  stroke(255);
  line(width/4, height/4, 3*width/4, height/4);
  line(3*width/4, height/4, 3*width/4, 3*height/4);
  line(3*width/4, 3*height/4, width/4, 3*height/4);
  line(width/4, 3*height/4, width/4, height/4);
}

