// Create a Player object and load the "kick.mp3" file
const drum = new Tone.Player("samples/505/kick.mp3");

// Connect the player output to the computer's audio output
drum.toDestination();

// Set the tempo to 120 beats per minute
Tone.Transport.bpm.value = 120;

// Set the time signature to 4/4. 
// See documentation: https://github.com/Tonejs/Tone.js/wiki/Transport
Tone.Transport.timeSignature = [4, 4];

Tone.Transport.scheduleRepeat(playDrum, "4n");

function playDrum(time){
  drum.start(time);
  console.log(Tone.Transport.position);
  
    // Take a look at the middle number printed on each line on the console. It corresponds to the current beat.
  
  // Changing the time signature to 3/4 or 4/4 does not change the sound
  // But it changes the counting
  // 4/4 means we count 0, 1, 2, 3 beats before going to the next measure
  // 3/4 means we count 0, 1, 2 before going to the next measure
  
  // We can then use this counting to treat each beat in a measure differently
  // Maybe we'll play the first beat of a measure louder (if beat == 0), 
  // Or maybe it will be an entirely different type of drum.
  
// We will do exactly that in the next couple of examples.
  
}

Tone.loaded().then(function(){
  console.log('loaded');
  Tone.Transport.start();
}
)

// Interface: p5 functions
function setup(){  
  btn = createButton("play");
  btn.mousePressed(togglePlay);
  btn.position(0, 0);
}

function togglePlay(){
  if(Tone.Transport.state == "started"){
    Tone.Transport.pause();
    btn.html("play");
  }
  else{
    Tone.Transport.start();
    btn.html("pause");
  }
}
