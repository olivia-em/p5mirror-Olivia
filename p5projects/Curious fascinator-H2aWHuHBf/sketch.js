let xLength, yLength;

// Laser line objects
let leftLine = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  offset: 0, // movement offset
};

let rightLine = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  offset: 0, // movement offset
};

// Variables for automatic animation
let distValue = 10;
let lineValue = 75;
let distDirection = 1; // Controls "opening" or "closing"
let lineDirection = 1; // Expanding or shrinking the number of lines

// Toggle state for lasers
let laser = 0; // Set to 1 to enable lasers, 0 to disable

function setup() {
  xLength = windowWidth;
  yLength = windowHeight;
  createCanvas(xLength, yLength);

  initializeLines();
}

function draw() {
  background(0);

  // If laser is toggled on, animate and draw the lasers
  if (laser === 1) {
    updateLaserMotion();
    animateValues();
    drawLasers();
  }
}

// Handle resizing the window dynamically
function windowResized() {
  xLength = windowWidth;
  yLength = windowHeight;
  resizeCanvas(xLength, yLength);

  initializeLines();
}

// Initialize or update laser line positions
function initializeLines() {
  leftLine.x1 = 0;
  leftLine.y1 = yLength;
  leftLine.x2 = xLength;
  leftLine.y2 = 0;

  rightLine.x1 = xLength;
  rightLine.y1 = yLength;
  rightLine.x2 = 0;
  rightLine.y2 = 0;
}

// Update the motion of the laser lines
function updateLaserMotion() {
  let maxOffset = width / 4; // Maximum oscillation range

  // Use sine wave for smooth oscillation
  leftLine.offset = sin(frameCount * 0.02) * maxOffset;
  rightLine.offset = cos(frameCount * 0.02) * maxOffset;

  // Update positions based on offset
  leftLine.x1 = leftLine.offset;
  leftLine.x2 = xLength - leftLine.offset;

  rightLine.x1 = xLength - rightLine.offset;
  rightLine.x2 = rightLine.offset;
}

// Animate the distValue (line spacing) and lineValue (number of lines)
function animateValues() {
  // Change distValue to create "opening" and "closing" effect
  distValue += distDirection * 0.05;
  if (distValue > 10 || distValue < 2) {
    distDirection *= -1; // Reverse direction
  }

  // Change lineValue to expand or shrink the number of lines
  lineValue += lineDirection * 0.1;
  if (lineValue > 30 || lineValue < 5) {
    lineDirection *= -1; // Reverse direction
  }
}

// Draw all four laser patterns
function drawLasers() {
  vertLine1();
  vertLine2();
  vertLine3();
  vertLine4();
}

// Laser patterns
function vertLine1() {
  strokeWeight(1);
  stroke(10, 255, 155);
  let x2 = leftLine.x2;
  line(leftLine.x1, leftLine.y1, leftLine.x2, leftLine.y2);
  for (let i = 0; i < lineValue; i++) {
    line(leftLine.x1, leftLine.y1, x2, leftLine.y2);
    let shiftX = -distValue;
    x2 += shiftX;
  }
}

function vertLine2() {
  strokeWeight(1);
  stroke(255, 50, 150);
  let x2 = rightLine.x2;
  line(rightLine.x1, rightLine.y1, rightLine.x2, rightLine.y2);
  for (let i = 0; i < lineValue; i++) {
    line(rightLine.x1, rightLine.y1, x2, rightLine.y2);
    let shiftX = distValue;
    x2 += shiftX;
  }
}

function vertLine3() {
  strokeWeight(1);
  stroke(10, 255, 155);
  let x2 = leftLine.x2;
  line(leftLine.x1, leftLine.y2, leftLine.x2, leftLine.y1);
  for (let i = 0; i < lineValue; i++) {
    line(leftLine.x1, leftLine.y2, x2, leftLine.y1);
    let shiftX = -distValue;
    x2 += shiftX;
  }
}

function vertLine4() {
  strokeWeight(1);
  stroke(255, 50, 150);
  let x2 = rightLine.x2;
  line(rightLine.x1, rightLine.y2, rightLine.x2, rightLine.y1);
  for (let i = 0; i < lineValue; i++) {
    line(rightLine.x1, rightLine.y2, x2, rightLine.y1);
    let shiftX = distValue;
    x2 += shiftX;
  }
}

// Toggle laser effect using a keypress
function keyPressed() {
  if (key === "l" || key === "L") {
    laser = 1 - laser; // Toggle laser state between 1 and 0
  }
}

