// Draw your pattern
let w;
let tempoSlider;
let totalBeats = 0;
let direction = 1;
let cval;

var cells = [
  [0, 0, 0, 0, 0, 0, 0, 0], //cells[0] holds the hh pattern
  [0, 0, 0, 0, 0, 0, 0, 0], //cells[1] holds the hho pattern
  [0, 0, 0, 0, 0, 0, 0, 0], //cells[2] holds the snare pattern
  [0, 0, 0, 0, 0, 0, 0, 0], //cells[3] holds the kick pattern
  [0, 0, 0, 0, 0, 0, 0, 0], //cells[4] holds f2 pattern
  [0, 0, 0, 0, 0, 0, 0, 0], //cells[5] holds c2 pattern
  [0, 0, 0, 0, 0, 0, 0, 0], //cells[6] holds f1 pattern
  [0, 0, 0, 0, 0, 0, 0, 0], //cells[7] holds c1 pattern
];

// SOUNDS

// Create a Players object and load the "kick.mp3" and "snare.mp3" files
const kit = new Tone.Players({
  kickA: "kickA.mp3",
  kickB: "kickB.mp3",
  wood: "wood.mp3",
  hh: "hh.mp3",
  c1: "c#1.mp3",
  f1: "F1.mp3",
  c2: "c2.mp3",
  f2: "f2.mp3",
});

// Connect the player output to the computer's audio output
kit.toDestination();

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
    if (cells[4][beat] == 1) {
      kit.player("f2").start(time);
    }
    if (cells[5][beat] == 1) {
      kit.player("c2").start(time);
    }
    if (cells[6][beat] == 1) {
      kit.player("f1").start(time);
    }
    if (cells[7][beat] == 1) {
      kit.player("c1").start(time);
    }
  }
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
  tempoSlider = createSlider(80, 1020, 120);
  tempoSlider.size(minDimension / 2);

  tempoSlider.position(
    minDimension / 2 - minDimension / 6,
    (9 * minDimension) / 10
  );

  tempoSlider.addClass("mySliders");
}

function windowResized() {
  resizeCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
  let minDimension = min(width, height);
  tempoSlider.size(minDimension / 2);

  tempoSlider.position(
    minDimension / 2 - minDimension / 6,
    (9 * minDimension) / 10
  );
  // tempoSlider.style("transform", "rotate(-90deg)");
  tempoSlider.addClass("mySliders");
}

function draw() {
  blendMode(BLEND);
  background(0);
  minDimension = min(width, height);
  tempoSlider.changed(updateTempo);
  let cval = map(tempoSlider.value(), 80, 1020, 0, 255);

  textSize(minDimension / 20);
  fill(255);
  textAlign(CENTER, CENTER);
  text(
    round(tempoSlider.value() / 4) + " bpm",
    minDimension / 5,
    (9 * minDimension) / 10
  );
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

function updateTempo() {
  Tone.Transport.bpm.rampTo(tempoSlider.value());
}
