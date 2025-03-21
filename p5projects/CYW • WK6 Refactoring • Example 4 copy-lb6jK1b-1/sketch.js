/*
Inspired by the classic Windows Mystify screensaver

Based on code translation from Chris DeLeon's Programming in 5 minutes: remaking 
“Mystify Your Mind” Windows 95-style screensaver effect.
https://www.youtube.com/watch?v=-X_A1Hqj-qA
*/

let lines = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(255);
  strokeWeight(2);
  
  for (let i = 0; i < 2; i++) {
    lines.push(new bouncyLine());
  }
}

function draw() {
  background(0, 10);

  // Iterate over each line and update its movement
  lines.forEach(line => {
    line.update();
    line.display();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class bouncyLine {
  constructor() {
    this.x1 = random(width);
    this.y1 = random(height);
    this.x2 = random(width);
    this.y2 = random(height);
    this.dx1 = random(-10, 10);
    this.dy1 = random(-10, 10);
    this.dx2 = random(-10, 10);
    this.dy2 = random(-10, 10);
  }
  
  update() {
    this.x1 += this.dx1;
    this.y1 += this.dy1;
    this.x2 += this.dx2;
    this.y2 += this.dy2;
    
    this.checkBounds();
  }
  
  checkBounds() {
    if (this.x1 < 0 || this.x1 > width) this.dx1 *= -1;
    if (this.y1 < 0 || this.y1 > height) this.dy1 *= -1;
    if (this.x2 < 0 || this.x2 > width) this.dx2 *= -1;
    if (this.y2 < 0 || this.y2 > height) this.dy2 *= -1;
  }

  display() {
    line(this.x1, this.y1, this.x1, this.y2);
  }
}
