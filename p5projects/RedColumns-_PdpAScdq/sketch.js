let W;
let num = 20;
let mycolor = "red";
let isRed = false;
let lastCol = -1;

function setup() {
  createCanvas(400, 400);
  W = width / num;
}

function draw() {
  background(255);
  for (i = 0; i < num; i++) {
    let xpos = W * i;

    if (mouseX > xpos && mouseX < xpos + W) {
      
      if (i == 0) {
        if (lastCol!=0){
        isRed = !isRed;
          }
      } else {
        fill(mycolor)
      }
      lastCol=i;
    } else {
      fill('white')
    }
      
      
      
      if ((i==0) && (isRed)){
        fill(mycolor)
      }
      // fill(mycolor);
      rect(xpos, 0, W, height);

    }
  
}
