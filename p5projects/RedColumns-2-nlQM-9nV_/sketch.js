
let num = 3;
let c1;
let c2;
let c3;
let mycolor = "red";
let mycolor2 = "white";
let isRed = false;

function setup() {
  createCanvas(400, 400);
  W = width / num;
}

function draw() {
  background(255);
  // fill('white');
  if (mouseX > W && mouseX < 2*W && isRed == false) {
      fill('red');
    isRed == true
    }
  else {
    fill('white');
    isRed == false
  }
    
  // c1 = rect(0,0,W,height);
  c2 = rect(width/num,0,W,height);
  // c3 = rect((2*width)/num,0,W,height);

    
}
