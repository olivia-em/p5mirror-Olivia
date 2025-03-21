// ------------------- Variables -------------------

// Sound and FFT analysis
let song;
let fft;
let amp, mappedAmp;

// Serial communication variables
let num;
let light = 0,
  lightA = 0,
  lightB = 0,
  lightC = 0;
let rippleA = 0,
  rippleB = 0,
  rippleC = 0;

// Frame rate and visual effects
let FR = 60; // Frame rate (10 to 60)
let blur = 3; // (0 to 10)
let BGbutton = 0;

// Grain and transparency
let grain;
let alpha = 0.0; // Transparency (0-10)

let rot1 = 0,
  rot2 = 0;

// Background colors (HSB mode)
let hue1 = 0,
  sat1 = 0,
  br1 = 0; // Hue, Saturation, Brightness

// Effect colors (HSB mode)
let hue2 = 0,
  sat2 = 100,
  br2 = 100; // Hue, Saturation, Brightness
let hue2A, hue2B, hue2C; // Variants of hue2 for effects

// Ball and ripple properties
let bballs = [];
let drop = [];
let X1 = 0,
  Y1 = 0,
  X2 = 0,
  Y2 = 0,
  X3 = 0,
  Y3 = 0;
let circleSize1 = 0,
  circleSize2 = 0,
  circleSize3 = 0;
let opacity1 = 255,
  opacity2 = 255,
  opacity3 = 255;

// Line animation coordinates
let xCoord1 = 0,
  yCoord1 = 0,
  xCoord2 = 0,
  yCoord2 = 0;

// ------------------- Preload Function -------------------
function preload() {
  song = loadSound("beach.mp3"); // Load the sound file
}

// variable to hold an instance of the p5.webserial library:
const serial = new p5.WebSerial();

// HTML button object:
let portButton;
let inData = []; // for incoming serial data
let inString = [];
let outByte = 0; // for outgoing data

function setup() {
  createCanvas(windowWidth, windowHeight);
  createFilmGrain(0, 0, windowWidth, windowHeight, 500, 3);

  // Initialize variables and modes
  xCoord2 = 0;
  yCoord2 = windowHeight / 2;
  colorMode(HSB, 360, 100, 100, 100);
  num = windowWidth * 5;

  // Start the song and FFT analysis
  song.loop();
  fft = new p5.FFT();
  fft.setInput(song);

  // Initialize drops and balls
  for (let i = 0; i < 200; i++) drop[i] = new Drop();
  for (let i = 0; i <= num; i++) {
    bballs.push(
      new Ball(
        i / 2,
        random(5, 25),
        random(20, 50),
        random(0.3, 0.5),
        random(100, 200)
      )
    );
  }
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

// ------------------- Draw Function -------------------
function draw() {
  fft.analyze();
  // Get amplitude energy from FFT
  amp = fft.getEnergy(10, 1050);

  // Map amp value to the range 0-100
  mappedAmp = map(amp, 0, 255, 0, 100);

  frameRate(FR);

  // Set the background color
  background(0);
  hue1 = map(rot1, 0, 23, 0, 360);
  hue2 = map(rot2, 0, 23, 0, 360);
  // Generate hue variants for effects
  hue2A = random((hue2 + 0) % 360, (hue2 + 50) % 360);
  hue2B = random((hue2 + 120) % 360, (hue2 + 190) % 360);
  hue2C = random((hue2 + 240) % 360, (hue2 + 350) % 360);

  // Draw light effects
  myLight(200, 100, 230);
  myLightA(hue2A, sat2, br2);
  myLightB(hue2B, sat2, br2);
  myLightC(hue2C, sat2, br2);

  // Update and show drops
  for (let i = 0; i < 200; i++) {
    drop[i].show();
    drop[i].update();
  }

  // Draw bouncing balls
  for (let i = 0; i < num; i++) bballs[i].draw();

  // Draw ripple effects
  myRipple1(hue2A, sat2, br2);
  myRipple2(hue2B, sat2, br2);
  myRipple3(hue2C, sat2, br2);

  // Apply post-processing effects
  filter(BLUR, blur);
  if (BGbutton === 1) filter(INVERT);

  // Display grain effect
  updateGrain();
  displayGrain();
}

// ------------------- Key Pressed Functions -------------------
function keyPressed() {
  // Toggle song play/pause with space
  if (key === " " && song.isPlaying()) song.pause();
  else if (key === " ") song.loop();
  // Reset song with left arrow
  else if (keyCode === LEFT_ARROW) {
    song.stop();
    song.loop();
  }

  // Trigger ripple effects
  else if (rippleA === 0 && key === "a") setRipple1();
  else if (rippleB === 0 && key === "s") setRipple2();
  else if (rippleC === 0 && key === "d") setRipple3();
  // Toggle lights
  else if (keyCode === ENTER && light === 0) light = 1;
  else if (key === "z" && lightA === 0) lightA = 1;
  else if (key === "x" && lightB === 0) lightB = 1;
  else if (key === "c" && lightC === 0) lightC = 1;
}

function keyReleased() {
  if (keyCode === ENTER && light === 1) light = 0;
  else if (key === "z" && lightA === 1) lightA = 0;
  else if (key === "x" && lightB === 1) lightB = 0;
  else if (key === "c" && lightC === 1) lightC = 0;
}

// ------------------- Mouse Interaction Functions -------------------
function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    fullscreen(!fullscreen());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createFilmGrain(0, 0, windowWidth, windowHeight, 100, 3);

  fft = new p5.FFT();
  fft.setInput(song);
  for (let i = 0; i < 200; i++) drop[i] = new Drop();
}

