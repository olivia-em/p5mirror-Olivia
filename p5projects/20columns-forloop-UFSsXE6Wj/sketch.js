let W;
let num = 20;
let mycolor = "red";
let isRed = false;

function setup() {
  createCanvas(400, 400);
  W = width / num;
}

function draw() {
  background(255);
  for (i = 0; i < num; i++) {
    let xpos = W * i;

    if (mouseX > xpos && mouseX < xpos + W) {
      fill(mycolor);
    } else {
      fill("white");
    }

    rect(xpos, 0, W, height);
  }
}


