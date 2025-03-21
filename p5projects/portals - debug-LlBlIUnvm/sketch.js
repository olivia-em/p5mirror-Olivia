// Body segmentation variables
let bodySegmentation;
let video;
let segmentation;
let personImage;
let tunnelBuffer;

let options = {
  maskType: "parts",
};

let portals = [];
let isSetupComplete = false;

function preload() {
  let images = 18;
  for (let i = 1; i < images + 1; i++) {
    let path = 'images/' + String(i) + '.jpeg';
    loadImage(path, 
      img => {
        portals.push(img);
      }, 
      err => console.error("Failed to load:", path, err)
    );
  }

  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
}

function setup() {
  createCanvas(640, 480);
  
  // Create the video
  video = createCapture(VIDEO, videoReady);
  video.size(640, 480);
  video.hide();

  // Create an image for segmented output
  personImage = createImage(640, 480);
  
  // Create a buffer for the tunnel effect
  tunnelBuffer = createGraphics(640, 480);
}

function videoReady() {
  console.log("Video is ready");
  bodySegmentation.detectStart(video, gotResults);
  isSetupComplete = true;
}

function draw() {
  background(0);
  
  // Draw the background image
  if (portals.length > 2) {
    image(portals[2], 0, 0, 640, 480);
  }

  // Make sure everything is initialized before trying to use it
  if (isSetupComplete && segmentation && video.loadedmetadata) {
    // Alternative method using the video feed for tunnel effect
    createVideoTunnelEffect();
    image(personImage, 0, 0, width, height);
  }
}

// Callback function for body segmentation
function gotResults(result) {
  segmentation = result;
}

function createVideoTunnelEffect() {
  // Capture the current video frame
  tunnelBuffer.clear();
  tunnelBuffer.image(portals[2], 0, 0, width, height);
  let personFrame = tunnelBuffer.get();
  
  // Clear the tunnel buffer for creating the effect
  tunnelBuffer.clear();
  
  // Number of layers for the tunnel effect
  const numLayers = 5;
  const scaleStep = 0.1; // 20% reduction per layer
  
  // Draw the layers from back to front (smallest to largest)
  for (let i = 0; i <= numLayers - 1; i++) {
    // Calculate scaling for this layer (gets smaller with each step)
    let scaleFactor = 1 - (i * scaleStep);
    let imgW = width * scaleFactor;
    let imgH = height * scaleFactor;
    
    // Center the image to create the tunnel effect
    let offsetX = (width - imgW) / 2;
    let offsetY = (height - imgH) / 2;

    
    // Draw the current layer to the tunnel buffer
    tunnelBuffer.image(personFrame, offsetX, offsetY, imgW, imgH);
  }
  
  // Get the tunnel effect
  let tunnelEffect = tunnelBuffer.get();
  
  // Apply mask to show the tunnel effect only where the person is
  tunnelEffect.loadPixels();
  segmentation.mask.loadPixels();
  personImage.loadPixels();
  
  for (let i = 0; i < personImage.pixels.length; i += 4) {
    // If this is a foreground pixel (not white in the mask)
    if (!(segmentation.mask.pixels[i] === 255 && 
          segmentation.mask.pixels[i + 1] === 255 && 
          segmentation.mask.pixels[i + 2] === 255)) {
      // Copy the tunnel effect pixel to the person image
      personImage.pixels[i] = tunnelEffect.pixels[i];
      personImage.pixels[i + 1] = tunnelEffect.pixels[i + 1];
      personImage.pixels[i + 2] = tunnelEffect.pixels[i + 2];
      personImage.pixels[i + 3] = 255; // Full opacity
    } else {
      // Make this pixel transparent
      personImage.pixels[i + 3] = 0;
    }
  }
  
  personImage.updatePixels();
}