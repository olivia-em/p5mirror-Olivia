function setup() {
  createCanvas(400, 400);
  // createCanvas(800, 600);
  rectMode(CENTER);
}

function draw() {
  gradientBG(0, 0, width, height);
  drawClock(210, 180);
  // drawClock(400, 400);
}

function drawClock(xpos, ypos) {
  // draw clock box
  strokeWeight(1);
  stroke("#1B9E2C");
  fill("#091357");
  for (i = 0; i < 25; i++) {
    rect(xpos - i, ypos + i, 350, 150, 10);
  }
  stroke("#B3097A");
  strokeWeight(4);
  fill("#D10043");
  for (j = 1; j < 2; j++) {
    rect(xpos - 185 + 50 * j, ypos + 24, 80, 75, 10);
    rect(xpos - 75 + 50 * j, ypos + 24, 80, 75, 10);
    rect(xpos + 35 + 50 * j, ypos + 24, 80, 75, 10);
  }
  // Sets up clock counter with formatting
  stroke("#00AAA1");
  fill("#091357");
  textAlign(CENTER, CENTER);
  textSize(60);
  if (hour() < 10) {
    text("0" + hour(), xpos - 135, ypos + 27);
  } else {
    text(hour(), xpos - 135, ypos + 27);
  }
  if (minute() < 10) {
    text("0" + minute(), xpos - 25, ypos + 27);
  } else {
    text(minute(), xpos - 25, ypos + 27);
  }
  if (second() < 10) {
    text("0" + second(), xpos + 85, ypos + 27);
  } else {
    text(second(), xpos + 85, ypos + 27);
  }
}

function gradientBG(x, y, w, h) {
  let day1 = color(255, 87, 69);
  let day2 = color(194, 37, 196);
  let night2 = color(13, 8, 41);
  let night1 = color(194, 37, 196);
  noFill();
  // daylight hours
  if (hour() >= 5 && hour() <= 18) {
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(day1, day2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } // nighttime hours
  else {
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(night1, night2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  }
}
