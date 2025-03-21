// function mouseMoved() {
//   console.log(`Mouse X: ${mouseX}, Mouse Y: ${mouseY}`);
// }

function preload() {
  img1 = loadImage("girls.png");
  img2 = loadImage("airlock.png");
  img3 = loadImage("hozier.png");
  img4 = loadImage("summit.png");
  img5 = loadImage("you.png");
}

let bg = 0;
let mygray = 210;
let dia = 25;
let R;
let G;
let B;
let imgs;
let choice;
let BGcolor = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
let index = 0;

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
  angleMode(DEGREES);
  background("black");

  // randomizes color
  R = random(0, 255);
  G = random(0, 255);
  B = random(0, 255);
  c1 = color(R, G, B);
  c2 = color(B, R, G);
  imgs = [img1, img2, img3, img4, img5];
  choice = random(imgs);

  setInterval(changeBG, 800);
}

function draw() {
  
  // resize the album images
  img1.resize(50, 0);
  img2.resize(50, 0);
  img3.resize(50, 0);
  img4.resize(50, 0);
  img5.resize(50, 0);

  // wire for headphones
  push();
  noFill();
  strokeWeight(5);
  stroke(BGcolor[index]);
  beginShape();
  curveVertex(205, 117);
  curveVertex(205, 117);
  curveVertex(175, 88);
  curveVertex(113, 87);
  curveVertex(112, 117);
  curveVertex(132, 125);
  curveVertex(150, 117);
  curveVertex(144, 85);
  curveVertex(107, 52);
  curveVertex(59, 37);
  curveVertex(22, 58);
  curveVertex(26, 109);
  curveVertex(66, 112);
  curveVertex(100, 137);
  curveVertex(112, 187);
  curveVertex(84, 234);
  curveVertex(38, 237);
  curveVertex(18, 257);
  curveVertex(24, 307);
  curveVertex(149, 350);
  curveVertex(285, 412);
  curveVertex(285, 412);
  endShape();
  pop();

  // creating the gradient background
  let grad = drawingContext.createLinearGradient(100, 200, 200, 200);

  grad.addColorStop(0, c1);
  grad.addColorStop(0.8, c2);

  // draw rect
  drawingContext.save();
  drawingContext.fillStyle = grad;

  // gradient is behind ipod
  stroke(BGcolor[index]);
  rotate(-20);
  rect(130, 255, 100, 150, 10);

  // restore p5js style
  drawingContext.restore();

  // screen & buttons
  push();
  rotate(-20);
  stroke(BGcolor[index]);
  fill("white");
  rect(130, 220, 75, 55, 10);
  pop();

  // wire for headphones
  push();
  noFill();
  strokeWeight(5);
  stroke(BGcolor[index]);
  beginShape();
  curveVertex(460, 269);
  curveVertex(403, 350);
  curveVertex(362, 244);
  curveVertex(359, 118);
  curveVertex(359, 118);
  endShape();
  beginShape();
  curveVertex(460, 269);
  curveVertex(403, 350);
  curveVertex(362, 244);
  curveVertex(286, 187);
  curveVertex(275, 130);
  curveVertex(275, 130);
  endShape();
  pop();

  // speakers of headphones
  push();
  fill(255);
  stroke(BGcolor[index]);
  ellipse(363, 116, 15, 25);
  ellipse(279, 129, 15, 25);
  stroke(0);
  fill(c2);
  ellipse(282, 129, 10, 25);
  ellipse(366, 116, 10, 25);
  pop();

  // large circle
  push();
  stroke(BGcolor[index]);
  fill("white");
  circle(220, 225, 65);
  pop();

  // small circle button
  push();
  stroke(BGcolor[index]);
  fill(c2);
  circle(220, 225, dia);
  pop();

  // album cover (changes on click of button)
  push();
  rotate(-20);
  image(choice, 105, 195);
  pop();
}

function mouseClicked() {
  if (circleHitTest(mouseX, mouseY, 220, 225, dia / 2)) {
    choice = random(imgs);
  }
}

function changeBG() {
  index++;

  if (index >= BGcolor.length) {
    index = 0;
  }
}

// returns true if pX, pY is inside a circle
// that is centred at cX, cY with radius r
function circleHitTest(pX, pY, cX, cY, radius) {
  // calculate distance from pX, pY  to centre of circle
  let d = myDist(pX, pY, cX, cY);

  // if it's less than radius, we have a hit
  if (d <= radius) {
    return true;
  } else {
    return false;
  }
}

// returns the distance between point P at (pX, pY)
// and point Q at (qX, qY)
function myDist(pX, pY, qX, qY) {
  let a = pY - qY; // y difference
  let b = pX - qX; // x difference
  let c = sqrt(a * a + b * b);
  return c;
}
