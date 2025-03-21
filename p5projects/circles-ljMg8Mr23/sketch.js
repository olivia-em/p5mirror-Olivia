function setup() {
  createCanvas(400,400);
}


function draw() {
  background(1, 9, 61);
  
  let R = 10 * frameCount/2
  
  if (frameCount/2 > width/2) {
  R = width/2
}
  
  let L = -1 * frameCount/2
  
  if (-1 * frameCount/2 < -1 * width/2) {
  L = -1 * width/2
}
  let U = frameCount/2
  
  if (frameCount/2 > height/2) {
  U = height/2
}
  
  let D = -1 * frameCount/2
  
  if (-1 * frameCount/2 < -1 * height/2) {
  D = -1 * height/2
}
  
  
  let C1 = frameCount/2
  
  if (frameCount/2 > sqrt(width**2 + height**2)/2) {
  C1 = sqrt(width**2 + height**2) / 2
}
  
  let C2 = -1 * frameCount/2
  
  if (-1 * frameCount/2 < -1 * sqrt(width**2 + height**2)/2) {
  C2 = -1 * sqrt(width**2 + height**2)/2
}
  
  
  sqrt(width**2 + height**2) / 2
  
  translate(width/2, height/2);
  stroke(255);
  fill(0);
  ellipse(L,0,50,50);
  ellipse(R,0,50,50);
  ellipse(0,U,50,50);
  ellipse(0,D,50,50);
  
  push()
  rotate(PI/2 - atan((height/2)/(width/2)));
  stroke(255);
  fill(0);
  ellipse(0,C1,50,50);
  ellipse(0,C2,50,50);
  pop()
  
  push()
  rotate(atan((height/2)/(width/2)));
  stroke(255);
  fill(0);
  ellipse(C1,0,50,50);
  ellipse(C2,0,50,50);
  pop()
}

