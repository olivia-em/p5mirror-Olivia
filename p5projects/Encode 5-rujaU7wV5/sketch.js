let totalPositions = 9;
let positionStep = 0;
let cval = 0;
let direction = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  blendMode(BLEND);
  background(0, 5);
  blendMode(DIFFERENCE);

  // Update color over time
  // Update cval smoothly between 0 and 255
  cval += direction;
  if (cval >= 255 || cval <= 0) {
    direction *= -1; // Reverse direction when hitting limits
  }

  // move origin to center of canvas
  translate(width / 2, height / 2);

  // rotate the circle about (0,0) to positions
  // spaced equally around the origin
  let angle = (360 / totalPositions) * positionStep;

  rotate(angle);

  let minDimension = min(width, height);
  let diam = minDimension * 0.05;
  fill(255 - cval, 0, cval);
  stroke(cval, 0, 255 - cval);
  strokeWeight(minDimension * 0.005);
  circle(50, 0, diam);

  // only change the position when the framecount is divisible by 30
  // so it moves slower
  if (frameCount % 10 === 0) {
    positionStep++;
    if (positionStep >= totalPositions) {
      positionStep = 0;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
