// Body segmentation variables
let bodySegmentation;
let video;
let segmentation;
let personImage;

let options = {
  maskType: "parts",
};

let portals = [];


function preload() {
  let images = 18;
  for (let i = 1; i < images + 1; i++) {
    let path = 'images/' + String(i) + '.jpeg';
    loadImage(path, 
      img => {
        portals.push(img);
        // console.log("Loaded:", path);
      }, 
      err => console.error("Failed to load:", path, err)
    );
  }

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
  
   // frameRate(5);
}

var ii = 0;

let i = 0; // Index for portals
let lastSwitchTime = 0; // Stores last switch time
const switchInterval = 10000; // 10 seconds

function draw() {
  background(0);

  // Every 10 seconds, update i
  if (millis() - lastSwitchTime > switchInterval) {
    i = (i + 1) % portals.length; // Loop back to start if it exceeds length
    lastSwitchTime = millis(); // Reset time
  }

  // Show background image
  image(portals[i], 0, 0, 640, 480);

  // Display the segmented mask filled with the next portal image
  if (segmentation) {
    let maskIndex = (i + 1) % portals.length; // Ensure it loops correctly
    copyForegroundPixels(portals[maskIndex], segmentation.mask, personImage);
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

  const imgWidth = imgResult.width;
  const imgHeight = imgResult.height;
  const imgChannels = 4;

  const sourceWidth = imgSource.width;
  const sourceHeight = imgSource.height;

  const scaleX = sourceWidth / imgWidth;
  const scaleY = sourceHeight / imgHeight;

  for (let y = 0; y < imgHeight; y++) {
    for (let x = 0; x < imgWidth; x++) {
      let index = (y * imgWidth + x) * imgChannels;
      let maskR = imgMask.pixels[index];
      let maskG = imgMask.pixels[index + 1];
      let maskB = imgMask.pixels[index + 2];

      // Map coordinates to the source image
      let srcX = floor(x * scaleX);
      let srcY = floor(y * scaleY);
      let srcIndex = (srcY * sourceWidth + srcX) * imgChannels;

      if (maskR === 255 && maskG === 255 && maskB === 255) {
        // If the mask is white, make pixel transparent
        imgResult.pixels[index] = 0;
        imgResult.pixels[index + 1] = 0;
        imgResult.pixels[index + 2] = 0;
        imgResult.pixels[index + 3] = 0;
      } else {
        // Map pixels from portals[2] properly
        imgResult.pixels[index] = imgSource.pixels[srcIndex];
        imgResult.pixels[index + 1] = imgSource.pixels[srcIndex + 1];
        imgResult.pixels[index + 2] = imgSource.pixels[srcIndex + 2];
        imgResult.pixels[index + 3] = 255; // Full opacity
      }
    }
  }

  imgResult.updatePixels();
}