// ------------------- Utility Functions -------------------

function myLight(H, S, B) {
  for (var i = 0; i < 300; i++) {
    xCoord1 = xCoord2;
    yCoord1 = yCoord2;
    xCoord2 = xCoord1 + int(random(-20, 20));
    yCoord2 = yCoord1 + int(random(-10, 20));
    if (light === 1) {
      stroke(H, S, B);
    } else {
      noStroke();
    }
    strokeWeight(random(3, 5));
    strokeJoin(MITER);
    line(xCoord1, yCoord1, xCoord2, yCoord2);

    if (
      (xCoord2 > windowWidth) |
      (xCoord2 < 0) |
      (yCoord2 > windowHeight) |
      (yCoord2 < 0)
    ) {
      xCoord2 = int(random(0, windowWidth));
      yCoord2 = 0;
    }
  }
}
function myLightA(H, S, B) {
  for (var i = 0; i < 300; i++) {
    xCoord1 = xCoord2;
    yCoord1 = yCoord2;
    xCoord2 = xCoord1 + int(random(-20, 20));
    yCoord2 = yCoord1 + int(random(-10, 20));
    strokeWeight(random(3, 5));
    strokeJoin(MITER);
    line(xCoord1, yCoord1, xCoord2, yCoord2);

    if (
      (xCoord2 > windowWidth) |
      (xCoord2 < 0) |
      (yCoord2 > windowHeight) |
      (yCoord2 < 0)
    ) {
      if (lightA === 1) {
        strokeWeight(10);
        stroke(H, S, B);
      } else {
        noStroke();
      }
      xCoord2 = int(random(0, windowWidth));
      yCoord2 = 0;
    }
  }
}

function myLightB(H, S, B) {
  for (var i = 0; i < 300; i++) {
    xCoord1 = xCoord2;
    yCoord1 = yCoord2;
    xCoord2 = xCoord1 + int(random(-20, 20));
    yCoord2 = yCoord1 + int(random(-10, 20));
    strokeWeight(random(3, 5));
    strokeJoin(MITER);
    line(xCoord1, yCoord1, xCoord2, yCoord2);

    if (
      (xCoord2 > windowWidth) |
      (xCoord2 < 0) |
      (yCoord2 > windowHeight) |
      (yCoord2 < 0)
    ) {
      if (lightB === 1) {
        strokeWeight(10);
        stroke(H, S, B);
      } else {
        noStroke();
      }
      xCoord2 = int(random(0, windowWidth));
      yCoord2 = 0;
    }
  }
}

function myLightC(H, S, B) {
  for (var i = 0; i < 300; i++) {
    xCoord1 = xCoord2;
    yCoord1 = yCoord2;
    xCoord2 = xCoord1 + int(random(-20, 20));
    yCoord2 = yCoord1 + int(random(-10, 20));
    strokeWeight(random(3, 5));
    strokeJoin(MITER);
    line(xCoord1, yCoord1, xCoord2, yCoord2);

    if (
      (xCoord2 > windowWidth) |
      (xCoord2 < 0) |
      (yCoord2 > windowHeight) |
      (yCoord2 < 0)
    ) {
      if (lightC === 1) {
        strokeWeight(10);
        stroke(H, S, B);
      } else {
        noStroke();
      }
      xCoord2 = int(random(0, windowWidth));
      yCoord2 = 0;
    }
  }
}

