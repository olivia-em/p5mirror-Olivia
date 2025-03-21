let num = 10
let W
let H

function setup() {
  createCanvas(100, 100);
  background(220);
}

function draw() {
  for (i=0;i<10;i++) {
    let xpos= width/num*i
    let ypos= height/num*i
    H = height-10*i
    W = width - 10*i
    rect(xpos,ypos,W,H)
  }
}



