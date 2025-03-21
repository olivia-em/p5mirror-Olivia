function setup() {
  createCanvas(400, 400);
  // rectMode(CENTER);
}

function draw() {
  background(220);
  let W = width / 10;
  let H = height / 10;
  for (let j = 0; j <= height / H; j++) {
    let ypos = j * H;

    for (i = 0; i <= width / W; i++) {
      let xpos = W * i;

      if ((i + j) % 2 == 0) {
        fill("navy");
        circle(xpos, ypos, W);
      } else {
        fill("darkred");
        rect(xpos, ypos, W, H);
      }
    }
  }
}
