// you need to standardize variables for serial communication

let song;
let fft;
let num;
let light = 0;
let lightA = 0;
let lightB = 0;
let lightC = 0;
let rippleA = 0;
let rippleB = 0;
let rippleC = 0;
let FR = 60; // 10 to 60
let blur = 3;
let BGbutton = 0;
let grain;
let alpha = 0.0; // 0 to 1
// background colors
let hue1 = 0; // 0 to 360
let sat1 = 0; // 0 to 100
let br1 = 0; // 0 to 230
// effect colors
let hue2 = 360; // 0 to 360
let sat2 = 100; // 0 to 100
let br2 = 230; // 0 to 230
let hue2A, hue2B, hue2C;

function preload() {
  song = loadSound("beach.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  createFilmGrain(0, 0, windowWidth, windowHeight, 500, 3);
  xCoord2 = 0;
  yCoord2 = windowHeight / 2;
  circleX = -100;
  circleY = -100;
  colorMode(HSB, 360, 100, 230, 100);
  num = windowWidth * 5;
  song.loop();

  fft = new p5.FFT();
  fft.setInput(song);
  for (var i = 0; i < 200; i++) {
    drop[i] = new Drop();
  }
  for (let i = 0; i <= num; i++) {
    bballs.push(
      new Ball(
        i / 2,
        random(5, 25),
        random(20, 50),
        random(0.3, 0.5),
        // random(240, 360),
        random(100, 200)
      )
    );
  }
}

function draw() {
  fft.analyze();
  amp = fft.getEnergy(10, 1050);
  frameRate(FR);
  background(hue1, sat1, br1);

  hue2A = random(abs(120 - hue2), hue2);
  hue2B = random(abs(120 - hue2), abs(240 - hue2));
  hue2C = random(abs(240 - hue2), abs(360 - hue2));

  myLight(200, 100, 230);
  myLightA(hue2A, sat2, br2);
  myLightB(hue2B, sat2, br2);
  myLightC(hue2C, sat2, br2);

  for (let i = 0; i < num; i++) {
    bballs[i].draw();
  }

  for (var i = 0; i < 200; i++) {
    drop[i].show();
    drop[i].update();
  }

  myRipple1(hue2A, sat2, br2);
  myRipple2(hue2B, sat2, br2);
  myRipple3(hue2C, sat2, br2);

  filter(BLUR, blur);
  if (BGbutton === 1) {
    filter(INVERT);
  }

  updateGrain();
  displayGrain();
}

function keyPressed() {
  if (key === " " && song.isPlaying()) {
    song.pause();
  } else if (key === " ") {
    song.loop();
  } else if (keyCode === LEFT_ARROW) {
    song.stop();
    song.loop();
  } else if (rippleA === 0 && key === "a") {
    X1 = random(0, windowWidth);
    Y1 = random(windowHeight / 5, windowHeight);
    circleSize1 = 0;
    opacity1 = 255;
  } else if (rippleB === 0 && key === "s") {
    X2 = random(0, windowWidth);
    Y2 = random(windowHeight / 5, windowHeight);
    circleSize2 = 0;
    opacity2 = 255;
  } else if (rippleC === 0 && key === "d") {
    X3 = random(0, windowWidth);
    Y3 = random(windowHeight / 5, windowHeight);
    circleSize3 = 0;
    opacity3 = 255;
  } else if (light === 0 && keyCode === ENTER) {
    light = 1;
  } else if (lightA === 0 && key === "z") {
    lightA = 1;
  } else if (lightB === 0 && key === "x") {
    lightB = 1;
  } else if (lightC === 0 && key === "c") {
    lightC = 1;
  }
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
  createFilmGrain(0, 0, windowWidth, windowHeight, 100, 3);
  xCoord2 = 0;
  yCoord2 = windowHeight / 2;
  fft = new p5.FFT();
  mic = new p5.AudioIn();
  mic.start();
  fft.setInput(song);
  wavefWidth = windowWidth;
  for (var i = 0; i < 200; i++) {
    drop[i] = new Drop();
  }
}

var drop = [];

function Drop() {
  this.x = random(0, windowWidth);
  this.y = random(0, -windowHeight);

  this.show = function () {
    stroke(hue2B, sat2, 230);
    noStroke();
    strokeWeight(0.5);
    fill(hue2B, sat2, 230);
    ellipse(this.x, this.y, random(5, 10), random(5, 10));
  };
  this.update = function () {
    this.speed = amp / 5;
    this.gravity = 1.05;
    this.y = this.y + this.speed * this.gravity;

    if (this.y > windowHeight) {
      this.y = random(0, -windowHeight);
      this.gravity = 0;
    }
  };
}

let bballs = [];

class Ball {
  constructor(xpos, ypos, w, dy, limit) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.w = w;
    this.dy = dy;
    this.color = random(abs(60 - hue2), hue2);
    this.limit = limit;
  }

  draw() {
    this.move(this.dy);

    noStroke();
    fill(this.color, 100, amp, 10);
    circle(this.xpos, this.ypos, this.w);
  }

  move() {
    if (this.ypos + this.w / 2 >= this.limit || this.ypos - this.w / 2 <= -20) {
      this.dy = -this.dy;
    }
    this.ypos += this.dy;
  }
}

