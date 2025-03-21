function setup() {
  createCanvas(533.6, 425);
  angleMode(DEGREES)
}

function draw() {
  background(0,255,255);
  
  push();
  rectMode(CENTER);
  fill(255,0,0);
  noStroke();
  rotate(38.5);
  rect(100,0,1500,40);
  pop();
  
  push();
  ellipseMode(CENTER);
  fill(0,200,1);
  noStroke();
  ellipse(266.8,212.5,275,200);
  pop();
  
  push();
  rectMode(CENTER);
  fill(0,0,128);
  noStroke();
  rect(384,192.5,40);
  pop();
  
}