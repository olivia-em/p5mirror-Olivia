var player;
let delayAmount;
var feedbackDelay = new Tone.FeedbackDelay(delayAmount, 0.5);



function preload(){
  player = new Tone.Player("samples/congas.m4a");
  
  // player properties:
  // playbackRate:1
  // loop:false
  // autostart:false
  // loopStart:0
  // loopEnd:0
  // retrigger:false
  // reverse:false
  
  player.loop = true;
  
  //make loop shorter
  // player.loopStart = 0;
  // player.loopEnd = "8n";
  player.toMaster();
    player.connect(feedbackDelay);
  //EFFECTS
  // var chorus = new Tone.Chorus(1.5, 3.5, 0.5);
  // player.toMaster();
  // player.connect(chorus);
  // chorus.toMaster();
  
//   distortion = new Tone.Distortion(0.8);
//   player.connect(distortion);
//   distortion.toMaster();
  
  
  // var freeverb = new Tone.Freeverb(0.7,250).toMaster();
  // // freeverb.dampening.value = 250;
  // player.connect(freeverb);
  
  // var phaser = new Tone.Phaser({
  // 	"frequency" : 15, 
  // 	"octaves" : 5, 
  // 	"baseFrequency" : 1000
  // }).toMaster();
  // player.connect(phaser);
  
  // var pingPong = new Tone.PingPongDelay("2n", 0.2).toMaster();
  // player.connect(pingPong);

  
//   var crusher = new Tone.BitCrusher(4).toMaster();
//   player.connect(crusher);
  
  // var panner = new Tone.Panner(1).toMaster();
  // player.connect(panner);
  

  
  // var autoPanner = new Tone.AutoPanner("16n").toMaster().start();
  // player.connect(autoPanner);
}

function setup() {
  
}

function draw() {
    // player.playbackRate = map(mouseX, 0, width, 0.1, 1);
  
    // Map position to effect parameters
  
  delayAmount = map(mouseX, 0, width, 0, 1)
  
  feedbackDelay.delayTime.value = delayAmount;
  
}

function keyPressed(){
  if(key == ' '){
    if(player.state == "stopped"){
      player.start();   
    }
    else{
      player.stop();
    }
  }
}

function mouseReleased(){
  
}

