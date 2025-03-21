function setup() {
  createCanvas(400, 400);
}

let x = 0
let y = 0

function draw() {
  background(220,0,100);
  stroke(0)
  ellipse(x,y,50,50)
  
  x = lerp(x, mouseX, 0.01);
  y = lerp(y, mouseY, 0.01);
  
}