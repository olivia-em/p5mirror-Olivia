function setup() {
  createCanvas(400, 400);
  background(220);
}

let x = 50;

// x++; could either go here or inside the draw function, depending on if you want the box to be moving as the code refreshes or if you only want it to move based on user interaction. 


function draw() {
  x++;
  
  // y wasn't defined, so I gave it a dimension
  rect(x, 150, 50, 50);
  
  if(mouseX > x && mouseX < x + 50) {
    x = mouseX;
  }
  
}