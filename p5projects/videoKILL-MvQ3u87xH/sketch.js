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
let rot2 = 11; // Rotary value to video grid mapping

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
const options = { maskType: "parts" };

// Fixed dimensions for video and canvas
const videoWidth = 600;
const videoHeight = 400;

// Rain and Ball Effects
let drop = [];
let bballs = [];
let ballsEffect = 0; // Toggle for ball effect

// Laser settings
let laser = 0; // Toggle laser effect
let xLength, yLength;
let leftLine = { x1: 0, y1: 0, x2: 0, y2: 0, offset: 0 };
let rightLine = { x1: 0, y1: 0, x2: 0, y2: 0, offset: 0 };
let distValue = 10; // Laser line spacing
let lineValue = 75; // Number of laser lines
let distDirection = 1; // Controls "opening" or "closing"
let lineDirection = 1; // Expanding or shrinking the number of lines

// Serial communication variables
const serial = new p5.WebSerial();
let portButton;
let inData = [];
let inString = [];
let outByte = 0; // Outgoing data

// ------------------- Preload -------------------

function preload() {
  // Load the body segmentation model
  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
}

// ------------------- Setup -------------------

function setup() {
  createCanvas(videoWidth, videoHeight);
  colorMode(HSB, 360, 100, 100, 100);

  // Initialize effects
  xLength = windowWidth;
  yLength = windowHeight;
  initializeLines();
  initializeDrops();
  initializeBalls();

  // Create video capture
  video = createCapture(VIDEO);
  video.size(videoWidth, videoHeight);
  video.hide();

  // Start body segmentation
  bodySegmentation.detectStart(video, gotResults);

  // Create an image for segmented output
  personImage = createImage(video.width, video.height);

  // Initialize film grain effect
  createFilmGrain(0, 0, videoWidth, videoHeight, 500, 3);

  // Set up serial communication
  setupSerial();
}

// ------------------- Draw -------------------

function draw() {
  background(rot1, sat1, br1);
  frameRate(FR);

  // Map potentiometer values to colors
  Rval = map(pot1, 0, 100, 0, 255);
  Bval = map(pot2, 0, 100, 0, 255);
  Hval1 = map(pot1, 0, 100, 0, 360);
  Hval2 = map(pot2, 0, 100, 0, 360);
  let ranH1 = random((Hval1 + 0) % 360, (Hval1 + 50) % 360);
  let ranH2 = random((Hval2 + 0) % 360, (Hval2 + 50) % 360);

  // Ball effect
  if (ballsEffect === 1) {
    for (let ball of bballs) ball.draw();
  }

  // Laser effect
  if (laser === 1) {
    updateLaserMotion();
    animateValues();
    drawLasers();
  }

  // Rain effect
  if (rain === 1) {
    for (let drop of drops) {
      drop.show();
      drop.update();
    }
  }

  // Light and ripple effects
  myLightA(ranH1, 100, 100);
  myRipple1(ranH2, 100, 100);

  // Segmented video grid
  if (segmentation) {
    copyForegroundPixels(video, segmentation.mask, personImage);
    delay === 1 ? drawDelayedGrid() : drawGrid(personImage);
  }

  // Visual filters
  if (blur > 0) filter(BLUR, blur);
  if (bgButton === 1) filter(INVERT);

  // Film grain effect
  if (grainA != prevA) {
    createFilmGrain(0, 0, windowWidth, windowHeight, 500, 3);
    prevA = grainA;
  }
  updateGrain();
  displayGrain();
}

// ------------------- Effects Initialization -------------------

function initializeBalls() {
  bballs = [];
  for (let i = 0; i < 700; i++) {
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

function initializeDrops() {
  drops = [];
  let numDrops = floor((width * height) / 4000);
  for (let i = 0; i < numDrops; i++) drops.push(new Drop());
}

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

// ------------------- Classes -------------------

class Ball {
  constructor(xpos, ypos, w, dy, limit) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.w = w;
    this.dy = dy;
    this.limit = windowHeight;
    this.colorOffset = random(240, 350);
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
    if (this.ypos + this.w / 2 >= this.limit || this.ypos - this.w / 2 <= 0)
      this.dy = -this.dy;
    this.ypos += this.dy;
  }
}

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

// ------------------- Utility Functions -------------------

function windowResized() {
  xLength = windowWidth;
  yLength = windowHeight;
  resizeCanvas(xLength, yLength);
  initializeLines();
  initializeDrops();
  initializeBalls();
}

// Key and interaction logic
function keyPressed() {
  if (key === "b" || key === "B") ballsEffect = 1 - ballsEffect;
  if (key === "r" || key === "R") rain = 1 - rain;
  if (key === "l" || key === "L") laser = 1 - laser;
  if (keyCode === 27) fullscreen(!fullscreen());
}

// Serial Communication Setup
function setupSerial() {
  if (!navigator.serial)
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
  serial.getPorts();
  serial.on("noport", makePortButton);
  serial.on("portavailable", openPort);
  serial.on("requesterror", portError);
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);
}

// Serial Communication Handlers
function portConnect() {
  serial.getPorts();
}
function portDisconnect() {
  serial.close();
}
function makePortButton() {
  portButton = createButton("choose port");
  portButton.position(10, 10);
  portButton.mousePressed(() => serial.requestPort());
}
function openPort() {
  serial.open().then(() => console.log("port open"));
}
function portError(err) {
  console.error("Serial port error:", err);
}
function serialEvent() {
  let inString = serial.readStringUntil("\r\n");
  if (inString != null) {
    let list = split(trim(inString), ",");
    if (list.length > 15) {
      // Parsing logic remains unchanged
    }
  }
}
