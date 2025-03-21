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
}

function draw() {
  blendMode(BLEND);
  cval += direction;
  if (cval >= 255 || cval <= 0) {
    direction *= -1; // Reverse direction when hitting limits
  }
  background(255 - cval, 0, cval, 20);
  blendMode(DIFFERENCE);
  // sets dimension to be proportionl to smaller of width or height
  let minDimension = min(width, height);
  stroke(cval);
  // stroke proportional to canvas dimensions
  strokeWeight(minDimension * 0.015);

  let xStart = width * 0.25;
  let xEnd = width * 0.75;
  // using sin of an angle gives a dynamic speed that makes the circle ease into its limits
  let x = map(sin(angle), -1, 1, xStart, xEnd);

  let y = map(tan(angle), -1, 1, xStart, xEnd);
  // diameter proportional to canvas dimensions
  let diam = minDimension * 0.3;

  circle(x, y, diam);
  circle(y, x, diam);

  angle += 0.05;
}
