let songs = [];
let current = 0;
let prev = 0;

function preload() {
  songs[0] = loadSound("sweet.mp3");
  songs[1] = loadSound("beach.mp3");
  songs[2] = loadSound("shiver.mp3");
  songs[3] = loadSound("data.mp3");
  songs[4] = loadSound("sunshine.mp3");
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    if (current <= 4) {
      songs[current].play();
      current++;
    } else if (current > 4) {
      current = 0;
    }

    if (current > 1) {
      songs[prev].stop();
      prev++;
    } else if (prev >= 4) {
      songs[prev].stop();
      prev = 0;
    }
  }

  // if (key === " " && songs[current].isPlaying()) {
  //   songs[current].pause();
  // } else if (key === " " && songs[current].isPlaying() === false) {
  //   songs[current].play();
  // }
}
