function setup() {
  createCanvas(400, 400);
  background(120);
  drawFace();
  drawEyes();
  drawEBs();
  drawAntenna();
  drawMouth();
  drawArms();
  drawBody();
}

function drawFace() {
  fill(127, 0, 127);
  ellipse(200, 200, 150, 200);
}

function drawEyes() {
  fill(0, 200, 127);
  ellipse(150, 150, 70, 40);
  ellipse(250, 150, 40, 60);
  fill(0);
  ellipse(170, 150, 5, 5);
  ellipse(270, 150, 10, 10);
}

function drawEBs() {
  stroke(255, 100, 100);
  strokeWeight(15);
  line(130, 110, 170, 120);
  line(230, 105, 270, 100);
}

function drawAntenna() {
  stroke(255);
  strokeWeight(5);
  line(200, 125, 200, 50);
  noFill();
  ellipse(200, 40, 20, 20);
}

function drawMouth() {
  noStroke();
  fill(255, 0, 127);
  ellipse(200, 250, 50, 20);
}

function drawArms() {
  stroke(0);
  strokeWeight(30);
  line(150, 350, 300, 300);
}

function drawBody() {
  noStroke();
  fill(255, 255, 0);
  rect(150, 275, 100, 200);
}
