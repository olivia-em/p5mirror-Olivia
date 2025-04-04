let sampler = new Tone.Sampler({
	"A1": "samples/casio/A1.mp3", 
  "D2": "samples/casio/D2.mp3", 
  "A2": "samples/casio/A2.mp3", 
  "B1": "samples/casio/B1.mp3", 
  "C2": "samples/casio/C2.mp3", 
  "F2": "samples/casio/F2.mp3", 
  "E2": "samples/casio/E2.mp3", 
  "G2": "samples/casio/G2.mp3", 
});

sampler.envelope = {
  attack: 0.2,
  decay: 0,
  sustain: 1,
  release: 0.1
}
sampler.toMaster();

function keyPressed() {
  let pitch; 
  if(key == 'a'){
  	pitch = "A1";
  }
  else if(key == 's'){
  	pitch = "B1";
  }
  else if(key == 'd'){
  	pitch = "C2";
  }
  else if(key == 'f'){
  	pitch = "D2";
  }
  else if(key == 'g'){
  	pitch = "E2";
  }
  
  if(pitch && sampler.loaded){
    // Sampler will repitch the closest sample
  	sampler.triggerAttack(pitch);
  }
}

function keyReleased() {
  sampler.triggerRelease();
}

function setup() {

}

