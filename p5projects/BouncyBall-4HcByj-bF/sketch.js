let cx = 0;
let cy = 200;
let speed = 10;
let x = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);
  // let x = map(cx, 0, 400, 0, 255);
  x = lerp(0,cx,0.75)
  fill(x)
  circle(cx,cy,25);
  cx += speed;
  if (cx > width) {
    speed = -speed
  }
  else if (cx < 0) {
    speed = -speed
  }
}