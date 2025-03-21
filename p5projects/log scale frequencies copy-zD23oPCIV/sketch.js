// The Code of Music
// NYU ITP/IMA Fall 2024
// Luisa Pereira

// Starter code for the Melody chapter

// Create a Synth instrument, which can play specific frequencies
const synth = new Tone.Synth();
synth.toDestination();

let min = 80;
const turns = 3;
let max = min * turns;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);
}

function mousePressed() {
  let freq = random(min,max);
  let velocity = mouseX / width;
  // Trigger (play) a 100Hz tone
  synth.triggerAttack(freq, velocity);
}

function mouseReleased() {
  // Release (stop playing) the tone
  synth.triggerRelease();
}

// Create p5.js' setup function - this is just to make sure p5.js is initialized
// and the event handlers we defined above (mousePressed, mouseReleased) are called