let X1 = 0;
let Y1 = 0;
let X2 = 0;
let Y2 = 0;
let X3 = 0;
let Y3 = 0;
let circleSize1 = 0;
let circleSize2 = 0;
let circleSize3 = 0;
let opacity1 = 255;
let opacity2 = 255;
let opacity3 = 255;

function myRipple1(H, S, B) {
  circleSize1 += 10;
  opacity1 -= 3;
  noFill();
  strokeWeight(10);
  stroke(H, S, B, opacity1);
  circle(X1, Y1, circleSize1);
  circle(X1, Y1, circleSize1 * 0.75);
  circle(X1, Y1, circleSize1 * 0.5);
}

function myRipple2(H, S, B) {
  circleSize2 += 10;
  opacity2 -= 3;
  noFill();
  strokeWeight(10);
  stroke(H, S, B, opacity2);
  circle(X2, Y2, circleSize2);
  circle(X2, Y2, circleSize2 * 0.75);
  circle(X2, Y2, circleSize2 * 0.5);
}
function myRipple3(H, S, B) {
  circleSize3 += 10;
  opacity3 -= 3;
  noFill();
  strokeWeight(10);
  stroke(H, S, B, opacity3);
  circle(X3, Y3, circleSize3);
  circle(X3, Y3, circleSize3 * 0.75);
  circle(X3, Y3, circleSize3 * 0.5);
}

var xCoord1 = 0;
var yCoord1 = 0;
var xCoord2 = 0;
var yCoord2 = 0;

function myLight(H, S, B) {
  for (var i = 0; i < 300; i++) {
    xCoord1 = xCoord2;
    yCoord1 = yCoord2;
    xCoord2 = xCoord1 + int(random(-20, 20));
    yCoord2 = yCoord1 + int(random(-10, 20));
    if (light === 1) {
      stroke(H, S, B);
    } else {
      noStroke();
    }
    strokeWeight(random(3, 5));
    strokeJoin(MITER);
    line(xCoord1, yCoord1, xCoord2, yCoord2);

    if (
      (xCoord2 > windowWidth) |
      (xCoord2 < 0) |
      (yCoord2 > windowHeight) |
      (yCoord2 < 0)
    ) {
      xCoord2 = int(random(0, windowWidth));
      yCoord2 = 0;
    }
  }
}

function keyReleased() {
  if (light === 1 && keyCode === ENTER) {
    light = 0;
  } else if (lightA === 1 && key === "z") {
    lightA = 0;
  } else if (lightB === 1 && key === "x") {
    lightB = 0;
  } else if (lightC === 1 && key === "c") {
    lightC = 0;
  }
}

function myLightA(H, S, B) {
  for (var i = 0; i < 300; i++) {
    xCoord1 = xCoord2;
    yCoord1 = yCoord2;
    xCoord2 = xCoord1 + int(random(-20, 20));
    yCoord2 = yCoord1 + int(random(-10, 20));
    strokeWeight(random(3, 5));
    strokeJoin(MITER);
    line(xCoord1, yCoord1, xCoord2, yCoord2);

    if (
      (xCoord2 > windowWidth) |
      (xCoord2 < 0) |
      (yCoord2 > windowHeight) |
      (yCoord2 < 0)
    ) {
      if (lightA === 1) {
        strokeWeight(10);
        stroke(H, S, B);
      } else {
        noStroke();
      }
      xCoord2 = int(random(0, windowWidth));
      yCoord2 = 0;
    }
  }
}

function myLightB(H, S, B) {
  for (var i = 0; i < 300; i++) {
    xCoord1 = xCoord2;
    yCoord1 = yCoord2;
    xCoord2 = xCoord1 + int(random(-20, 20));
    yCoord2 = yCoord1 + int(random(-10, 20));
    strokeWeight(random(3, 5));
    strokeJoin(MITER);
    line(xCoord1, yCoord1, xCoord2, yCoord2);

    if (
      (xCoord2 > windowWidth) |
      (xCoord2 < 0) |
      (yCoord2 > windowHeight) |
      (yCoord2 < 0)
    ) {
      if (lightB === 1) {
        strokeWeight(10);
        stroke(H, S, B);
      } else {
        noStroke();
      }
      xCoord2 = int(random(0, windowWidth));
      yCoord2 = 0;
    }
  }
}

function myLightC(H, S, B) {
  for (var i = 0; i < 300; i++) {
    xCoord1 = xCoord2;
    yCoord1 = yCoord2;
    xCoord2 = xCoord1 + int(random(-20, 20));
    yCoord2 = yCoord1 + int(random(-10, 20));
    strokeWeight(random(3, 5));
    strokeJoin(MITER);
    line(xCoord1, yCoord1, xCoord2, yCoord2);

    if (
      (xCoord2 > windowWidth) |
      (xCoord2 < 0) |
      (yCoord2 > windowHeight) |
      (yCoord2 < 0)
    ) {
      if (lightC === 1) {
        strokeWeight(10);
        stroke(H, S, B);
      } else {
        noStroke();
      }
      xCoord2 = int(random(0, windowWidth));
      yCoord2 = 0;
    }
  }
}

function updateGrain() {
  grain.update();
}

function displayGrain() {
  grain.display();
}

function createFilmGrain(x, y, w, h, patternSize, sampleSize) {
  grain = new FilmGrainEffect(x, y, w, h, patternSize, sampleSize, alpha);
}
