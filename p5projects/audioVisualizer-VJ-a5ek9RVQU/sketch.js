// reference materials:

// https://editor.p5js.org/jesse_harding/sketches/0szF7gcAx
// https://p5js.org/reference/p5/lerpColor/
// https://editor.p5js.org/evebdn/sketches/O9G35ueZv
// https://editor.p5js.org/luisa_NYU/sketches/jnextrr-a
// https://tonejs.github.io/docs/15.0.4/classes/Player.html

let mic, analyzer;
let stars = [];
let numStars = 400;
let beatActive = false;
let darkActive = false;
let pluckActive = false;
let breezeActive = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  makeStars();

  // Set up microphone input
  mic = new Tone.UserMedia();
  analyzer = new Tone.Waveform(4096);
  mic.connect(analyzer);
}

function draw() {
  background(0);

  if (darkActive) {
    let waveform = analyzer.getValue(); // Get waveform data

    // Calculate average intensity
    let avgAmp =
      waveform.reduce((sum, val) => sum + abs(val), 0) / waveform.length;

    // Map intensity to alpha (more sound = more visible color)
    let alpha = map(avgAmp, 0, 1, 50, 255);

    let c1 = color(255, 5, 30, alpha); // Apply dynamic alpha
    let c2 = color(0, 0, 0, alpha);

    for (let y = 0; y < height; y++) {
      let n = map(y, 0, height, 0, 1);
      let bg = lerpColor(c1, c2, n);
      stroke(bg);
      line(0, y, width, y);
    }
  }

  showStars();

  // Waveform visualization when "1" is pressed
  if (beatActive) {
    let waveform = analyzer.getValue();
    stroke(0);
    strokeWeight(2);
    beginShape();
    vertex(0, height / 2);
    for (let i = 0; i < waveform.length; i++) {
      let alpha = map(abs(waveform[i]), 0, 1, 100, 255); // Higher intensity = more visible
      fill(0, 0, 255, alpha);
      let x = map(i, 0, waveform.length, 0, width);
      let y = map(waveform[i], -1, 1, height * 0.6, height); // More contrast in peaks
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape();
  }
}

function keyTyped() {
  if (key === "1") {
    beatActive = !beatActive;
    if (beatActive) {
      mic.open();
    } else {
      mic.close();
    }
  }
  if (key === "2") darkActive = !darkActive;
  if (key === "3") pluckActive = !pluckActive;
  if (key === "4") {
    breezeActive = !breezeActive;
    if (breezeActive) makeStars(); // Refresh stars on activation
  }
}

function makeStars() {
  for (let i = 0; i < numStars; i++) {
    stars[i] = createVector(random(width), random(height), random(1, 6));
  }
}

function showStars() {
  for (let i = 0; i < numStars; i++) {
    if (breezeActive) {
      stars[i].x += stars[i].z * 0.5;
      if (stars[i].x > width) {
        stars[i].x = 0;
        stars[i].y = random(height);
      }
    }

    if (pluckActive) {
      let c3 = color("#3D27DE");
      let c4 = color(200);
      let randC = lerpColor(c3, c4, random(0, 1));
      stroke(0);
      strokeWeight(1);
      fill(randC);
    } else {
      stroke(0);
      strokeWeight(1);
      fill("#3D27DE");
    }
    ellipse(stars[i].x, stars[i].y, stars[i].z, stars[i].z);
  }
}
