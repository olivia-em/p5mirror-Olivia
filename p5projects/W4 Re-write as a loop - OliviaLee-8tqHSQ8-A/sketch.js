let num = 10
let W

function setup() {
  createCanvas(100, 100);
  background(220);
}

function draw() {
  W = width/num
  for (i=0;i<10;i++) {
    let xpos= W*i
    rect(xpos,0,W,height)
  }
}

