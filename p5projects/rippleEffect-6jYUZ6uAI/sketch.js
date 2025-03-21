let goRipple = 0;
let circleX;
let circleY;
let circleSize = 0;
let opacity = 255;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(5);
  circleX = width / 2;
  circleY = height / 2;
  // circleSize = 0;
}

function draw() {
  background(0);

  myRipple();
}

function mousePressed() {
  circleX = random(0, windowWidth);
  circleY = random(0, windowHeight);
  circleSize = 0;
  opacity = 255;
}

function myRipple() {
  // if (goRipple == 1) {
  circleSize += 10;
  opacity -= 5;

  stroke(random(0, 255), 0, 255, opacity);
  circle(circleX, circleY, circleSize);
  circle(circleX, circleY, circleSize * 0.75);
  circle(circleX, circleY, circleSize * 0.5);
  // }
}
