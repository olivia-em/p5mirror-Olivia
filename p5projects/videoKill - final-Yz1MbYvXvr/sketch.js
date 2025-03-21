// ------------------- Global Variables -------------------

// Frame rate and visual effects
let FR = 60; // Frame rate (10 to 60)
let blur = 0;
let bgButton = 0; // Inversion toggle
let rain = 0; // Rain state variable

// Grain and transparency
let grain;
let grainA = 0; // Transparency (0 to 1)
let prevA;

// Body segmentation variables
let bodySegmentation;
let video;
let segmentation;
let personImage;

// Grid settings
let gridSize; // Number of rows and columns in the grid (1 to 10)
// rotary to video #
let rot2 = 11;
// Delay variables
let delay = 0; // Delay toggle (0 = off, 1 = on)
let buffers = []; // Array to hold per-cell frame buffers
let maxDelay = 20; // Maximum delay multiplier for buffer size

// Color variables for interactive controls
let pot1 = 0;
let pot2 = 0;
let Rval = 0,
  Bval = 0,
  Hval1 = 0,
  Hval2 = 0;

// Background colors (HSB mode)
let rot1 = 0,
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
// Ball and ripple properties
let bballs = [];
let ballsEffect = 0; // Toggle for ball effect

// variable to hold an instance of the p5.webserial library:
const serial = new p5.WebSerial();

// HTML button object:
let portButton;
let inData = []; // for incoming serial data
let inString = [];
let outByte = 0; // for outgoing data

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

  xLength = windowWidth;
  yLength = windowHeight;

  // Initialize drops, lasers, balls
  initializeLines();

  initializeDrops();

  initializeBalls();

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

  // check to see if serial is available:
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  }
  // if serial is available, add connect/disconnect listeners:
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
  // check for any ports that are available:
  serial.getPorts();
  // if there's no port chosen, choose one:
  serial.on("noport", makePortButton);
  // open whatever port is available:
  serial.on("portavailable", openPort);
  // handle serial errors:
  serial.on("requesterror", portError);
  // handle any incoming serial data:
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);
}

// ------------------- Draw -------------------

function draw() {
  // Background
  background(rot1, sat1, br1);

  // Map potentiometer values to colors
  Rval = map(pot1, 0, 100, 0, 255);
  Bval = map(pot2, 0, 100, 0, 255);
  Hval1 = map(pot1, 0, 100, 0, 360);
  Hval2 = map(pot2, 0, 100, 0, 360);
  ranH1 = random((Hval1 + 0) % 360, (Hval1 + 50) % 360);
  ranH2 = random((Hval2 + 0) % 360, (Hval2 + 50) % 360);

  // Set the frame rate
  frameRate(FR);

  // Draw the ball effect if enabled
  if (ballsEffect === 1) {
    for (let ball of bballs) {
      ball.draw();
    }
  }

  // If laser is toggled on, animate and draw the lasers
  if (laser === 1) {
    updateLaserMotion();
    animateValues();
    drawLasers();
  }

  // Handle rain effect
  if (rain === 1) {
    for (let i = 0; i < drops.length; i++) {
      drops[i].show();
      drops[i].update();
    }
  }

  myLightA(ranH1, 100, 100);

  // Handle ripple generation when rippleA is 1
  if (rippleA === 1) {
    if (frameCount % 10 === 0) {
      // Add a ripple every 10 frames
      ripples.push(new Ripple(random(width), random(height), ranH1));
    }
  }

  // Draw all active ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].draw();
    if (ripples[i].isFinished()) {
      ripples.splice(i, 1); // Remove finished ripples
    }
  }

  // Display the segmented video grid
  if (segmentation) {
    copyForegroundPixels(video, segmentation.mask, personImage);

    // If delay is active, process and draw the grid with delay
    if (delay === 1) {
      manageBuffers(personImage);
      drawDelayedGrid();
    } else {
      // Draw live video grid without delay
      buffers = []; // Clear all buffers if delay is off
      drawGrid(personImage);
    }
  }

  // Apply visual effects
  if (blur > 0) filter(BLUR, blur);
  if (bgButton === 1) filter(INVERT);

  // Display grain effect
  // console.log(grainA);
  if (grainA != prevA) {
    createFilmGrain(0, 0, windowWidth, windowHeight, 500, 3); // Initial grain creation
    prevA = grainA;
  }
  updateGrain();
  displayGrain();
}

