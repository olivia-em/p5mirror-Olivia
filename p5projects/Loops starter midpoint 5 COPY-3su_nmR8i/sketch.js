let loaded = false;
const bass = new Tone.Player({
          url: "loops/Bass0.mp3",
          loop: true
        });
bass.toDestination();

const chords = new Tone.Player({
          url: "loops/Chords0.mp3",
          loop: true
        });
chords.toDestination();

const melody = new Tone.Player({
          url: "loops/Melody0.mp3",
          loop: true
        });
melody.toDestination();

const drums = new Tone.Player({
          url: "loops/Drums0.mp3",
          loop: true
        });
drums.toDestination();

function setup() {  
  noCanvas();

}

function draw() {
  // not drawing anything for now
  
  
}

function keyTyped(){
  if(loaded){
    if(Tone.Transport.state == "stopped"){
      Tone.Transport.bpm.value = 121.80;
      Tone.Transport.start();
    }
    
    let quantizeResolution = "@4n"
  
    if(key == 'a'){
      if(drums.state == "started"){
        drums.stop();  
      } else{
        // start aligned with the next 'measure' subdivision
        drums.start(quantizeResolution);
      }
    }
    else if (key == 's'){
      if(chords.state == "started"){
        chords.stop();  
      } else{
        chords.start(quantizeResolution);
      }
    }
    else if (key == 'd'){
      if(melody.state == "started"){
        melody.stop();  
      } else{
        melody.start(quantizeResolution);
      }
    }
    else if (key == 'f'){
      if(bass.state == "started"){
        bass.stop();  
      } else{
        bass.start(quantizeResolution);
      }
    }
  }
}

Tone.loaded().then(function(){  
  loaded = true;
});

