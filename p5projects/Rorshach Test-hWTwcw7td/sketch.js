/**
 * form mophing process by connected random agents
 *
 * MOUSE
 * click               : start a new circle
 * position x/y        : direction of floating
 *
 * KEYS
 * 1-2                 : fill styles
 * 3                   : freeze. loop on/off
 * 5                   : clear display
 * 4                   : save png
 */
'use strict';

var formResolution = 15;
var stepSize = 2;
var distortionFactor = 1;
var initRadius = 50;
var centerX;
var centerY;
var x = [];
var y = [];

let input;

var filled = false;
var freeze = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // init shape
  centerX = width / 2;
  centerY = height / 2;
  var angle = radians(360 / formResolution);
  for (var i = 0; i < formResolution; i++) {
    x.push(cos(angle * i) * initRadius);
    y.push(sin(angle * i) * initRadius);
  }

  stroke(0, 50);
  strokeWeight(0.75);
  
  input = createInput('');
  input.position(0, 0);
  
  background(255);
}

function draw() {
  // floating towards mouse position
  centerX += (mouseX - centerX) * 0.01;
  centerY += (mouseY - centerY) * 0.01;

  // calculate new points
  for (var i = 0; i < formResolution; i++) {
    x[i] += random(-stepSize, stepSize);
    y[i] += random(-stepSize, stepSize);
    // uncomment the following line to show position of the agents
    // ellipse(x[i] + centerX, y[i] + centerY, 5, 5);
  }

  if (filled) {
    fill(0);
  } else {
    noFill();
  }

  beginShape();
  // first controlpoint
  curveVertex(x[formResolution - 1] + centerX, y[formResolution - 1] + centerY);

  // only these points are drawn
  for (var i = 0; i < formResolution; i++) {
    curveVertex(x[i] + centerX, y[i] + centerY);
  }
  curveVertex(x[0] + centerX, y[0] + centerY);

  // end controlpoint
  curveVertex(x[1] + centerX, y[1] + centerY);
  endShape();
  
  beginShape();
  // second controlpoint
  curveVertex(x[formResolution - 1] + (width - centerX), y[formResolution - 1] + centerY);

  // only these points are drawn
  for (var i = 0; i < formResolution; i++) {
    curveVertex(x[i] + (width - centerX), y[i] + centerY);
  }
  curveVertex(x[0] + (width - centerX), y[0] + centerY);

  // end controlpoint
  curveVertex(x[1] + (width - centerX), y[1] + centerY);
  endShape();
}

function mousePressed() {
  // init shape on mouse position
  centerX = mouseX;
  centerY = mouseY;
  var angle = radians(360 / formResolution);
  var radius = initRadius * random(0.5, 1);
  for (var i = 0; i < formResolution; i++) {
    x[i] = cos(angle * i) * initRadius;
    y[i] = sin(angle * i) * initRadius;
  }
}

function keyReleased() {
  if (key == '4' || key == '4') saveCanvas(input.value() + "-Rorshach", 'png');
  if (key == '5' || key == '5') background(255);
  if (key == '1') filled = false;
  if (key == '2') filled = true;

  // pauze/play draw loop
  if (key == '3' || key == '3') freeze = !freeze;
  if (freeze) {
    noLoop();
  } else {
    loop();
  }
}