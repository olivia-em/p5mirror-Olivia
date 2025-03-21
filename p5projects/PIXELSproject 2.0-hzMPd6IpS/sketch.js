let video;
let pw = 100; // Number of pixels in width
let ph = 100; // Number of pixels in height
let cw, ch;
let keyval1 = 0;
let keyval2 = 0;
let clearedPixels = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(400, 400);
  video.hide();
  cw = windowWidth / pw;
  ch = windowHeight / ph;
  setInterval(clearRandomPixels, 1000);
}

function draw() {
  background(255);
  // Splits ASCII values into 2 groups
  if (keyPressed() % 2 === 0) {
    keyval1 = keyPressed();
  }
  if (keyPressed() % 2 === 1) {
    keyval2 = keyPressed();
  }
  let cImage = video.get();
  let wr = floor(cImage.width / pw);
  let hr = floor(cImage.height / ph);
  let char = document.getElementById("i1").value; // make input field value a variable
  noStroke();
  cImage.loadPixels();

  for (let j = 0; j < ph; j++) {
    for (let i = 0; i < pw; i++) {
      let imageI = i * wr;
      let imageJ = j * hr;
      // keeps red value of the video pixel
      let r = cImage.pixels[(imageI + imageJ * cImage.width) * 4];
      // maps even ASCII values to an RGB value
      let g = map(keyval1, 32, 126, 0, 255);
      // maps odd ASCII values to an RGB value
      let b = map(keyval2, 32, 126, 0, 255);
      // draw pixel
      rect(i * cw, j * ch, cw, ch);

      // Check if this pixel has been cleared
      if (!clearedPixels.includes(`${i},${j}`)) {
        fill(r, g, b);
      } else {
        fill(255); // white text
        // Draw the character at the calculated position in the grid
        text(char, i * cw + cw / 2, j * ch + ch / 2);
        // but keep pixel colors
        fill(r, g, b);
      }
    }
  }
}
// gets keycode for the keyval variables
function keyPressed() {
  // keyPressCount++;
  return keyCode;
}

// Function to clear 500 random pixels
function clearRandomPixels() {
  clearedPixels = []; // Reset cleared pixels
  let totalPixels = pw * ph;
  let pixelsToClear = 500;

  for (let n = 0; n < pixelsToClear; n++) {
    let randomPixel = floor(random(totalPixels));
    let i = randomPixel % pw; // X index
    let j = floor(randomPixel / pw); // Y index
    clearedPixels.push(`${i},${j}`);
  }
}
// clears input field on click of button
function myClear() {
  document.getElementById("i1").value = "";
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(400, 400);
  video.hide();
  cw = windowWidth / pw;
  ch = windowHeight / ph;
}
