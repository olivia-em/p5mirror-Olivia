function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  let W = width / 10;
  let H = height / 10;

  // cells in the y direction
  for (let j = 0; j <= height / H; j++) {
    let ypos = j * H;
    // cells in the x direction
    for (i = 0; i <= width / W; i++) {
      let xpos = W * i;

      if (
        mouseX > xpos &&
        mouseX < xpos + W &&
        mouseY > ypos &&
        mouseY < ypos + H
      ) {
        fill("darkred");
      } else {
        fill("white");
      }
      rect(xpos, ypos, W, H);
    }
  }
}
