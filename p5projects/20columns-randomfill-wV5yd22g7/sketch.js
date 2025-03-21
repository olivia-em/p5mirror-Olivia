let i = 0;
let W;
let num = 20;
let mycolor = [];

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < num; i++) {
    mycolor[i] = color(random(255), random(255), random(255));
  }
}

function draw() {
  background(255);

  W = width / num;

  for (i = 0; i < num; i++) {
    let xpos = i * W;

    if (mouseX > xpos && mouseX < xpos + W) {
      fill(mycolor[i]); // random color
    } else {
      fill(255); // when not hovering, white
    }

    rect(xpos, 0, W, height); // draw rect
  }
}
