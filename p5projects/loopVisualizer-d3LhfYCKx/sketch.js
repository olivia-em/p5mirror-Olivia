// reference materials:

// https://editor.p5js.org/jesse_harding/sketches/0szF7gcAx
// https://p5js.org/reference/p5/lerpColor/
// https://editor.p5js.org/evebdn/sketches/O9G35ueZv
// https://editor.p5js.org/luisa_NYU/sketches/jnextrr-a
// https://tonejs.github.io/docs/15.0.4/classes/Player.html

const beat = new SimplePlayer("beat.mp3").toDestination();
let analyzer = new Tone.Waveform(4096);
beat.connect(analyzer);
const dark = new SimplePlayer("dark.mp3").toDestination();
const pluck = new SimplePlayer("pluck.mp3").toDestination();
const breeze = new SimplePlayer("breeze.mp3").toDestination();
const comp = new SimplePlayer("comp.mp3").toDestination();

let stars = [];
let numStars = 400;

let c1, c2, c3, c4, moveX;

let loaded = false;

function setup() {
  createCanvas(600, 600);
  makeStars();
}

function draw() {
  if (loaded) {
    if (dark.state === "started") {
      c1 = color(0);
      c2 = color("#b50523");

      for (let y = 0; y < height; y++) {
        n = map(y, 0, height, 0, 1);
        bg = lerpColor(c1, c2, n);
        stroke(bg);
        line(0, y, width, y);
      }
    } else if (dark.state === "stopped") {
      background(0);
    } else {
      background(0);
    }

    showStars();

    let waveform = analyzer.getValue();

    fill("#3D27DE");
    stroke(0);
    strokeWeight(2);
    beginShape();
    vertex(0, height / 2);
    for (let i = 0; i < waveform.length; i++) {
      let x = map(i, 0, waveform.length, 0, width + 10);
      let y = map(waveform[i], -1, 1, height * 2, 0);
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape();
  } else {
    background(0);
    fill(255);
    text("loading...", 20, 20);
  }
}

function keyTyped() {
  if (loaded) {
    if (key === "1" && beat.state === "stopped") {
      beat.start();
      // beat.loop = true;
    } else if (key === "1" && beat.state === "started") {
      beat.stop();
    } else if (key === "2" && dark.state === "stopped") {
      dark.start();
      // dark.loop = true;
    } else if (key === "2" && dark.state === "started") {
      dark.stop();
    } else if (key === "3" && pluck.state === "stopped") {
      pluck.start();
      // pluck.loop = true;
    } else if (key === "3" && pluck.state === "started") {
      pluck.stop();
    } else if (key === "4" && breeze.state === "stopped") {
      breeze.start();
      // breeze.loop = true;
      makeStars();
    } else if (key === "4" && breeze.state === "started") {
      breeze.stop();
    }
  }
}

Tone.loaded().then(function () {
  loaded = true;
});

function makeStars() {
  for (let i = 0; i < numStars; i++) {
    stars[i] = createVector(random(width), random(height), random(1, 6));
  }
}

function showStars() {
  for (let i = 0; i < numStars; i++) {
    if (breeze.state === "started") {
      // 110-114 w/ assistance from chatGPT (moving stars & regeneration)

      stars[i].x += stars[i].z * 0.5; // Speed based on star size (z)
      // Wrap stars when they move off the canvas
      if (stars[i].x > width) {
        stars[i].x = 0;
        stars[i].y = random(height);
      }
    }

    if (pluck.state === "started") {
      c3 = color("#3D27DE");
      c4 = color(200);
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