let lightA = 0;
let rippleA = 0;
let randomRipplesActive = false;
let ripples = []; // Array to hold active ripples

let X1 = 0,
  Y1 = 0;
let circleSize1 = 0;
let opacity1 = 255;

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

// ------------------- Utility Functions -------------------

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
    randomRipplesActive = !randomRipplesActive;
  }

  // Toggle lights
  if (key === "z") lightA = 1 - lightA;

  if (key === "d") {
    delay = 1 - delay; // Toggle delay
  }

  if (key === "l" || key === "L") {
    laser = 1 - laser; // Toggle laser state between 1 and 0
  }

  if (key === "r" || key === "R") {
    rain = 1 - rain; // Toggle rain state between 1 and 0
  }

  if (key === "b" || key === "B") {
    ballsEffect = 1 - ballsEffect; // Toggle ball effect
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
// ------------------- Rain Drops -------------------

// Initialize or reinitialize the raindrops
function initializeDrops() {
  drops = [];
  let numDrops = floor((width * height) / 4000); // Adjust drop count based on canvas area
  for (let i = 0; i < numDrops; i++) {
    drops.push(new Drop());
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
    this.speed = 20;
    this.gravity = 1.05;
    this.y += this.speed * this.gravity;

    if (this.y > height) {
      this.y = random(0, -height);
      this.gravity = 0;
    }
  };
}

let xLength, yLength;

// Laser line objects
let leftLine = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  offset: 0, // movement offset
};

let rightLine = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  offset: 0, // movement offset
};

// Variables for automatic animation
let distValue = 10;
let lineValue = 75;
let distDirection = 1; // Controls "opening" or "closing"
let lineDirection = 1; // Expanding or shrinking the number of lines

// Toggle state for lasers
let laser = 0; // Set to 1 to enable lasers, 0 to disable

// Handle resizing the window dynamically
function windowResized() {
  xLength = windowWidth;
  yLength = windowHeight;
  resizeCanvas(xLength, yLength);
  initializeLines();
  initializeDrops();
  initializeBalls();
}

// Initialize or update laser line positions
function initializeLines() {
  leftLine.x1 = 0;
  leftLine.y1 = yLength;
  leftLine.x2 = xLength;
  leftLine.y2 = 0;

  rightLine.x1 = xLength;
  rightLine.y1 = yLength;
  rightLine.x2 = 0;
  rightLine.y2 = 0;
}

// Update the motion of the laser lines
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

// Animate the distValue (line spacing) and lineValue (number of lines)
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

// Draw all four laser patterns
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

// ------------------- Serial Stuff -------------------
// if there's no port selected,
// make a port select button appear:
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton("choose port");
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(choosePort);
}

// make the port selector window appear:
function choosePort() {
  if (portButton) portButton.show();
  serial.requestPort();
}

// open the selected port, and make the port
// button invisible:
function openPort() {
  // wait for the serial.open promise to return,
  // then call the initiateSerial function
  serial.open().then(initiateSerial);

  // once the port opens, let the user know:
  function initiateSerial() {
    console.log("port open");
  }
  // hide the port button once a port is chosen:
  if (portButton) portButton.hide();
}

// pop up an alert if there's a port error:
function portError(err) {
  alert("Serial port error: " + err);
}

// read any incoming data:
function serialEvent() {
  // read from port until new line:
  let inString = serial.readStringUntil("\r\n");
  if (inString != null) {
    let list = split(trim(inString), ",");
    if (list.length > 15) {
      // conver list items to floats:
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
      // send a byte to the microcontroller to get new data:
      serial.write("x");
    }
  }
}

// try to connect if a new serial port
// gets added (i.e. plugged in via USB):
function portConnect() {
  console.log("port connected");
  serial.getPorts();
}

// if a port is disconnected:
function portDisconnect() {
  serial.close();
  console.log("port disconnected");
}

function closePort() {
  serial.close();
}
