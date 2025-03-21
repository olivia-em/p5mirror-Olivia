// ------------------- Global Variables -------------------

// Frame rate and visual effects
let FR = 60; // Frame rate (10 to 60)
let blur = 0; // Blur effect strength
let bgButton = 0; // Background inversion toggle
let rain = 0; // Rain effect toggle

// Grain and transparency
let grain; // Grain effect instance
let grainA = 0; // Grain transparency (0 to 1)
let prevA; // Previous grain transparency for comparison

// Body segmentation variables
let bodySegmentation; // Body segmentation instance
let video; // Video capture
let segmentation; // Body segmentation results
let personImage; // Image for segmented body output

// Grid settings
let gridSize; // Number of rows and columns in the grid (1 to 10)
let rot2 = 11; // Rotary control for grid columns and rows

// Delay variables for grid effect
let delay = 0; // Delay toggle (0 = off, 1 = on)
let buffers = []; // Buffers for delayed frames
let maxDelay = 20; // Maximum delay multiplier for buffer size

// Color variables for interactive controls
let pot1 = 0,
  pot2 = 0; // Potentiometer values
let Rval = 0,
  Bval = 0; // Mapped red and blue values
let Hval1 = 0,
  Hval2 = 0; // Mapped hue values for visual effects

// Background colors (HSB mode)
let rot1 = 0,
  hue = 0,
  sat1 = 0,
  br1 = 0; // Hue, Saturation, Brightness

// BodyPix options
let options = { maskType: "parts" };

// Fixed dimensions for video and canvas
const videoWidth = 600;
const videoHeight = 400;

// Raindrop and ball effect variables
let drop = []; // Drops for rain effect
let bballs = []; // Ball objects for effect
let ballsEffect = 0; // Toggle for ball effect

// Ripple effect variables
let ripples = []; // Ripple objects
let rippleA = 0; // Ripple toggle

// Lightning effect variables
let lightA = 0; // Lightning effect toggle

// p5.webserial library instance and related variables
const serial = new p5.WebSerial(); // WebSerial library instance
let portButton; // Button for port selection
let inData = []; // Array for incoming serial data
let inString = []; // String for incoming serial data
let outByte = 0; // Byte for outgoing serial data

// Variables for laser effect
let laser = 0; // Laser toggle
let leftLine = {},
  rightLine = {}; // Laser line positions
let distValue = 10; // Distance between laser lines
let lineValue = 75; // Number of laser lines
let distDirection = 1; // Direction for distance animation
let lineDirection = 1; // Direction for line count animation

// ------------------- Preload -------------------

let sound;
let amp;
let mic;
let myAmp;
let mappedAmp;

function preload() {
  // Load the body segmentation model
  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
  // sound = loadSound("shiver-short.mp3")
}

// ------------------- Initialize Mic -------------------

function initializeSound() {
     // Start FFT analysis
  fft = new p5.FFT();
  mic = new p5.AudioIn();
  mic.start();
  // amp = new p5.Amplitude(0.9)
  fft.setInput(mic);
}

// ------------------- Setup -------------------

function setup() {
  createCanvas(videoWidth, videoHeight); // Canvas setup
  colorMode(HSB, 360, 100, 100, 100); // Use HSB color mode

  xLength = windowWidth;
  yLength = windowHeight;

  initializeLines(); // Initialize laser lines
  initializeDrops(); // Initialize rain drops
  initializeBalls(); // Initialize balls for visual effect

  video = createCapture(VIDEO); // Capture video
  video.size(videoWidth, videoHeight);
  video.hide();

  bodySegmentation.detectStart(video, gotResults); // Start body segmentation
  personImage = createImage(video.width, video.height); // Image for segmented body

  createFilmGrain(0, 0, videoWidth, videoHeight, 500, 3); // Create grain effect

  // Setup WebSerial events
  setupWebSerial();
  initializeSound()
  // sound.loop()
}

// Handle resizing the window dynamically
function windowResized() {
  xLength = windowWidth;
  yLength = windowHeight;
  resizeCanvas(xLength, yLength);
  initializeLines();
  initializeDrops();
  initializeBalls();
}

// ------------------- Draw -------------------

function draw() {
  // Set background color
  background(hue, sat1, br1);
  
  // get amplitude level
  // myAmp = amp.getLevel();
  fft.analyze();
  // Get amplitude energy from FFT
  amp = fft.getEnergy(10, 1050);

  // Map amp value to the range 0-100
  mappedAmp = map(amp, 0, 255, 0, 100);

  console.log(amp)
  
  // Map potentiometer values to colors
  mapPotentiometerValues();

  // Set frame rate
  frameRate(FR);

  // Ball effect
  if (ballsEffect === 1) drawBalls();

  // Laser effect
  if (laser === 1) drawLasersWithAnimation();

  // Rain effect
  if (rain === 1) drawRainDrops();

  // Ripple effect
  drawRipples();

  myLightA(ranH1, 100, 100);

  // Segmented video grid
  drawSegmentedVideoGrid();

  // Apply visual effects (blur, invert, grain)
  applyVisualEffects();
}

