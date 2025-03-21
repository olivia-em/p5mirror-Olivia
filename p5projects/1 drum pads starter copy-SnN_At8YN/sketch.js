// Click the mouse to play kick drum

// Create a Players object and load the drum kit files
const kit = new Tone.Players({
  kick: "samples/505/kick.mp3",
  snare: "samples/505/snare.mp3",
  hh: "samples/505/hh.mp3",
  hho: "samples/505/hho.mp3",
});
kit.toDestination();

let g = 120;
// Set the tempo to 120 beats per minute
Tone.Transport.bpm.value = g;

// Set the time signature to 4/4.
Tone.Transport.timeSignature = [3, 4];

// Create a loop: call playBeat every quarter note
Tone.Transport.scheduleRepeat(playBeat, "4n");

let cells = [
  [0, 1, 0, 1],
  [1, 1, 1, 0],
];

let pw, ph;

function mousePressed() {
  if (kit.loaded) {
    // Make sure the sound file has been completely loaded
    if (mouseX > 0 && mouseX < pw && mouseY > 0 && mouseY < ph) {
      kit.player("kick").start();
    } else if (
      mouseX > pw &&
      mouseX < 2 * pw &&
      mouseY > ph &&
      mouseY < 2 * ph
    ) {
      kit.player("snare").start();
    } else if (mouseX > pw && mouseX < 2 * pw && mouseY > 0 && mouseY < ph) {
      kit.player("hh").start();
    } else if (mouseX > 0 && mouseX < pw && mouseY > ph && mouseY < 2 * ph) {
      kit.player("hho").start();
    }
  }
}

function setup() {
  createCanvas(200, 200);
  pw = width / 2;
  ph = height / 2;
  background(0);

  btn = createButton("play");
  btn.mousePressed(togglePlay);
  btn.position(pw - btn.width / 2, height + 10);
  slider = createSlider(50, 180);
  slider.position(pw - slider.width / 3, height + 40);
  slider.size(80);
}

function togglePlay() {
  if (Tone.Transport.state == "started") {
    Tone.Transport.pause();
    btn.html("play");
  } else {
    Tone.Transport.start();
    btn.html("pause");
  }
}

function playBeat(time) {
  let beat = Tone.Transport.position.split(":")[1];
  console.log(beat);
  if (cells[0][beat] == 1) {
    kit.player("snare").start(time);
  }
  if (cells[1][beat] == 1) {
    kit.player("kick").start(time);
  }
}

function draw() {
  background(0);
  Tone.Transport.bpm.value = g;
  g = slider.value();
  textSize(32);
  fill(255);
  stroke(0);
  strokeWeight(4);
  text(g, width/2.5 , height/2);
}
