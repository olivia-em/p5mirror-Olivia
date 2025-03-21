// Create a 120BPM beat

// Create a Players object and load/label the drum kit files
const kit = new Tone.Players({
  "kick": "samples/505/kick.mp3", 
  "snare": "samples/505/snare.mp3"
  // ,
  // "hh": "samples/505/hh.mp3",
  // "hho": "samples/505/hho.mp3"
});
kit.toDestination();

let bpm = 120
let interval = 60/bpm;
let count = -1;
let louder = 0;
let softer = -20;
let beat;
let beatsPerMeasure = 2;
let measure;
const repeatEvent = new 
Tone.Loop(playDrum, interval);
repeatEvent.start(0);

function playDrum() {
  count++
  beat = count % beatsPerMeasure;
  measure = floor(count/beatsPerMeasure);
  kit.player("kick").start();
  if (beat === beatsPerMeasure - 1) {
    kit.player("kick").volume.rampTo(louder)
  } else {
    kit.player("kick").volume.rampTo(softer)
  }
  console.log(count, beat, measure)
}

function setup(){
  createCanvas(200, 200); 
  background(0);
}

function draw(){
  
}

function keyPressed() {
  Tone.Transport.start();
  // if (key === 'a'){
  //   kit.player("kick").start();
  // } else if (key === 's'){
  //   kit.player("snare").start();
  // }
}
