let angle = 0;
let cval = 0;
let direction = 1; 
let xpos = 100,
  ypos = 100;
let xSpeed = 3, ySpeed = 2;

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
  background(cval, 0, 255 - cval, 20);
  blendMode(EXCLUSION);

  // Update color over time
  // Update cval smoothly between 0 and 255
  cval += direction;
  if (cval >= 255 || cval <= 0) {
    direction *= -1; // Reverse direction when hitting limits
  }

  let minDimension = min(width, height);

  let amount1 = sin(angle) / 2 + 0.6;
  let amount2 = cos(angle) / 2 + 0.6;
  let speed = 1;

  let thickness = (minDimension / 20) * amount1;
  strokeWeight(thickness);

  // change diameter based on amount as well
  let diam1 = (minDimension / 2) * amount1;
  let diam2 = (minDimension / 2) * amount2;
  stroke(255);

  // Bounce off walls
  if (xpos >= width || xpos <= 0) {
    xSpeed *= -1; // Reverse X direction
  }
  if (ypos >= height || ypos <= 0) {
    ySpeed *= -1; // Reverse Y direction
  }

  
  circle(xpos, ypos, diam1);
  circle(xpos, ypos, diam2);

  angle += 0.03;
  xpos += xSpeed;
  ypos += ySpeed;
}
