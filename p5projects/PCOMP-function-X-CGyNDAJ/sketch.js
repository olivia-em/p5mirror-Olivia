// inspired by Sky's Ripple Wave

function setup() {
  createCanvas(700, 700);
  angleMode(DEGREES);
  rectMode(CENTER);
}

function draw() {
  background(0);
  ripple(1, 5, 50, 200, 255);
}

function ripple(frequency, myspeed, num, ramp1, ramp2) {
  let margin = 10;

  let mysize = (width - margin * 2) / num;

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      let x = margin + mysize / 2 + i * mysize;
      let y = margin + mysize / 2 + j * mysize;

      f =
        sin(
          -frameCount * myspeed + dist(width / 2, width / 2, x, y) * frequency
        ) *
          myspeed +
        cos(-frameCount * myspeed);

      if ((i + j) % 2 == 0) {
        noFill();
        strokeWeight(2);
        stroke(dist(width / 2, width / 2, x, y) / 2, ramp1, j * 5);
        rect(x, y, (f * mysize) / 3);
        stroke(dist(width / 2, width / 2, x, y), 20, j);
        circle(x, y, (f * mysize) / 5);
      } else if ((i + j) % 2 == 1) {
        noFill();
        strokeWeight(2);
        stroke(dist(width / 2, width / 2, x, y) / 4, j, ramp2);
        rect(x, y, (f * mysize) / 4);
        stroke(dist(width / 2, width / 2, x, y), 20, j);
        circle(x, y, (f * mysize) / 2);
      }
    }
  }
}
