/*
Inspired by the classic Windows Mystify screensaver

Based on code translation from Chris DeLeon's Programming in 5 minutes: remaking “Mystify Your Mind” Windows 95-style screensaver effect
https://www.youtube.com/watch?v=-X_A1Hqj-qA
*/


let x1;
let y1;
let x2;
let y2;

let x1speed;
let y1speed;
let x2speed;
let y2speed;

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(255);
  strokeWeight(2);

  x1 = random(width);
  y1 = random(height);
  x2 = random(width);
  y2 = random(height);

  x1speed = random(-10, 10);
  y1speed = random(-10, 10);
  x2speed = random(-10, 10);
  y2speed = random(-10, 10);
}

function draw() {
  background(0, 10);

  line(x1, y1, x2, y2);
  circle(x1, y1,20);
  circle(x2, y2,20)
  
  x1 += x1speed;
  y1 += y1speed;
  x2 += x2speed;
  y2 += y2speed;

  if (x1 < 0 || x1 > width) x1speed *= -1;
  if (y1 < 0 || y1 > height) y1speed *= -1;
  if (x2 < 0 || x2 > width) x2speed *= -1;
  if (y2 < 0 || y2 > height) y2speed *= -1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}
