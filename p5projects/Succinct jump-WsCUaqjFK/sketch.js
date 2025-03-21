/*
Inspired by Jongmin Park's sketch from Programming for Artists @ CUNY CCNY Spring 2022
*/

function setup() {
  createCanvas(600, 600);
  noStroke();
}

function draw() {
  
  let x = mouseX;
  let y = mouseY;
  
  if (mouseIsPressed) {
    background(80, 150);
    fill(255, 150);
  } else {
    background(150, 80);
    fill(0, 150);
  }
  
  circle(x, height / 2, y);

  let inverseX = width + mouseX;
  let inverseY = height - mouseY;

  circle(inverseX, height / 2, inverseY);

  if (mouseY < height / 3) {
    fill(20, 150);
    rect(0, 0, width, height / 3);
  } else if (mouseY < height / 3) {
    fill(80, 150);
    rect(0, height / 3, width, height);
  } else {
    fill(140, 150);
    rect(0, height / 3 * 2, width, height / 3);
  }
}