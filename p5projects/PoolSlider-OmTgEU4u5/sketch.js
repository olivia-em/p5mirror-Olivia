let dragging = false;
let myGreen = "#0a6c03";
let myRed = "#B50D0A";
let myCream = "#FFFDD0";
let r = 25;
let cx;
let cy;

function setup() {
  createCanvas(400, 400);
  cx = width / 2;
  cy = height / 2;
}

function draw() {
  background(cy, 0, cx);

  // pool table
  strokeWeight(15);
  stroke(0);
  fill(myGreen);
  rect(width / 4, 50, width / 2, 300, 10);
  fill(0);
  arc(width / 4, 50, 50, 50, 0, PI / 2);
  arc((3 * width) / 4, 50, 50, 50, PI / 2, PI);
  arc((3 * width) / 4, 350, 50, 50, PI, (3 * PI) / 2);
  arc(width / 4, 350, 50, 50, (3 * PI) / 2, 0);
  strokeWeight(0);
  arc((3 * width) / 4, 200, 50, 50, PI / 2, (3 * PI) / 2);
  arc(width / 4, 200, 50, 50, (3 * PI) / 2, PI / 2);

  // pool ball
  strokeWeight(5);
  fill(myCream);
  stroke(myRed);
  circle(cx, cy, 50);
  strokeWeight(5);
  noFill();
  arc(cx, cy - 6, 50, 15, 0, PI);
  arc(cx, cy - 2, 50, 15, 0, PI);
  arc(cx, cy + 3, 50, 15, 0, PI);

  if (dragging) {
    // constrain & change to 8 ball
    strokeWeight(6);
    fill(0);
    stroke(0);
    circle(cx, cy, 50);
    fill(myCream);
    circle(cx - 5, cy, 30);
    text("8", cx - 9, cy + 4);
    cx = constrain(mouseX, width / 4 + r, (3 * width) / 4 - r);
    cy = constrain(mouseY, 50 + r, 350 - r);
  }
}

function mousePressed() {
  // Did I click on slider?
  if (dist(mouseX, mouseY, cx, cy) < r) {
    dragging = true;
  }
}

function mouseReleased() {
  // Stop dragging
  dragging = false;
  cx = width / 2;
  cy = height / 2;
}
