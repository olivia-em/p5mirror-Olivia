// Body segmentation variables
let bodySegmentation;
let video;
let segmentation;
let personImage;

let options = {
  maskType: "parts",
};

let portals = [];
let layeredImage; // off-screen graphics buffer for layering

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
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);

  personImage = createImage(video.width, video.height);

  layeredImage = createGraphics(width, height);
}

function draw() {
  background(0);
  
  // **Step 1: Draw the original background (unaltered)**
  image(portals[2], 0, 0, 640, 480);
  
  if (segmentation) {
    // **Step 2: Create the tunnel effect on the mask only**
    
    // Clear the off-screen graphics
    layeredImage.clear();
    
    let numLayers = 10;
    for (let j = 0; j < numLayers; j++) {
      let scaleFactor = 1 - (j * 0.1);
      let imgW = width * scaleFactor;
      let imgH = height * scaleFactor;
      let offsetX = (width - imgW) / 2;
      let offsetY = (height - imgH) / 2;
      
      layeredImage.image(portals[2], offsetX, offsetY, imgW, imgH);
    }

  let tunnelEffect = layeredImage.get();

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
 // let layeredImg = layeredImage.get();
//  image(layeredImg, 0, 0, width, height);
  image(personImage, 0, 0, width, height);

  }
}

// callback function for body segmentation
function gotResults(result) {
  segmentation = result;
}


