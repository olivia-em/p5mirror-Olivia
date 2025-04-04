// Animated Fisheye Effect
// https://editor.p5js.org/jeffThompson/sketches/amZAWPv9S
let bodySegmentation;
let video;
let segmentation;
let personImage;
let fullscreenButton;

let options = {
  maskType: "person",
};

let fishEye;

function preload() {
  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  video = createCapture(VIDEO);
  video.size(640, 480); // Fixed capture size
  video.hide();

  bodySegmentation.detectStart(video, gotResults);

  personImage = createImage(video.width, video.height);
  fishEye = createGraphics(video.width, video.height);

  frameRate(30);

  // Create fullscreen button
  fullscreenButton = createButton("Fullscreen");
  fullscreenButton.position(10, 10);
  fullscreenButton.mousePressed(toggleFullscreen);
}

function toggleFullscreen() {
  let fs = fullscreen();
  fullscreen(!fs);
  fullscreenButton.style("display", fs ? "block" : "none");
  setTimeout(() => {
    resizeCanvas(windowWidth, windowHeight);
  }, 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  fullscreenButton.style("display", fullscreen() ? "none" : "block");
}

function draw() {
  background(0);

  let videoAspect = video.width / video.height;
  let canvasAspect = width / height;

  let drawWidth, drawHeight;
  if (canvasAspect > videoAspect) {
    drawWidth = width;
    drawHeight = width / videoAspect;
  } else {
    drawHeight = height;
    drawWidth = height * videoAspect;
  }

  let xOffset = (width - drawWidth) / 2;
  let yOffset = (height - drawHeight) / 2;

  applyAnimatedFisheyeEffect(video, fishEye, video.width / 2, video.height / 2);
  image(video, xOffset, yOffset, drawWidth, drawHeight);

  if (segmentation) {
    copyForegroundPixels(fishEye, segmentation.mask, personImage);
    push();
    translate(width, 0);
    scale(-1, 1);
    image(personImage, xOffset, yOffset, drawWidth, drawHeight);
    pop();
  }
}

function copyForegroundPixels(imgSource, imgMask, imgResult) {
  imgSource.loadPixels();
  imgMask.loadPixels();
  imgResult.loadPixels();

  let totalPixels = imgResult.pixels.length;
  const imgChannels = 4;

  for (let i = 0; i < totalPixels; i += imgChannels) {
    let maskR = imgMask.pixels[i + 3];

    if (maskR === 255) {
      imgResult.pixels[i + 3] = 0;
    } else {
      imgResult.pixels[i] = imgSource.pixels[i];
      imgResult.pixels[i + 1] = imgSource.pixels[i + 1];
      imgResult.pixels[i + 2] = imgSource.pixels[i + 2];
      imgResult.pixels[i + 3] = 255;
    }
  }

  imgResult.updatePixels();
}

function gotResults(result) {
  segmentation = result;
}

function applyAnimatedFisheyeEffect(input, output, centerX, centerY) {
  input.loadPixels();
  output.loadPixels();
  let maxDistance = dist(centerX, centerY, 0, 0);
  let tempPixels = new Uint8ClampedArray(output.pixels);
  let time = frameCount / 10;

  for (let y = 0; y < input.height; y++) {
    for (let x = 0; x < input.width; x++) {
      let dx = x - centerX;
      let dy = y - centerY;
      let distance = sqrt(dx * dx + dy * dy);
      let angle = atan2(dy, dx);

      distance = distance + 100 * sin((distance / 10) + time);
      let tempX = floor(centerX + cos(angle) * distance);
      let tempY = floor(centerY + sin(angle) * distance);

      if (tempX >= 0 && tempX < input.width && tempY >= 0 && tempY < input.height) {
        let srcIndex = (tempY * input.width + tempX) * 4;
        let dstIndex = (y * input.width + x) * 4;

        tempPixels[dstIndex] = input.pixels[srcIndex];
        tempPixels[dstIndex + 1] = input.pixels[srcIndex + 1];
        tempPixels[dstIndex + 2] = input.pixels[srcIndex + 2];
        tempPixels[dstIndex + 3] = input.pixels[srcIndex + 3];
      } else {
        tempPixels[(y * input.width + x) * 4 + 3] = 0;
      }
    }
  }

  output.pixels.set(tempPixels);
  output.updatePixels();
}
