function setup() {
  createCanvas(300, 450);
  // 0-360 degrees rather than radians
  angleMode(DEGREES);
  // draw from center rather than corner
  rectMode(CENTER);
}

function draw() {
  background(0);
  
  stroke(0,0,255)
  
  // red rectangle, height of canvas
  fill(255, 0, 0);
  rect(width / 2, height / 2, width / 2, height);

  // top rotated square, over rectangle (ribbon cut out)
  push();
  translate(width / 2, 0);
  rotate(45);
  fill(0);
  square(0, 0, width / 2);
  pop();
  
  // bottom rotated square, over rectangle (ribbon cut out)
  push();
  translate(width / 2, height);
  rotate(45);
  fill(0);
  square(0, 0, width / 2);
  pop();
  
  // cut rectangle in half 
  strokeWeight(5);
  line(0, height / 2, width, height / 2);
}
