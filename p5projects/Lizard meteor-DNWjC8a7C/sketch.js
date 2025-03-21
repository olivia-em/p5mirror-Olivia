let sound;
let fft;
let bassEnergy;
let threshold = 10; // Adjust this threshold based on sensitivity
let beatDetected = false;

// function preload() {
//   sound = loadSound('your-audio-file.mp3'); // Replace with your audio file
// }

function setup() {
  createCanvas(400, 200);
  // sound.play();
  
  fft = new p5.FFT();
  mic = new p5.AudioIn();
  mic.start();
  // amp = new p5.Amplitude(0.9)
  fft.setInput(mic);
}

function draw() {
  background(0);
  
  // Perform FFT analysis
  let spectrum = fft.analyze();
  
  // Get energy level in the bass frequency range (20-140 Hz)
  bassEnergy = fft.getEnergy('bass');
  
  // Check if the bass energy surpasses a threshold to detect a beat
  if (bassEnergy > threshold) {
    beatDetected = true;
  } else {
    beatDetected = false;
  }
  
  // Visualize the beat
  if (beatDetected) {
    fill(255, 0, 0);
  } else {
    fill(255);
  }
  
  ellipse(width / 2, height / 2, bassEnergy, bassEnergy);
}
