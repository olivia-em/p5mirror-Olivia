// Tone.Oscillator allows you to deal with multiple oscillators at the same time
let osc = new Tone.Oscillator(261.63, "sine");
osc.volume.value = -12;

let ampEnv1 = new Tone.AmplitudeEnvelope({
  attack: 0.01,
  decay: 0.6,
  sustain: 0.1,
  release: 0.8,
});

osc.connect(ampEnv1);
ampEnv1.toMaster();
osc.start();

function setup() {}

function updateVolume() {
  osc.volume.rampTo(this.value());
}

function draw() {
  background(220);
}

function keyPressed() {
  ampEnv1.triggerAttack();
}

function keyReleased() {
  ampEnv1.triggerRelease();
}
