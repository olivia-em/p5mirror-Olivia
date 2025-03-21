// Play the kick drum once per second


// Create a Player object and load the "kick.mp3" file
const kick = new Tone.Player("samples/505/kick.mp3");

// Connect the player output to the computer's audio output
kick.toDestination();

// Set the tempo / speed, which is measured in 'beats per minute', or bpm.
// Try setting the bpm to different values
Tone.Transport.bpm.value = 120;
// Our speed is now 120 beats per minute = 2 beats per second. 
// --> each beat lasts 0.5 seconds.
// --> quarter note duration is set to 0.5 seconds 
// (by default, Tone sets the time signature to be 4/4. 
// the denominator says that the duration of the beat is the duration of a quarter note)

// Create a loop: call the function playBeat every quarter note 
// "4n" stands for quarter note. Try replacing "4n" with "2n", "8n", "16n" 
Tone.Transport.scheduleRepeat(playPulse, "4n");
// See documentation here: https://github.com/Tonejs/Tone.js/wiki/Time

function playPulse(time){
  kick.start(time);
}

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
