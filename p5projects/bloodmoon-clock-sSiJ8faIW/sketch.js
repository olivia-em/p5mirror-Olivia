function setup() {
  createCanvas(600, 400);
  frameRate(1);
  colorMode(RGB, 255);
  rectMode(CENTER); 
  background("#2E0000");
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function draw() {
if (second() === 0) {
  background("#2E0000");
}
  push();
      stroke('255');
      randXcord = random(0, width);
      randYcord = random(0, height);
      star(randXcord, randYcord, 0.5, 1, 4); 
  pop();
  push();
    drawingContext.save();
    translate(width/2, height);
    rotate(PI/2);
    rotate(map(hour(), 0.1, 24, PI, TWO_PI));
    stroke("#2E0000");
    fill("#c03e1c");
    circle(0, -200, 100);
    fill("#2E0000");
    drawingContext.clip();
    noStroke();
    m = minute();
    minmap = map(m, 0, 60, -100, 100);
    ellipse(minmap, -200, 100, 100);
    drawingContext.restore();
  pop();
  push();   
}
