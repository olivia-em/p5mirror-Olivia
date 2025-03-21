// Body segmentation variables
let bodySegmentation;
let video;
let segmentation;
let personImage;

let options = {
  maskType: "parts",
};

function preload() {
  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
}

function setup() {
  createCanvas(640, 480);
  // Create the video
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);

  // Create an image for segmented output
  personImage = createImage(video.width, video.height);
  
}

function draw() {
  background(0);

  // Display the segmented video grid
  if (segmentation) {
    copyForegroundPixels(video, segmentation.mask, personImage);
    image(personImage, 0, 0, width, height);
  }
}
// callback function for body segmentation
function gotResults(result) {
  segmentation = result;
}

// Copy foreground pixels from the video based on the mask
function copyForegroundPixels(imgSource, imgMask, imgResult) {
  imgSource.loadPixels();
  imgMask.loadPixels();
  imgResult.loadPixels();

  const imgWidth = imgSource.width;
  const imgHeight = imgSource.height;
  const imgChannels = 4;
  const numValues = imgWidth * imgHeight * imgChannels;
  const imgPixels = imgSource.pixels;
  const maskPixels = imgMask.pixels;
  const resultPixels = imgResult.pixels;

  for (let i = 0; i < numValues; i += imgChannels) {
    let maskR = maskPixels[i];
    let maskG = maskPixels[i + 1];
    let maskB = maskPixels[i + 2];

    // If the mask pixel is white, clear the result pixel
    if (maskR === 255 && maskG === 255 && maskB === 255) {
      resultPixels[i] = 0;
      resultPixels[i + 1] = 0;
      resultPixels[i + 2] = 0;
      resultPixels[i + 3] = 0;
    } else {
      // Otherwise, copy the source pixel with applied colors
      resultPixels[i] = imgPixels[i]; 
      resultPixels[i + 1] = imgPixels[i + 1]; 
      resultPixels[i + 2] = imgPixels[i + 2]; 
      resultPixels[i + 3] = 255; // Ensure the pixel is opaque
    }
  }

  imgResult.updatePixels();
}