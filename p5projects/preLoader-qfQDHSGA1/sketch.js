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
  background(0, 10);
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
  let amount1 = sin(angle) / 2 + 0.6;
  let amount2 = cos(angle) / 2 + 0.6;

  let thickness = (minDimension / 20) * amount1;
  strokeWeight(thickness);

  push();
  stroke(255 - cval, 0, cval);
  fill(cval, 255 - cval, 0);
  translate(x, y); // rotate about center of canvas
  rectMode(CENTER); // rotate square around its center point
  rotate(angle); // clockwise
  rect(0, 0, spacing * 3 * amount1, spacing * 3 * amount1);
  pop();

  push();
  translate(x, y); // rotate about center of canvas
  rectMode(CENTER);
  stroke(255 - cval, 0, cval);
  fill(cval, 255 - cval, 0);
  // stroke(cval, 0, 255 - cval);
  // fill(255 - cval, 0, cval);
  rotate(-angle); // counterclockwise
  rect(0, 0, spacing * 3 * amount2, spacing * 3 * amount2);
  pop();

  angle += 0.03; // set speed of rotation
}