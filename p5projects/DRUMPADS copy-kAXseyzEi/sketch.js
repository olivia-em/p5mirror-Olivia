// Draw your pattern
let w;
let tempoSlider;
let totalBeats = 0;
let direction = 1;
let cval;

// SOUNDS

// Create a Players object and load the "kick.mp3" and "snare.mp3" files
const moneySounds = new Tone.Players({
  kickA: "kickA.mp3",
  kickB: "kickB.mp3",
  wood: "wood.mp3",
  hh: "hh.mp3"
});

const makeupSounds  = new Tone.Players({
  c1: "c#1.mp3",
  f1: "F1.mp3",
  c2: "c2.mp3",
  f2: "f2.mp3",
});

// Connect the player output to the computer's audio output
moneySounds.toDestination();
makeupSounds.toDestination();

// Audio playback loop
function playBeat(time) {
  // Make sure the sound files have been completely loaded
  if (kit.loaded) {
    let beat = Tone.Transport.position.split(":")[1];

    if (cells[0][beat] == 1) {
      kit.player("hh").start(time);
    }
    if (cells[1][beat] == 1) {
      kit.player("wood").start(time);
    }
    if (cells[2][beat] == 1) {
      kit.player("kickA").start(time);
    }
    if (cells[3][beat] == 1) {
      kit.player("kickB").start(time);
    
}

// GRAPHICS
// Create a loop: call playBeat every quarter note
Tone.Transport.bpm.value = 120;
Tone.Transport.timeSignature = [16, 8];
Tone.Transport.scheduleRepeat(playBeat, "4n");

function setup() {
  createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
  let minDimension = min(width, height);
  // rectMode(CENTER);
}

function windowResized() {
  resizeCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
  let minDimension = min(width, height);

}

function draw() {
  blendMode(BLEND);
  background(0);
  minDimension = min(width, height);

  blendMode(LIGHTEST);

  w = minDimension / 8;

  noStroke();
  for (var step = 0; step < 8; step++) {
    // we have 4 steps
    for (var track = 0; track < 8; track++) {
      //we have 4 tracks

      if (cells[track][step] == 1) {
        fill(cval, 0, 255 - cval);
        circle(step * w + w / 2, track * w * 0.8 + w / 2, (2.5 * w) / 4);
      } else if (step % 4 === 0) {
        fill(cval, 0, 255 - cval);
        circle(step * w + w / 2, track * w * 0.8 + w / 2, w / 2);
      } else {
        fill(cval, 150, 255 - cval);
        circle(step * w + w / 2, track * w * 0.8 + w / 2, w / 2);
      }
    }
  }

  // Highlight current step
  fill(255, 30);
  let beat = Tone.Transport.position.split(":")[1];
  rect(beat * w, 0, w, w * 8 * 0.8);

  // console.log(Tone.Transport.bpm.value);
}
function mousePressed() {
  let minDimension = min(width, height);
  w = minDimension / 8;

  // Ignore clicks on the slider
  if (mouseY > tempoSlider.y && mouseY < tempoSlider.y + 20) {
    return;
  }

  let i = floor(mouseX / w);
  let j = floor(mouseY / (w * 0.8));

  if (i >= 0 && i < 8 && j >= 0 && j < 8) {
    cells[j][i] = !cells[j][i];
  }
}

// Once all audio files have been loaded, start the Tone playhead
Tone.loaded().then(function () {
  console.log("loaded");
  Tone.Transport.start();
});
