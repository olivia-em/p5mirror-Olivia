function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
}

function draw() {
  background(1, 9, 61);
  
  drawHair(); 
  drawFace();
  drawBangs(); 
  drawEyes(177,165,15);
  drawNose();
  drawBlush();
  drawSmile();
  drawNeckChest();
  drawArmsLegs(); 
  drawDress(); 
  drawClouds();
 
}

function drawEyes(x,y,w) {

  fill(255);
  stroke(1, 22, 92)
  strokeWeight(1);
  circle(x, y, w);
  circle(x+36, y, w-4);  
  fill(0);
  noStroke()
  circle(x, y, w-10);
  circle(x+36, y, w-11);
}

function drawHair() {
  fill(28, 6, 6);
  stroke(255, 255, 255)
  strokeWeight(0.4);
  rect(140,100,110,150,55,55,0,0);
}
function drawFace() {
  fill(224, 196, 184);
  ellipse(195, 165, 90, 100);
}
function drawBangs() {
  fill(28, 6, 6);
  noStroke()
  rect(150,114,90,39,250,250,0,0);
}

function drawNose() {
  stroke(184, 152, 140);
  strokeWeight(3);
  line(195,175,190,185)
  line(190,185,195,185)
}
function drawBlush() {
  fill(232,86,104,50);
  noStroke()
  ellipse(170, 180, 11, 11);
  ellipse(220, 180, 11, 11);
}

function drawSmile() {
  fill(102, 11, 22);
  arc(198, 194, 25, 25, 0, 180);
}
function drawNeckChest(){
  fill(224, 196, 184);
  rect(184,210,25,25);
  rect(157,225,80,50,15,15,0,0);
}

function drawArmsLegs() {
  stroke(224, 196, 184);
  strokeWeight(20);
  line(165,240,140,300)
  line(229,240,260,300)  
  line(180,320,180,375)
  line(220,320,220,375)
}

function drawDress() {
   noStroke();
  fill(102, 11, 22);
  quad(170, 242, 225, 242, 255, 350, 145, 350);
  stroke(102, 11, 22);
  strokeWeight(5);
  line(172, 245,182,223)
  line(223, 245,211,223)
}
function drawClouds() {
  noStroke();
  fill(255)
  ellipse(85, 75, 50, 50);
  ellipse(60, 50, 50, 50);
  ellipse(45, 75, 50, 50);
  ellipse(95, 45, 50, 50);
  
  ellipse(360, 75, 50, 50);
  ellipse(360, 45, 50, 50);
  ellipse(320, 75, 50, 50);
  ellipse(325, 45, 50, 50);
  
  ellipse(277, 100, 15, 15);
  ellipse(255, 120, 11, 11);
}