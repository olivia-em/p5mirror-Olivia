let sound
let amp

function preload() {
  //sound = loadSound("Here Comes The Sun.mp3")
  sound = loadSound("in my mind.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  amp = new p5.Amplitude(0.9)
  fft = new p5.FFT()
  sound.play()
}

function draw() {
  colorMode(HSB,1)
  background(0);
  translate(width / 2, height / 2)
  fft.analyze()
  freq = fft.getCentroid()
  var left = amp.getLevel(0);
  var A_L = map(left, 0, 1, 0, width)
  var right = amp.getLevel(1)
  var A_R = map(right, 0, 1, 0, height)
  c = amp.getLevel()
  beginShape()
  for (let t = 0; t < 100; t++) {
    noFill()
    x = A_L * cos(t*freq)
    y = A_R * sin(t*freq)
    stroke(c,1,1)
    vertex(x, y)
  }
  endShape()

}