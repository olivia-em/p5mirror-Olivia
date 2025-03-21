let song;
let fft;
let pointSize = 2;
let wavefX = 0;
let wavefWidth;

// Frame rate and visual effects
let FR = 10; // Frame rate (10 to 60)
let blur = 0;
let BGbutton = 0;

// Grain and transparency
let grain;
let alpha = 0.0; // Transparency (0 to 1)

// Background colors (HSB mode)
let hue1 = 0,
  sat1 = 0,
  br1 = 0; // Hue, Saturation, Brightness

// Effect colors (HSB mode)
let hue2 = 0,
  sat2 = 100,
  br2 = 100; // Hue, Saturation, Brightness
let hue2A, hue2B, hue2C; // Variants of hue2 for effects

function preload() {
  song = loadSound("beach.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  createFilmGrain(0, 0, windowWidth, windowHeight, 500, 3);
  song.loop();

  fft = new p5.FFT();

  fft.setInput(song);
  wavefWidth = windowWidth;
}

function mousePressed() {
  if (sun.isPlaying()) {
    song.pause();
  } else {
    song.loop();
  }
}

function draw() {
  frameRate(FR);
  background(hue1, sat1, br1, 50);
  // Generate hue variants for effects
  hue2A = (hue2 + 240) % 360;
  hue2B = (hue2 + 290) % 360;
  hue2C = (hue2 + 330) % 360;

  myWave(hue2B, sat2, br2);
  wavePoints(hue2A, hue2C, sat2, br2);

  if (blur > 0) {
    filter(BLUR, blur);
  }

  if (BGbutton === 1) filter(INVERT);

  // Display grain effect
  updateGrain();
  displayGrain();
}

// resize canvas & full screen

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createFilmGrain(0, 0, windowWidth, windowHeight, 500, 3);

  fft = new p5.FFT();

  fft.setInput(song);
  wavefWidth = windowWidth;
}

function wavePoints(H1, H2, S, B) {
  let waveArray = fft.waveform();

  for (let i = 0; i < wavefWidth; i++) {
    let waveIndex = floor(map(i, 0, wavefWidth, 0, waveArray.length));

    x = i;
    y = waveArray[waveIndex] * 200 + windowHeight / 2;

    noStroke();
    pointSize = random(2, 4);
    fill(H1, S, B);
    rect(x, y - 100, pointSize);
    fill(H2, S, B);
    rect(x, y + 100, pointSize);
  }
}

function myWave(H, S, B) {
  let myWaveform = fft.waveform();
  noFill();
  stroke(H, S, B);
  strokeWeight(2);
  beginShape();
  for (let w = 0; w < myWaveform.length; w++) {
    let wh = myWaveform[w] / 2;
    let y = map(wh, -1, 1, 0, windowHeight);
    let x = map(w, 0, myWaveform.length, 0, windowWidth);
    vertex(x, y);
  }
  endShape();
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
  grain = new FilmGrainEffect(x, y, w, h, patternSize, sampleSize, alpha);
}

function keyPressed() {
  // Toggle song play/pause with space
  if (key === " " && song.isPlaying()) song.pause();
  else if (key === " ") song.loop();
  // Reset song with left arrow
  else if (keyCode === LEFT_ARROW) {
    song.stop();
    song.loop();
  }
}
