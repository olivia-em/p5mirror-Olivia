let sun;
let fft;
let amp;


function preload() {
  sun = loadSound("beach.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  sun.loop();

  fft = new p5.FFT();
  fft.setInput(sun);
  
}

function mousePressed() {
  if (sun.isPlaying()) {
    sun.pause();
  } else {
    sun.loop();
  }
}

function draw() {
  background(0);
  fft.analyze();
  amp = fft.getEnergy(20,200);
  
  if (amp > 210){
    ellipse(200,200,40,40)
  } else {
    ellipse(200,200,20,20)
  }
  
  print(amp)
  

}

// resize canvas & full screen

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  fft = new p5.FFT();
  fft.setInput(sun);
}