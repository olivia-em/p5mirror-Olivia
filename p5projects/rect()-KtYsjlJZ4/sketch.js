// function mouseMoved() {
//   console.log(`Mouse X: ${mouseX}, Mouse Y: ${mouseY}`);
// }

function setup() {
  createCanvas(400, 400);
}

function draw() {
  // rectangle arguments
  rect(height/3,width/4,width/3,height/4, 10);
  rect(mouseX,mouseY,mouseY,mouseX, 10, 0, 10,0);
}