// Set properties for Ripple1
function setRipple1() {
  X1 = random(0, windowWidth);
  Y1 = random(windowHeight / 5, windowHeight);
  circleSize1 = 0;
  opacity1 = 255;
}

// Set properties for Ripple2
function setRipple2() {
  X2 = random(0, windowWidth);
  Y2 = random(windowHeight / 5, windowHeight);
  circleSize2 = 0;
  opacity2 = 255;
}

// Set properties for Ripple3
function setRipple3() {
  X3 = random(0, windowWidth);
  Y3 = random(windowHeight / 5, windowHeight);
  circleSize3 = 0;
  opacity3 = 255;
}

function myRipple1(H, S, B) {
  circleSize1 += 10;
  opacity1 -= 3;
  noFill();
  strokeWeight(10);
  stroke(H, S, B, opacity1);
  circle(X1, Y1, circleSize1);
  circle(X1, Y1, circleSize1 * 0.75);
  circle(X1, Y1, circleSize1 * 0.5);
}

function myRipple2(H, S, B) {
  circleSize2 += 10;
  opacity2 -= 3;
  noFill();
  strokeWeight(10);
  stroke(H, S, B, opacity2);
  circle(X2, Y2, circleSize2);
  circle(X2, Y2, circleSize2 * 0.75);
  circle(X2, Y2, circleSize2 * 0.5);
}
function myRipple3(H, S, B) {
  circleSize3 += 10;
  opacity3 -= 3;
  noFill();
  strokeWeight(10);
  stroke(H, S, B, opacity3);
  circle(X3, Y3, circleSize3);
  circle(X3, Y3, circleSize3 * 0.75);
  circle(X3, Y3, circleSize3 * 0.5);
}

// Update and display the grain effect
function updateGrain() {
  grain.update();
}

function displayGrain() {
  grain.display();
}

// Create a film grain effect
function createFilmGrain(x, y, w, h, patternSize, sampleSize) {
  grain = new FilmGrainEffect(x, y, w, h, patternSize, sampleSize, alpha * 0.1);
}

// ------------------- Classes -------------------

// Drop class (animated falling shapes)
function Drop() {
  this.x = random(0, windowWidth);
  this.y = random(0, -windowHeight);

  this.show = function () {
    stroke(hue2B, sat2, 100);
    strokeWeight(0.5);
    fill(hue2B, sat2, 100);
    ellipse(this.x, this.y, random(5, 10), random(5, 10));
  };

  this.update = function () {
    this.speed = amp / 5;
    this.gravity = 1.05;
    this.y += this.speed * this.gravity;

    if (this.y > windowHeight) {
      this.y = random(0, -windowHeight);
      this.gravity = 0;
    }
  };
}

// Ball class (bouncing balls)
class Ball {
  constructor(xpos, ypos, w, dy, limit) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.w = w;
    this.dy = dy;
    this.color = random((hue2 + 240) % 360, (hue2 + 350) % 360);
    this.limit = limit;
  }

  draw() {
    this.move(this.dy);
    noStroke();
    fill(this.color, 100, mappedAmp, 10);
    circle(this.xpos, this.ypos, this.w);
  }

  move() {
    if (this.ypos + this.w / 2 >= this.limit || this.ypos - this.w / 2 <= -20) {
      this.dy = -this.dy;
    }
    this.ypos += this.dy;
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
      BGbutton = float(list[1]);
      sat1 = float(list[2]);
      br1 = float(list[3]);
      rot2 = float(list[4]);
      sat2 = float(list[5]);
      br2 = float(list[6]);
      FR = float(list[7]);
      blur = float(list[8]);
      alpha = float(list[9]);
      rippleA = float(list[10]);
      rippleB = float(list[11]);
      rippleC = float(list[12]);
      lightA = float(list[13]);
      lightB = float(list[14]);
      lightC = float(list[15]);

      console.log(
        rot1 +
          "," +
          BGbutton +
          "," +
          sat1 +
          "," +
          br1 +
          "," +
          rot2 +
          "," +
          sat2 +
          "," +
          br2 +
          "," +
          FR +
          "," +
          blur +
          "," +
          alpha +
          "," +
          rippleA +
          "," +
          rippleB +
          "," +
          rippleC +
          "," +
          lightA +
          "," +
          lightB +
          "," +
          lightC
      );
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
