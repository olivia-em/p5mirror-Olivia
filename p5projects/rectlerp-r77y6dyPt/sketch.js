function setup() {
  createCanvas(400,400);
}


function draw() {
  background(1, 9, 61);
  translate(width/2,height/2)
  
  stroke(255);
  
  let x = width/4
  let y = height/4

  line(x,-y,x,y);
  line(-x,-y,-x,y);
  line(-x,y,x,y);
  line(-x,-y,x,-y);

  
  x = lerp(x, mouseX, 0.01);
  y = lerp(y, mouseY, 0.01);
}

