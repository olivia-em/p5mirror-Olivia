// 2D Noise
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/noise/0.5-2d-noise.html
// https://youtu.be/ikwNrFvnL3g
// https://editor.p5js.org/codingtrain/sketches/2_hBcOBrF

// This example has been updated to use es6 syntax. To learn more about es6 visit: https://thecodingtrain.com/Tutorials/16-javascript-es6

let inc = 0.01;
let inc2 = 0.00020;
let zoff = 0;

function setup() {
  createCanvas(400, 400);
  pixelDensity(1);
}

function draw() {
  myClouds(30);
//   noiseDetail(30);
//   let yoff = 0;
//   loadPixels();
//   for (let y = 0; y < height; y++) {
//     let xoff = 0;
//     for (let x = 0; x < width; x++) {
//       let index = (x + y * width) * 4;
//       // let r = random(255);
//       let r = noise(xoff, yoff, zoff) * 255;
//       pixels[index + 0] = 0;
//       pixels[index + 1] = r;
//       pixels[index + 2] = r;
//       pixels[index + 3] = 255;

//       xoff += inc;
//     }
//     zoff += inc2;

//     yoff += inc;

//   }

//   updatePixels();
  //noLoop();
}

function myClouds(detail){

   noiseDetail(detail);
  let yoff = 0;
  loadPixels();
  for (let y = 0; y < height; y++) {
    let xoff = 0;
    for (let x = 0; x < width; x++) {
      let index = (x + y * width) * 4;
      // let r = random(255);
      let r = noise(xoff, yoff, zoff) * 255;
      pixels[index + 0] = 0;
      pixels[index + 1] = r;
      pixels[index + 2] = r;
      pixels[index + 3] = 255;

      xoff += inc;
    }
    zoff += inc2;

    yoff += inc;

  }

  updatePixels();
}