const sound = new SimplePlayer("sounds/Ambiente_3.mp3");
let analyzer = new Tone.Waveform(1024);
sound.toDestination();
sound.connect(analyzer);

let loaded = false;

function setup(){
  createCanvas(600,600);
}

function draw(){
  if(loaded){
  background(0);
  let waveform = analyzer.getValue();
    
  fill(255);
  noStroke();
  translate(width/2, height/2);
  beginShape();
  // divide the 360 degrees into equal increments
  let points = floor(analyzer.getValue().length / 36);
  for (let i = 0; i < waveform.length; i+= points) {
    // use polar coordinates
    let phi = map(i, 0, waveform.length, 0, 360);
    let radius = map(waveform[i], -1, 1, 0, width/3);
    
    // polar to cartesian    
    let x = radius * cos(phi);
    let y = radius * sin(phi);
    fill(255, 0, 0);
    // ellipse(x,y, 10,10);
    fill(255);
    // vertex(x, y);
    curveVertex(x, y);
    
  }
  endShape();
  }
  else{
    background(220);
    text("loading...", 20, 20);
  }
}

function mouseClicked(){
  if(loaded){
    sound.start();
  }
}

Tone.loaded().then(function(){
  loaded = true;
});
