let state = false;
let bg = 0;

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
  setInterval(myRect, 500);
}

function draw() {
  background(bg);
  if (state) {
    fill('pink')
  } else {
    noStroke()
    fill(bg)
  }
  rect(200,200,100,100)
}

function myRect() {
  state = !state
}