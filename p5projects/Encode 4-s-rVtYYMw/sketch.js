let angle = 0;
let cval = 0;
let direction = 1; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  stroke(255);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  rectMode(CENTER)
}

function draw() {
  blendMode(BLEND);
  background(cval, 0, 255 - cval, 20);
  blendMode(DIFFERENCE);
  
  // Update color over time
  // Update cval smoothly between 0 and 255
  cval += direction;
  if (cval >= 255 || cval <= 0) {
    direction *= -1; // Reverse direction when hitting limits
  }


  // the origin to the center of the canvas, this is now (0,0)
  translate(width / 2, height / 2);
  
  // create a minimum dimension proportional to canvas
  let minDimension = min(width, height);

  strokeWeight(minDimension * 0.015);

  let radius = minDimension * 0.25;
  // xpos & ypos is changing from -1 to 1
  // and multiplying by the radius inserts space between the circle 
  // and the origin
  let x = sin(angle) * radius; 
  let y = cos(angle) * radius;
  fill(0,cval,0)
  stroke(255-cval)
  circle(-y, -x, radius * 0.75);
  circle(y, x, radius * 0.75);
  fill(0,255-cval,0)
  stroke(cval)
  circle(-x, -y, radius * 0.75);
  circle(x, y, radius * 0.75);
  

  angle += 0.02;
}
