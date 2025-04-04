let font;
let textA = "he had just been\na concept";
let textB = "you put words to the page";
let currentText = textA;
let rotationY = 0;
let lastSwitched = false; // Prevents multiple switches per cycle

function preload() {
  font = loadFont('Staatliches-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  blendMode(BLEND);
  background('red');
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(50);

  // Rotate text
  rotationY += 0.02;
  if (rotationY >= TWO_PI) {
    rotationY -= TWO_PI; // Keep rotation in range
    lastSwitched = false; // Reset switch flag after full cycle
  }

  // Swap text at 180° (π) and 360° (0 or TWO_PI)
  if ((abs(rotationY - PI) < 0.02 || abs(rotationY - TWO_PI) < 0.02) && !lastSwitched) {
    currentText = (currentText === textA) ? textB : textA;
    lastSwitched = true; // Prevents rapid switching
  }

  rotateY(rotationY);

  push();
  fill(255);
  text(currentText, 0, 0);
  pop();
//  noLoop()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

