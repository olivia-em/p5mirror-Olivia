/*
Based on Alexander Miller’s video on Recreating Vintage Computer Art with Processing and inspired by John Whitney's work:
https://www.youtube.com/watch?v=LaarVR1AOvs&t=181s
*/

let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(2);
  stroke(255);
}

function draw() {
  background(0, 20);
  
  translate(width / 2, height / 2);

  let amplitude = width / 4;

  let x1 = sin(t / 10) * amplitude;
  let y1 = cos(t / 10) * amplitude;

  let x2 = sin(t / 15) * amplitude * 2;
  let y2 = cos(t / 10) * amplitude * 2;

  line(x1, y1, x2, y2);
  t += 0.5;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
