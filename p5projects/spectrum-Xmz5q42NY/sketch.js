function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
}

function draw() {
  // background(360, 100, 100);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      strokeWeight(2);
      stroke(360 * (x / width), 100 * (1 - y / height), 100);
      point(x, y);
    }
  }
}
