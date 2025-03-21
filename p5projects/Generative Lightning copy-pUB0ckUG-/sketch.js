let light = 0;

function setup() {
  createCanvas(400, 400);
  xCoord2 = 0;
  yCoord2 = height / 2;
}

function draw() {
  background(0)
  myLight()
}

function keyPressed(){
  if ((light === 0) && (keyCode === ENTER)) {
    light = 1
  }
}

function keyReleased(){
  if ((light === 1) && (keyCode === ENTER)) {
    light = 0
  }
}

function drawBackground() {
  for (var i = 0; i < 500; i++) {
    stroke(i - 255, 30, 50);
    line(0, i, width, i);
  }
}

var xCoord1 = 0;
var yCoord1 = 0;
var xCoord2 = 0;
var yCoord2 = 0;

function myLight(){
  for (var i = 0; i < 20; i++) {
    xCoord1 = xCoord2;
    yCoord1 = yCoord2;
    xCoord2 = xCoord1 + int(random(-20, 20));
    yCoord2 = yCoord1 + int(random(-10, 20));
    strokeWeight(random(1, 3));
    strokeJoin(MITER);
    line(xCoord1, yCoord1, xCoord2, yCoord2);

    if ((xCoord2 > width) | (xCoord2 < 0) | (yCoord2 > height) | (yCoord2 < 0)) {
      // clear();
      // drawBackground();
      xCoord2 = int(random(0, width));
      yCoord2 = 0;
      if (light === 0) {
        noStroke();
      } else {
        stroke(255, 255, random(0, 255));
      }
    }
  }
}