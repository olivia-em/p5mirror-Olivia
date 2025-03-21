let loaded = false;

const bass = new Tone.Player({
  url: "loops/Bass0.mp3",
  loop: true,
}).toDestination();

const chord = new Tone.Player({
  url: "loops/Chords0.mp3",
  loop: true,
}).toDestination();

const drums = new Tone.Player({
  url: "loops/Drums0.mp3",
  loop: true,
}).toDestination();

const melody = new Tone.Player({
  url: "loops/Melody0.mp3",
  loop: true,
}).toDestination();

function setup() {
  noCanvas();
}

function keyTyped() {
  if (loaded) {
    const now = Tone.now();
    const d = bass._buffer.duration;

    //     bass.start(now);
    //     chord.start(now + d/2);
    //     drums.start(now + d);
    //     melody.start(now + 3*d/2);

    if (key === "a" && bass.state === "stopped") {
      bass.start(now);
    } else if (key === "a" && bass.state === "started") {
      bass.stop();
    } else if (key === "s" && chord.state === "stopped") {
      chord.start(now + d/2);
    } else if (key === "s" && chord.state === "started") {
      chord.stop();
    } else if (key === "d" && drums.state === "stopped") {
      drums.start(now + d);
    } else if (key === "d" && drums.state === "started") {
      drums.stop();
    } else if (key === "f" && melody.state === "stopped") {
      melody.start(now + (3 * d) / 2);
    } else if (key === "f" && melody.state === "started") {
      melody.stop();
    }
  }
}

function draw() {
  // not drawing anything for now
}

Tone.loaded().then(function () {
  loaded = true;
});
