let angle = 0;
let cval = 0;
let direction = 1; // 1 for increasing, -1 for decreasing

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  blendMode(BLEND);
  background(255 - cval, 0, cval);
  blendMode(DIFFERENCE);

  // define a universal variable so that the shapes
  // are positioned in relation to one another
  let x = width / 2;
  let y = height / 2;

  // set a variable that is proportional to
  // the smaller dimension of the canvas
  // so that the shapes will always fit in the canvas
  // regardless of window size, and be proportional to one another
  let minDimension = min(width, height);
  let spacing = minDimension / 8;

  // Update color over time
  // Update cval smoothly between 0 and 255
  cval += direction;
  if (cval >= 255 || cval <= 0) {
    direction *= -1; // Reverse direction when hitting limits
  }

  // rotate circle and triangle counterclockwise
  push();
  translate(x, y); // rotate about center of canvas

  rotate(-angle);

  fill(255);
  // offset circle from center
  circle(spacing, spacing, spacing * 4);
  // offset triangle from center, with a point overlapping
  // the center of the circle
  fill(255);
  triangle(-spacing, -spacing * 3, spacing, spacing, -spacing * 3, spacing);
  angle += 0.2; // set speed of rotation
  pop();

  push();
  fill(255);
  translate(x, y); // rotate about center of canvas
  rotate(angle);
  rectMode(CENTER); // rotate square around its center point
  square(0, 0, spacing * 4);
  angle += 0.5; // set speed of rotation
  pop();
}
