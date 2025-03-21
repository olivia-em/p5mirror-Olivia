let num = 25;
let dim;
let speed = 2;
let size;
let frequency = 10;

let margin = 30;

function setup() {
  createCanvas(500, 500);
  size = (width - margin * 2) / num;
  angleMode(DEGREES);
  rectMode(CENTER);
}

function draw() {
  background(0);
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      let x = margin + size / 2 + i * size;
      let y = margin + size / 2 + j * size;

      f =
        sin(-frameCount *2* speed + dist(250, 250, x, y) * frequency) *
          speed +
        cos(-frameCount * 2*speed);
      noFill();
      strokeWeight(2);
      stroke(dist(250,250, x, y), j * 2, 255);
      rect(x, y, f*size/2);
      circle(x, y, (f * size) / 2);

    }
  }
}

