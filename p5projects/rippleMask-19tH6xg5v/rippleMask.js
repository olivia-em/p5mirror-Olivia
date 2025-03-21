let bodySegmentation;
let video;
let segmentation;
let personImage;

let options = {
  maskType: "person",
};

let portals = [];
let fishEye;

function preload() {
  bodySegmentation = ml5.bodySegmentation("SelfieSegmentation", options);
}

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);

  personImage = createImage(video.width, video.height);
  fishEye1 = createGraphics(video.width, video.height);
  fishEye2 = createGraphics(video.width, video.height);

  frameRate(30);
}

function draw() {
  background(0);

  if (segmentation) {
    applyAnimatedFisheyeEffect(video, fishEye1, width / 2, height / 2);

    translate(width, 0);
    scale(-1, 1);

    image(fishEye1, 0, 0, width * 2, height * 4);
    video.mask(segmentation.mask);
    image(video, 0, 0);
  }
}

// Callback for body segmentation
function gotResults(result) {
  segmentation = result;
}

// Animated Fisheye Effect
function applyAnimatedFisheyeEffect(input, output, centerX, centerY) {
  input.loadPixels();
  output.loadPixels();

  let maxDistance = dist(centerX, centerY, 0, 0);
  let tempPixels = new Uint8ClampedArray(output.pixels);

  let time = frameCount / 10; // **Animate the ripple effect over time**

  for (let y = 0; y < input.height; y++) {
    for (let x = 0; x < input.width; x++) {
      let dx = x - centerX;
      let dy = y - centerY;
      let distance = sqrt(dx * dx + dy * dy);
      let angle = atan2(dy, dx);

      // **Animate the ripple effect**
      distance = distance + 100 * sin(distance / 10 + time); // **Time-based movement**

      let tempX = floor(centerX + cos(angle) * distance);
      let tempY = floor(centerY + sin(angle) * distance);

      if (
        tempX >= 0 &&
        tempX < input.width &&
        tempY >= 0 &&
        tempY < input.height
      ) {
        let srcIndex = (tempY * input.width + tempX) * 4;
        let dstIndex = (y * input.width + x) * 4;

        tempPixels[dstIndex] = input.pixels[srcIndex];
        tempPixels[dstIndex + 1] = input.pixels[srcIndex + 1];
        tempPixels[dstIndex + 2] = input.pixels[srcIndex + 2];
        tempPixels[dstIndex + 3] = 255;
      }
    }
  }

  output.pixels.set(tempPixels);
  output.updatePixels();
}