// ------------------- Helper Functions -------------------

// Potentiometer mapping for colors
function mapPotentiometerValues() {
  hue = map(rot1, 0, 23, 0, 360);
  Rval = map(pot1, 0, 100, 0, 255);
  Bval = map(pot2, 0, 100, 0, 255);
  Hval1 = map(pot1, 0, 100, 0, 360);
  Hval2 = map(pot2, 0, 100, 0, 360);
  ranH1 = random((Hval1 + 0) % 360, (Hval1 + 50) % 360);
  ranH2 = random((Hval2 + 0) % 360, (Hval2 + 50) % 360);
}

// Draw ball effect
function drawBalls() {
  for (let ball of bballs) {
    ball.draw();
  }
}

// Draw rain effect
function drawRainDrops() {
  for (let i = 0; i < drops.length; i++) {
    drops[i].show();
    drops[i].update();
  }
}

// Handle ripple effect
function drawRipples() {
  if (rippleA === 1 && frameCount % 10 === 0) {
    ripples.push(new Ripple(random(width), random(height), ranH1));
  }

  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].draw();
    if (ripples[i].isFinished()) ripples.splice(i, 1);
  }
}

// Initialize buffers for grid cells if not already done
function initializeBuffers(cols, rows) {
  let totalCells = cols * rows;
  if (buffers.length !== totalCells) {
    buffers = [];
    for (let i = 0; i < totalCells; i++) {
      buffers.push([]);
    }
  }
}
function manageBuffers(currentFrame) {
  let cols = Math.round(map(rot2, 0, 23, 1, 10));
  let rows = cols;
  initializeBuffers(cols, rows);

  // Create a new `p5.Image` to store the masked frame
  let maskedFrame = createImage(video.width, video.height);
  copyForegroundPixels(currentFrame, segmentation.mask, maskedFrame);

  // Add the masked frame to each buffer
  for (let i = 0; i < buffers.length; i++) {
    let delayAmount = (i + 1) * 2; // Per-cell delay factor
    buffers[i].push(maskedFrame.get()); // Store a copy of the masked frame
    if (buffers[i].length > delayAmount) {
      buffers[i].shift();
    }
  }
}

function drawDelayedGrid() {
  let cols = Math.round(map(rot2, 0, 23, 1, 10));
  let rows = cols;
  let cellWidth = width / cols;
  let cellHeight = height / rows;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;

      // Display the delayed masked frame from the buffer
      if (buffers[index].length > 0) {
        let frameToShow = buffers[index][0];
        image(
          frameToShow,
          x * cellWidth,
          y * cellHeight,
          cellWidth,
          cellHeight
        );
      }
    }
  }
}

// Draw the grid with live frames
function drawGrid(segmentedImage) {
  let cols = Math.round(map(rot2, 0, 23, 1, 10));
  let rows = cols;
  let cellWidth = width / cols;
  let cellHeight = height / rows;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let dx = x * cellWidth;
      let dy = y * cellHeight;

      image(segmentedImage, dx, dy, cellWidth, cellHeight);
    }
  }
}

// Process the segmentation results
function gotResults(result) {
  segmentation = result;
}

// Segmented video grid rendering
function drawSegmentedVideoGrid() {
  if (segmentation) {
    copyForegroundPixels(video, segmentation.mask, personImage);
    if (delay === 1) {
      manageBuffers(personImage);
      drawDelayedGrid();
    } else {
      buffers = []; // Clear buffers when delay is off
      drawGrid(personImage);
    }
  }
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
      resultPixels[i] = imgPixels[i]; // Red channel unchanged
      resultPixels[i + 1] = Rval; // Green channel modified by potentiometer
      resultPixels[i + 2] = Bval; // Blue channel modified by potentiometer
      resultPixels[i + 3] = 255; // Ensure the pixel is opaque
    }
  }

  imgResult.updatePixels();
}

// Apply visual effects
function applyVisualEffects() {
  if (blur > 0) filter(BLUR, blur);
  if (bgButton === 1) filter(INVERT);

  if (grainA !== prevA) {
    createFilmGrain(0, 0, windowWidth, windowHeight, 500, 3);
    prevA = grainA;
  }
  updateGrain();
  displayGrain();
}

// ------------------- Grain Effect -------------------

function updateGrain() {
  grain.update();
}

function displayGrain() {
  grain.display();
}

function createFilmGrain(x, y, w, h, patternSize, sampleSize) {
  grain = new FilmGrainEffect(
    x,
    y,
    w,
    h,
    patternSize,
    sampleSize,
    grainA * 0.1
  );
}

