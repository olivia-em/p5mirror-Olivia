function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);

  let W;
  let num = 20;
  let mycolor1 = "red";
  let mycolor2 = "blue";
  let i = 0;

  W = width / num;

  while (i < num) {
    let xpos = i * W;

    if (i % 2 == 0 && mouseX > xpos && mouseX < xpos + W) {
      fill(mycolor1); // fill first half red
    } else if (i % 2 != 0 && mouseX > xpos && mouseX < xpos + W) {
      fill(mycolor2); // fill second half blue
    } else {
      fill(255); // when not hovering, white
    }

    rect(xpos, 0, W, height); // draw rect
    i++; // increment
  }
}