let song;

function preload() {
  song = loadSound("sweet.mp3");
}

function setup() {
  createCanvas(400, 400);
  song.loop();
}

function draw() {
  background(220);
}

function mousePressed() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.loop();
  }
}