// ------------------- Ripple Class -------------------

class Ripple {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.size = 0;
    this.opacity = 255;
  }

  draw() {
    this.size += 10;
    this.opacity -= 5;
    noFill();
    strokeWeight(2);
    stroke(this.hue, 100, 100, this.opacity);
    circle(this.x, this.y, this.size);
    circle(this.x, this.y, this.size * 0.75);
    circle(this.x, this.y, this.size * 0.5);
  }

  isFinished() {
    return this.opacity <= 0;
  }
}

// Line animation coordinates
let xCoord1 = 0,
  yCoord1 = 0,
  xCoord2 = 0,
  yCoord2 = 0;
function myLightA(H, S, B) {
  if (lightA === 1) {
    // Only draw lightning when lightA is enabled
    for (let i = 0; i < 300; i++) {
      xCoord1 = xCoord2;
      yCoord1 = yCoord2;
      xCoord2 = xCoord1 + int(random(-20, 20));
      yCoord2 = yCoord1 + int(random(-10, 20));

      strokeWeight(random(3, 5));
      strokeJoin(MITER);
      stroke(H, S, B);
      line(xCoord1, yCoord1, xCoord2, yCoord2);

      if (
        xCoord2 > windowWidth ||
        xCoord2 < 0 ||
        yCoord2 > windowHeight ||
        yCoord2 < 0
      ) {
        xCoord2 = int(random(0, windowWidth));
        yCoord2 = 0;
      }
    }
  }
}

// ------------------- Interaction Functions -------------------

function keyPressed() {
  let fs = fullscreen();

  if (!fs && keyCode === 27) {
    fullscreen(true);
    resizeCanvas(displayWidth, displayHeight);
    createFilmGrain(0, 0, displayWidth, displayHeight, 500, 3);
  } else if (fs && keyCode === 27) {
    fullscreen(false);
    resizeCanvas(videoWidth, videoHeight);
    video.size(videoWidth, videoHeight);
    personImage.resize(videoWidth, videoHeight);
    createFilmGrain(0, 0, videoWidth, videoHeight, 500, 3);
  }

  // Toggle random ripples
  if (key === "a" || key === "A") {
    rippleA = 1 - rippleA;
  }

  // Toggle lights
  if (key === "z") lightA = 1 - lightA;

  // Toggle delay
  if (key === "d") delay = 1 - delay;

  // Toggle laser effect
  if (key === "l" || key === "L") laser = 1 - laser;

  // Toggle rain effect
  if (key === "r" || key === "R") rain = 1 - rain;

  // Toggle ball effect
  if (key === "b" || key === "B") ballsEffect = 1 - ballsEffect;
}

// ------------------- Laser Initialization -------------------

function initializeLines() {
  // Initialize or update laser line positions
  leftLine = {
    x1: 0,
    y1: yLength,
    x2: xLength,
    y2: 0,
    offset: 0, // Movement offset
  };

  rightLine = {
    x1: xLength,
    y1: yLength,
    x2: 0,
    y2: 0,
    offset: 0, // Movement offset
  };
}

// ------------------- Laser Motion Update -------------------

function updateLaserMotion() {
  let maxOffset = width / 4; // Maximum oscillation range

  // Use sine wave for smooth oscillation
  leftLine.offset = sin(frameCount * 0.02) * maxOffset;
  rightLine.offset = cos(frameCount * 0.02) * maxOffset;

  // Update positions based on offset
  leftLine.x1 = leftLine.offset;
  leftLine.x2 = xLength - leftLine.offset;

  rightLine.x1 = xLength - rightLine.offset;
  rightLine.x2 = rightLine.offset;
}

// ------------------- Laser Value Animation -------------------

function animateValues() {
  // Change distValue to create "opening" and "closing" effect
  distValue += distDirection * 0.05;
  if (distValue > 10 || distValue < 2) {
    distDirection *= -1; // Reverse direction
  }

  // Change lineValue to expand or shrink the number of lines
  lineValue += lineDirection * 0.1;
  if (lineValue > 30 || lineValue < 5) {
    lineDirection *= -1; // Reverse direction
  }
}

// ------------------- Laser Drawing -------------------

function drawLasersWithAnimation() {
  // Animate laser lines and values
  updateLaserMotion();
  animateValues();

  // Draw all four laser patterns
  drawLasers();
}

function drawLasers() {
  vertLine1();
  vertLine2();
  vertLine3();
  vertLine4();
}

// Laser patterns

function vertLine1() {
  strokeWeight(1);
  stroke(ranH1, 100, 100);
  let x2 = leftLine.x2;
  line(leftLine.x1, leftLine.y1, leftLine.x2, leftLine.y2);
  for (let i = 0; i < lineValue; i++) {
    line(leftLine.x1, leftLine.y1, x2, leftLine.y2);
    let shiftX = -distValue;
    x2 += shiftX;
  }
}

