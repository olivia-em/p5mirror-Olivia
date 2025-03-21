// ------------------- Variables -------------------

// Sound and FFT analysis
let song;
let fft;
let mic;

// Waveform visualization
let pointSize = 2;
let wavefX = 0;
let wavefWidth;

// Frame rate and visual effects
let FR = 10; // Frame rate (10 to 60)
let blur = 0;
let BGbutton = 0; // Background inversion toggle

// Grain and transparency
let grain;
let grainA = 0; // Transparency (0-10)
let prevA;

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

// variable to hold an instance of the p5.webserial library:
const serial = new p5.WebSerial();

// HTML button object:
let portButton;
let inData = []; // for incoming serial data
let inString = [];
let outByte = 0; // for outgoing data

// ------------------- Preload Function -------------------
// function preload() {
//   // Load the sound file
//   song = loadSound("beach.mp3");
// }

// ------------------- Setup Function -------------------
function setup() {
  // Create canvas and initialize color mode
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);

  // Create film grain effect and start the song
  createFilmGrain(0, 0, windowWidth, windowHeight, 500, 3);
  // song.loop();

  // Initialize FFT for waveform analysis
  initializeMic()

  // Set waveform width to match canvas width
  wavefWidth = windowWidth;
  
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
  // Set frame rate and draw the background
  frameRate(FR);
  hue1 = map(rot1, 0, 23, 0, 360);
  hue2 = map(rot2, 0, 23, 0, 360);
  background(hue1, sat1, br1, 40); // Transparent background with alpha

  // Generate hue variants for visual effects
  hue2A = (hue2 + 240) % 360;
  hue2B = (hue2 + 290) % 360;
  hue2C = (hue2 + 330) % 360;

  // Draw waveform and points
  myWave(hue2B, sat2, br2);
  wavePoints(hue2A, hue2C, sat2, br2);

  // Apply visual effects if enabled
  if (blur > 0) filter(BLUR, blur);
  if (BGbutton === 1) filter(INVERT);

  // Display grain effect
  // console.log(grainA);
  if (grainA != prevA) {
    createFilmGrain(0, 0, windowWidth, windowHeight, 500, 3); // Initial grain creation
    prevA = grainA;
  }
  updateGrain();
  displayGrain();
}

// ------------------- Initialize Mic -------------------

function initializeMic() {
     // Start FFT analysis
  fft = new p5.FFT();
  mic = new p5.AudioIn();
  mic.start();
  fft.setInput(mic);
}


// ------------------- Resize Handling -------------------
function windowResized() {
  // Resize canvas and recreate film grain
  resizeCanvas(windowWidth, windowHeight);
  createFilmGrain(0, 0, windowWidth, windowHeight, 500, 3);

  initializeMic();

  // Update waveform width
  wavefWidth = windowWidth;
}

// ------------------- Waveform Functions -------------------

// Draw waveform points with color variations
function wavePoints(H1, H2, S, B) {
  let waveArray = fft.waveform();

  for (let i = 0; i < wavefWidth; i++) {
    // Map pixel positions to waveform data
    let waveIndex = floor(map(i, 0, wavefWidth, 0, waveArray.length));

    // Calculate point coordinates
    let x = i;
    let y = waveArray[waveIndex] * 200 + windowHeight / 2;

    // Draw points with alternating colors
    noStroke();
    pointSize = random(2, 4);
    fill(H1, S, B);
    rect(x, y - 100, pointSize);
    fill(H2, S, B);
    rect(x, y + 100, pointSize);
  }
}

// Draw the waveform as a line
function myWave(H, S, B) {
  let myWaveform = fft.waveform();

  // Set up the line style
  noFill();
  stroke(H, S, B);
  strokeWeight(2);

  // Draw the waveform
  beginShape();
  for (let w = 0; w < myWaveform.length; w++) {
    let wh = myWaveform[w] / 2; // Normalize waveform values
    let y = map(wh, -1, 1, 0, windowHeight); // Map to canvas height
    let x = map(w, 0, myWaveform.length, 0, windowWidth); // Map to canvas width
    vertex(x, y);
  }
  endShape();
}

// ------------------- Grain Effect Functions -------------------

// Update the grain buffer when alpha changes
function updateGrain() {
  grain.update();
}

// Display the grain buffer on the canvas
function displayGrain() {
  grain.display();
}

// Create a film grain effect
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

// ------------------- Key Interaction -------------------

// Key handling for song control
function keyPressed() {
  // Toggle song play/pause with space
  // if (key === " " && song.isPlaying()) song.pause();
  // else if (key === " ") song.loop();
  // // Restart song with left arrow
  // else if (keyCode === LEFT_ARROW) {
  //   song.stop();
  //   song.loop();
  // } else 
    if (keyCode === 27) {
    fullscreen(!fullscreen());
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
      // convert list items to floats:
      rot1 = float(list[0]);
      BGbutton = float(list[1]);
      sat1 = float(list[2]);
      br1 = float(list[3]);
      rot2 = float(list[4]);
      sat2 = float(list[5]);
      br2 = float(list[6]);
      FR = float(list[7]);
      blur = float(list[8]);
      grainA = float(list[9]);
      // rippleA = float(list[10]);
      // rippleB = float(list[11]);
      // rippleC = float(list[12]);
      // lightA = float(list[13]);
      // lightB = float(list[14]);
      // lightC = float(list[15]);

      // console.log(
      //   rot1 +
      //     "," +
      //     BGbutton +
      //     "," +
      //     sat1 +
      //     "," +
      //     br1 +
      //     "," +
      //     rot2 +
      //     "," +
      //     sat2 +
      //     "," +
      //     br2 +
      //     "," +
      //     FR +
      //     "," +
      //     blur +
      //     "," +
      //     grainA +
      //     "," +
      //     rippleA +
      //     "," +
      //     rippleB +
      //     "," +
      //     rippleC +
      //     "," +
      //     lightA +
      //     "," +
      //     lightB +
      //     "," +
      //     lightC
      // );
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

