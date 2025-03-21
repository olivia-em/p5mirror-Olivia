// original by MOQN: https://editor.p5js.org/MOQN/sketches/YSWaCDB6f

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(50);
  drawPinwheel(200, 200, 0.01);
  drawPinwheel(100, 200, 0.4);
  drawPinwheel(300, 200, 0.2);
}

function drawPinwheel(x, y, spd) {
  push();
  translate(x, y);
  rotate(frameCount * spd);
  ellipse(0, 0, 100, 20);
  ellipse(0, 0, 20, 100);
  pop();
}