function vertLine2() {
  strokeWeight(1);
  stroke(ranH1, 100, 100);
  let x2 = rightLine.x2;
  line(rightLine.x1, rightLine.y1, rightLine.x2, rightLine.y2);
  for (let i = 0; i < lineValue; i++) {
    line(rightLine.x1, rightLine.y1, x2, rightLine.y2);
    let shiftX = distValue;
    x2 += shiftX;
  }
}

function vertLine3() {
  strokeWeight(1);
  stroke(ranH2, 100, 100);
  let x2 = leftLine.x2;
  line(leftLine.x1, leftLine.y2, leftLine.x2, leftLine.y1);
  for (let i = 0; i < lineValue; i++) {
    line(leftLine.x1, leftLine.y2, x2, leftLine.y1);
    let shiftX = -distValue;
    x2 += shiftX;
  }
}

function vertLine4() {
  strokeWeight(1);
  stroke(ranH2, 100, 100);
  let x2 = rightLine.x2;
  line(rightLine.x1, rightLine.y2, rightLine.x2, rightLine.y1);
  for (let i = 0; i < lineValue; i++) {
    line(rightLine.x1, rightLine.y2, x2, rightLine.y1);
    let shiftX = distValue;
    x2 += shiftX;
  }
}

// ------------------- Rain Drops Initialization -------------------

function initializeDrops() {
  drops = [];
  let numDrops = floor((width * height) / 4000); // Adjust drop count based on canvas area
  for (let i = 0; i < numDrops; i++) {
    drops.push(new Drop());
  }
}

// ------------------- Drop Class -------------------

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
    this.speed = 20;
    this.gravity = 1.05;
    this.y += this.speed * this.gravity;

    if (this.y > height) {
      this.y = random(0, -height);
      this.gravity = 0;
    }
  };
}
// ------------------- Ball Initialization -------------------

function initializeBalls() {
  bballs = [];
  let numBalls = 700; // Total number of balls
  for (let i = 0; i < numBalls; i++) {
    bballs.push(
      new Ball(
        random(0, windowWidth),
        random(0, windowHeight),
        random(10, 30),
        random(0.5, 2),
        random(windowHeight / 2, windowHeight)
      )
    );
  }
}

// ------------------- Ball Class -------------------

class Ball {
  constructor(xpos, ypos, w, dy, limit) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.w = w;
    this.dy = dy;
    this.limit = windowHeight; // Expand limit to cover entire window
    this.colorOffset = random(240, 350); // Random offset for hue
  }

  getColor() {
    return (Hval1 + this.colorOffset) % 360;
  }

  draw() {
    this.move();
    noStroke();
    fill(this.getColor(), 100, 50, 80);
    circle(this.xpos, this.ypos, this.w);
  }

  move() {
    if (this.ypos + this.w / 2 >= this.limit || this.ypos - this.w / 2 <= 0) {
      this.dy = -this.dy; // Reverse direction at edges
    }
    this.ypos += this.dy;
  }
}
// ------------------- WebSerial Setup -------------------

function setupWebSerial() {
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  }

  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);

  serial.getPorts();
  serial.on("noport", makePortButton);
  serial.on("portavailable", openPort);
  serial.on("requesterror", portError);
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);
}

// ------------------- Port Button Functions -------------------

function makePortButton() {
  portButton = createButton("choose port");
  portButton.position(10, 10);
  portButton.mousePressed(choosePort);
}

function choosePort() {
  if (portButton) portButton.show();
  serial.requestPort();
}

function openPort() {
  serial.open().then(() => {
    console.log("port open");
    if (portButton) portButton.hide();
  });
}

// ------------------- Serial Event Functions -------------------

function serialEvent() {
  let inString = serial.readStringUntil("\r\n");
  if (inString != null) {
    let list = split(trim(inString), ",");
    if (list.length > 15) {
      rot1 = float(list[0]);
      bgButton = float(list[1]);
      sat1 = float(list[2]);
      br1 = float(list[3]);
      rot2 = float(list[4]);
      pot1 = float(list[5]);
      pot2 = float(list[6]);
      FR = float(list[7]);
      blur = float(list[8]);
      grainA = float(list[9]);
      rippleA = float(list[10]);
      lightA = float(list[11]);
      delay = float(list[12]);
      rain = float(list[13]);
      laser = float(list[14]);
      ballsEffect = float(list[15]);
      serial.write("x");
    }
  }
}

function portConnect() {
  console.log("port connected");
  serial.getPorts();
}

function portDisconnect() {
  serial.close();
  console.log("port disconnected");
}

function portError(err) {
  alert("Serial port error: " + err);
}
