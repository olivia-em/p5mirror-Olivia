let img;

function preload() {
  img = loadImage("thorn.jpeg");
}

function setup() {
  img.resize(400, 0);
  createCanvas(img.width, img.height);
}

function pixNeighbors(x, y) {
  if (x + 1 < img.width && y < img.height) {
    let index = 4 * (x + y * img.width);
    let index1 = 4 * (x + 1 + y * img.width);

    img.pixels[index] = (img.pixels[index] + img.pixels[index1]) / 2;
    img.pixels[index + 1] =
      (img.pixels[index + 1] + img.pixels[index1 + 1]) / 2;
    img.pixels[index + 2] =
      (img.pixels[index + 2] + img.pixels[index1 + 2]) / 2;
  }
}

function myFilter() {
  img.loadPixels();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      // let index = 4 * (i + j * img.width);
      pixNeighbors(i, j);
      // let b =
      //   (img.pixels[index] + img.pixels[index + 1] + img.pixels[index + 2]) / 3;
      // img.pixels[index] = b;
      // img.pixels[index + 1] = b;
      // img.pixels[index + 2] = b;
    }
  }
  img.updatePixels();
}

function draw() {
  background(220);
  myFilter();
  image(img, 0, 0, width, height);
  noLoop();
}
