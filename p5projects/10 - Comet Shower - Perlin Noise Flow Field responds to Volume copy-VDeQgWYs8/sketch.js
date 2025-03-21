let inc = 0.01;
let scl = 20;
let rows;
let cols;
let field;
let zoff = 0;
let particleNum = 250;
let particles = [];
let mic;
let sensitivity;
let sens;

function setup() {
  createCanvas(600, 600);
  rows = width / scl;
  cols = height / scl;
  field = new Array(rows * cols);
  mic = new p5.AudioIn;
  mic.start();
  for (let i = 0; i < particleNum; i++) {
      particles[i] = new Particle();
  }
}

function draw() {
  background(0, 10);
  let xoff;
  let yoff = 0;
  sensitivity = document.querySelector('#sensitivity').value;
  sens = map(sensitivity, 0, 1, 1, 0);
  strokeWeight(1);
  stroke(1);
  for (let y = 0; y < rows; y++) {
      xoff = 0;
      for (let x = 0; x < cols; x++) {
        let index = x + y * cols;
        let angle = noise(xoff, yoff, zoff) * TWO_PI;
        field[index] = p5.Vector.fromAngle(angle);
        field[index].setMag(2);
        /*
        push();
        translate(x * scl, y * scl);
        rotate(field[index].heading());
        line(0, 0, scl, 0);
        pop(); */
        xoff += inc;
      }
      yoff += inc;
      zoff += 0.0001;
    }
  
  for (let i = 0; i < particleNum; i++) {
    particles[i].follow(field, scl, cols);
    let windSpeed = map(mic.getLevel(0.5), 0, sens, 0.1, 8);
    particles[i].update(windSpeed);
    particles[i].show();
  }

}