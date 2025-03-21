let cx = 0;
let speed = 10;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);
  fillBall();
  bball(200, 0, width);
}

function bball(cy, limit1, limit2) {
  cx += speed;
  if (cx > limit2) {
    speed = -speed;
  } else if (cx < limit1) {
    speed = -speed;
  }
  circle(cx, cy, 25);
}

function fillBall() {
  x = lerp(0, cx, 0.75);
  fill(x);
}
