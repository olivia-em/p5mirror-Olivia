// MISSING SNARE MP3, THAT'S THE BUG!!!!!!

// Create a Player object and load the "kick.mp3" file
// Create a Players object and load the drum kit files
const kit = new Tone.Players({
  "kick": "samples/505/kick.mp3", 
  "snare": "samples/505/snare.mp3",
  "hh": "samples/505/hh.mp3",
  "hho": "samples/505/hho.mp3"
});
kit.toDestination();

// // Connect the player output to the computer's audio output
// drum.toDestination();

// Set the tempo to 120 beats per minute
Tone.Transport.bpm.value = 120;

// Set the time signature to 4/4. 
Tone.Transport.timeSignature = [3, 4];

// Create a loop: call playBeat every quarter note
Tone.Transport.scheduleRepeat(playBeat, "4n");

// let snarePattern = [0, 1, 0, 1];
// let kickPattern = [1, 0, 1, 0];

let cells = [
  [0, 1, 0, 1],
  [1, 1, 1, 0],
];

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

function playDrum(time) {
  // Tone's position gives us a string: 
  // bar:beat:sixteenth
  // Slice the string by ":" and get the number in the second position (the beat)
  let beat = Tone.Transport.position.split(":")[1];
  console.log(beat);
  
  // Play the first beat louder than the rest.
  // Try changing the time signature above and listen.
  if (beat == 0) {
    drum.volume.rampTo(2, 0.05);
  } else {
    drum.volume.rampTo(-20, 0.05);
  }
  drum.start(time);

}

// Interface: p5 functions
function setup() {
  btn = createButton("play");
  btn.mousePressed(togglePlay);
  btn.position(0, 0);
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