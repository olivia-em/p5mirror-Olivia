function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);

  let W;
  let num = 20;
  let mycolor = "red";
  let i = 0;

  W = width / num;

  while (i < num) {
    let xpos = i * W;

    if (mouseX > xpos && mouseX < xpos + W) {
      fill(mycolor);
    } else {
      fill(255);
    }

    rect(xpos, 0, W, height);
    i += 1;
  }
}
