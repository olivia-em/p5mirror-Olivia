// ------------------- Global Variables -------------------

// Frame rate and visual effects
let FR = 40; // Frame rate (10 to 60)
let blur = 0;
let bgButton = 0; // Inversion toggle
let rain = 0; // Rain state variable
let previousRain = !rain; // Keep track of the previous state of `rain`
let raining = false; // Tracks if it's currently raining

// Grain and transparency
let grain;
let alpha = 0; // Transparency (0 to 1)

// Body segmentation variables
let bodySegmentation;
let video;
let segmentation;
let personImage;

// Grid settings
let gridSize; // Number of rows and columns in the grid (1 to 10)
// rotary to video #
let rot2 = 11;

// Color variables for interactive controls
let pot1 = 0;
let pot2 = 100;
let Rval = 0,
  Bval = 0,
  Hval1 = 0,
  Hval2 = 0;



// Background colors (HSB mode)
let hue1 = 0,
  sat1 = 0,
  br1 = 0; // Hue, Saturation, Brightness

// BodyPix options
let options = {
  maskType: "parts",
};

// Fixed dimensions for video and canvas
const videoWidth = 600;
const videoHeight = 400;

// Drops for rain effect
let drop = [];

// ------------------- Preload -------------------

function preload() {
  // Load the body segmentation model
  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
}

// ------------------- Setup -------------------

function setup() {
  // Create the canvas
  createCanvas(videoWidth, videoHeight);
  colorMode(HSB, 360, 100, 100, 100);

  // Initialize drops for rain effect
  for (let i = 0; i < 400; i++) drop[i] = new Drop();

  // Create the video capture
  video = createCapture(VIDEO);
  video.size(videoWidth, videoHeight);
  video.hide();

  // Start the body segmentation
  bodySegmentation.detectStart(video, gotResults);

  // Create an image for segmented output
  personImage = createImage(video.width, video.height);

  // Initialize the film grain effect
  createFilmGrain(0, 0, videoWidth, videoHeight, 500, 3);
}

// ------------------- Draw -------------------

function draw() {
  // Background with transparency
  background(hue1, sat1, br1);

  // Map potentiometer values to colors
  Rval = map(pot1, 0, 100, 0, 255);
  Bval = map(pot2, 0, 100, 0, 255);
  Hval1 = map(pot1, 0, 100, 0, 360);
  Hval2 = map(pot2, 0, 100, 0, 360);
  

  // Set the frame rate
  frameRate(FR);

  // Toggle raining state when the `rain` variable changes
  if (rain !== previousRain) {
    raining = !raining; // Toggle raining
    previousRain = rain; // Update previous state
  }

  // Handle drops based on the raining state
  if (raining && drop.length > 0) {
    for (let i = 0; i < drop.length; i++) {
      drop[i].show();
      drop[i].update();
    }
  } else if (drop.length > 0) {
    for (let i = 0; i < drop.length; i++) {
      drop[i].show(); // Show static drops when not raining
    }
  }

  // Display the segmented video grid
  if (segmentation) {
    copyForegroundPixels(video, segmentation.mask, personImage);
    drawGrid(personImage);
  }

  // Apply visual effects
  if (blur > 0) filter(BLUR, blur);
  if (bgButton === 1) filter(INVERT);

  // Update and display grain
  updateGrain();
  displayGrain();
}

// ------------------- Utility Functions -------------------

// Draw a grid of the segmented video
function drawGrid(segmentedImage) {
  gridSize = Math.round(map(rot2, 0, 23, 1, 10));
  console.log(gridSize)
  let cellWidth = width / gridSize; // Width of each grid cell
  let cellHeight = height / gridSize; // Height of each grid cell

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let dx = x * cellWidth; // Top-left x of grid cell
      let dy = y * cellHeight; // Top-left y of grid cell
      let dw = cellWidth; // Width of grid cell
      let dh = cellHeight; // Height of grid cell

      // Scale the segmented image to fit each grid cell
      image(segmentedImage, dx, dy, dw, dh);
    }
  }
}

// Process the segmentation results
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
      // Otherwise, copy the source pixel
      resultPixels[i] = imgPixels[i];
      resultPixels[i + 1] = Rval;
      resultPixels[i + 2] = Bval;
      resultPixels[i + 3] = 255; // Ensure the pixel is opaque
    }
  }

  imgResult.updatePixels();
}

// ------------------- Interaction Functions -------------------

// Handle mouse press for fullscreen toggle
function mousePressed() {
  let fs = fullscreen();

  if (!fs) {
    fullscreen(true);
    resizeCanvas(displayWidth, displayHeight);
    video.size(displayWidth, displayHeight);
    personImage.resize(displayWidth, displayHeight);
    createFilmGrain(0, 0, displayWidth, displayHeight, 500, 3);
    initializeDrops();
  } else {
    fullscreen(false);
    resizeCanvas(videoWidth, videoHeight);
    video.size(videoWidth, videoHeight);
    personImage.resize(videoWidth, videoHeight);
    createFilmGrain(0, 0, videoWidth, videoHeight, 500, 3);
    initializeDrops();
  }
}

// ------------------- Grain Effect -------------------

function updateGrain() {
  grain.update();
}

function displayGrain() {
  grain.display();
}

function createFilmGrain(x, y, w, h, patternSize, sampleSize) {
  grain = new FilmGrainEffect(x, y, w, h, patternSize, sampleSize, alpha * 0.1);
}

// ------------------- Rain Drops -------------------

// Initialize or reinitialize the drops
function initializeDrops() {
  drop = [];
  let numDrops = floor((width * height) / 2000); // Adjust drop count based on canvas area
  for (let i = 0; i < numDrops; i++) {
    drop.push(new Drop());
  }
}

// Drop class (animated falling shapes)
function Drop() {
  this.x = random(0, width);
  this.y = random(0, height);

  this.show = function () {
    stroke(Hval1, 100, 100);
    strokeWeight(1);
    fill(Hval2, 100, 100);
    ellipse(this.x, this.y, random(1, 5), random(1, 5));
  };

  this.update = function () {
    this.speed = 18;
    this.gravity = 1.05;
    this.y += this.speed * this.gravity;

    if (this.y > height) {
      this.y = random(0, -height);
      this.gravity = 0;
    }
  };
}

// // ------------------- Key Interaction -------------------

// // Key handling for song control
// // function keyPressed() {
// //   // Toggle song play/pause with space
// //   if (key === " " && song.isPlaying()) song.pause();
// //   else if (key === " ") song.loop();

// //   // Restart song with left arrow
// //   else if (keyCode === LEFT_ARROW) {
// //     song.stop();
// //     song.loop();
// //   }
// // }
