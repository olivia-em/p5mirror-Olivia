/*
Based on Alexander Miller’s video on Recreating Vintage Computer Art with Processing and inspired by John Whitney's work:
https://www.youtube.com/watch?v=LaarVR1AOvs&t=181s
*/

let t = 0;
let numLines = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(2);
  stroke(255);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  let amplitude = width / 4;

  for (let i = 0; i < numLines; i++) {
    let x1 = sin((t + i) / 10) * amplitude;
    let y1 = cos((-t + i) / 10) * amplitude + sin(((t + 1) / 5) * 50);

    let x2 = sin((t + i) / 20) * (amplitude * 2) + cos(t + 1) * 10;
    let y2 = cos((-t + i) / 10) * (amplitude * 2);

    line(x1, y1, x2, y2);
  }

  t += 0.2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
