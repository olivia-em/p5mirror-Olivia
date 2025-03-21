// Create a 120BPM beat

// Create a Players object and load the drum kit files
const kit = new Tone.Players({
  "kick": "samples/505/kick.mp3", 
  "snare": "samples/505/snare.mp3",
  "hh": "samples/505/hh.mp3",
  "hho": "samples/505/hho.mp3"
});
kit.toDestination();

function setup(){
  createCanvas(200, 200); 
  background(0);
  console.log("PRESS:\nj:kick\nk:snare\ni:hh\nu:hho");
}

function draw(){
  noStroke();
  fill(100);
  rect(0, 0, width/2, height/2);
  fill(200);
  rect(width/2,0, width/2, height/2);  
  fill(150);
  rect(width/2, height/2, width/2, height/2);
  fill(50);
  rect(0, height/2, width/2, height/2);
}

function keyPressed(){
  // Make sure the sound files have been completely loaded
  if(key == "j"){
      kit.player("kick").start();  
  }
  else if(key == "k"){
    kit.player("snare").start();
  }
  else if(key == "i"){
    kit.player("hh").start();
  }
  else if(key == "u"){
    kit.player("hho").start();
  }
}
