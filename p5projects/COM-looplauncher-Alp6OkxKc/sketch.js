let angle = 0;
let cval = 0;
let direction = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  blendMode(BLEND);
  background(0, 50);
  blendMode(DIFFERENCE);

  let c1 = color(cval, 0, 255 - cval);
  let c2 = color(255 - cval, 0, cval);

  // Update color over time
  // Update cval smoothly between 0 and 255

  cval += direction;
  if (cval >= 255 || cval <= 0) {
    direction *= -1; // Reverse direction when hitting limits
  }

  let minDimension = min(width, height);
  let spacing = minDimension / 8;
  let x = width / 2;
  let y = height / 2;
  let amount1 = sin(angle) / 2 + 1;
  let amount2 = cos(angle) / 2 + 1;

  let thickness = (minDimension / 40) * amount1;
  strokeWeight(minDimension/50);

  push();
   stroke(0,255,0);
  fill(0,0,0);
  translate(x, y); // rotate about center of canvas
  rectMode(CENTER); // rotate square around its center point
  rotate(angle); // clockwise
  rect(0, 0, spacing * 5, spacing * 5);
  pop();

  push();
  translate(x, y); // rotate about center of canvas
  stroke(0,255,0);
  fill(0,0,255);
  rotate(-angle); // counterclockwise
  triangle(0, -2*spacing , -1.75*spacing, 1*spacing, 1.75*spacing, 1*spacing);
  pop();
  
  push();
  // strokeWeight(thickness);
  translate(x, y); // rotate about center of canvas
  stroke(255,0,0);
  fill(0,0,255);
  circle(0,0,4.5*spacing)
  pop();
  
  push();
  translate(x, y); // rotate about center of canvas
  stroke(255,0,0);
  fill(0,0,255);
  circle(0,0,spacing)
  pop();

  angle += 0.05; // set speed of rotation
}