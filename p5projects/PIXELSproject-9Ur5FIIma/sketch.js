// add a button, just so people know to click the screen
// or add a text box that prints the message?
// also replace some pixels with the ASCII char being typed, retain color of pixel? & set background color??

// let keyPressCount = 0;


let pw = 200;
let ph = 200;

let cw, ch;

let video;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cw = width / pw;
  ch = height / ph;
  video = createCapture(VIDEO,{flipped: true});
  video.hide();
  // colorMode(HSB, 360, 100, 100);
  pixelDensity(1);
}

function keyPressed() {
  // keyPressCount++; 
  return keyCode;

}

let keyval1 = 0;
let keyval2 = 0;
// let keyval3 = 0;

function draw() {
  background(220);


  // let keyval1 = keyPressed();
  if (keyPressed() % 2 === 0) {
    keyval1 = keyPressed();
  }
  if (keyPressed() % 2 === 1) {
    keyval2 = keyPressed();
  }
  // if (keyPressed() % 3 === 2) {
  //   keyval3 = keyPressed();
  // }

  let cImage = video.get();
  let wr = floor(cImage.width / pw);
  let hr = floor(cImage.width / ph);
  noStroke();
  cImage.loadPixels();
  for (j = 0; j < ph; j++) {
    for (i = 0; i < pw; i++) {
      let imageI = i * wr;
      let imageJ = j * hr;
      let r = cImage.pixels[(imageI + imageJ * cImage.width) * 4];
      let g = map(keyval1, 32, 126, 0, 255);

      let b = map(keyval2, 32, 126, 0, 255);
      // console.log(g);

      //       if (keyval % 3 === 0) {
      //         r = map(keyval1, 32, 126, 0, 255);
      //       } else {
      //         r = cImage.pixels[(imageI + imageJ * cImage.width) * 4];
      //       }

      //       if (keyval % 3 === 1) {
      //         g = map(keyval2, 32, 126, 0, 255);
      //       } else {
      //         g = cImage.pixels[(imageI + imageJ * cImage.width) * 4 + 1];
      //       }

      //       if (keyval % 3 === 2) {
      //         b = map(keyval3, 32, 126, 0, 255);
      //       } else {
      //         b = cImage.pixels[(imageI + imageJ * cImage.width) * 4 + 2];
      //       }

      fill(r, g, b);

      rect(i * cw, j * ch, cw, ch);
    }
  }
  // stroke(255);
  // text(`${key} : ${keyCode}`, 10, 10);
}
