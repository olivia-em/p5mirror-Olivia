let mic;

function setup() {
  createCanvas(400, 400);

  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  let vol = mic.getLevel();

  if (vol > 0.2) {
    background(255, 0, 200);
  } else {
    background(255, 0, 100);
  }

  fill(100, 0, 255);
  stroke(0);

  let w = map(vol, 0, 1, 100, 500);
  circle(width / 2, height / 2, w);
}
