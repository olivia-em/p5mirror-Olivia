// ------------------- Variables -------------------

// Sound and FFT analysis
let song;
let fft;

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
let alpha = 0.0; // Transparency (0 to 1)

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

// ------------------- Preload Function -------------------
function preload() {
  // Load the sound file
  song = loadSound("beach.mp3");
}

// ------------------- Setup Function -------------------
function setup() {
  // Create canvas and initialize color mode
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);

  // Create film grain effect and start the song
  createFilmGrain(0, 0, windowWidth, windowHeight, 500, 3);
  song.loop();

  // Initialize FFT for waveform analysis
  fft = new p5.FFT();
  fft.setInput(song);

  // Set waveform width to match canvas width
  wavefWidth = windowWidth;
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
  updateGrain();
  displayGrain();
}

// ------------------- Mouse Interaction -------------------

// Toggle fullscreen on mouse press
function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    fullscreen(!fullscreen());
  }
}

// ------------------- Resize Handling -------------------
function windowResized() {
  // Resize canvas and recreate film grain
  resizeCanvas(windowWidth, windowHeight);
  createFilmGrain(0, 0, windowWidth, windowHeight, 500, 3);

  // Reinitialize FFT
  fft = new p5.FFT();
  fft.setInput(song);

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

// Update the grain effect
function updateGrain() {
  grain.update();
}

// Display the grain effect
function displayGrain() {
  grain.display();
}

// Create a film grain effect
function createFilmGrain(x, y, w, h, patternSize, sampleSize) {
  grain = new FilmGrainEffect(x, y, w, h, patternSize, sampleSize, alpha);
}

// ------------------- Key Interaction -------------------

// Key handling for song control
function keyPressed() {
  // Toggle song play/pause with space
  if (key === " " && song.isPlaying()) song.pause();
  else if (key === " ") song.loop();
  // Restart song with left arrow
  else if (keyCode === LEFT_ARROW) {
    song.stop();
    song.loop();
  }
}
