let bballs = [];
let num = 20;
let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

function setup() {
  createCanvas(400, 400);

  for (let i = 0; i <= num; i++) {
    bballs.push(
      new Ball(
        random(50, 300),
        random(50, 300),
        random(10, 50),
        random(2, 4),
        random(2, 4),
        random(colors),
        false
      )
    );
  }
}

function draw() {
  background(0);
  for (let i = 0; i < bballs.length; i++) {
    bballs[i].draw();
    if (mouseOverBall(bballs[i])) {
      bballs.splice(i, 1);
    }
  }
}
function mouseOverBall(Ball) {
  let d = dist(mouseX, mouseY, Ball.xpos, Ball.ypos);
  return d < 25;
}

class Ball {
  constructor(xpos, ypos, w, dx, dy, ccolor, following) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.w = w;
    this.dx = dx;
    this.dy = dy;
    this.color = ccolor;
    this.following = following;
    this.speed = 0.1;
  }

  draw() {
    this.move(this.dx, this.dy);
    fill(this.color);
    circle(this.xpos, this.ypos, this.w);
  }

  move() {
    if (this.following) {
      this.follow();
    } else {
      this.bounce();
    }
  }

  follow() {
    this.xpos = lerp(this.xpos, mouseX, this.speed);
    this.ypos = lerp(this.ypos, mouseY, this.speed);
  }
  bounce() {
    if (this.xpos + this.w / 2 >= 400 || this.xpos - this.w / 2 <= 0) {
      this.dx = -this.dx;
    }
    if (this.ypos + this.w / 2 >= 400 || this.ypos - this.w / 2 <= 0) {
      this.dy = -this.dy;
    }

    this.xpos += this.dx;
    this.ypos += this.dy;
  }
}

function mousePressed() {
  let clickBall = new Ball(
    mouseX,
    mouseY,
    random(10, 50),
    random(1, 5),
    random(1, 5),
    "blue",
    true
  );
  bballs.push(clickBall);
}

// function mouseOverBall(Ball) {
//   let d = dist(mouseX, mouseY, Ball.xpos, Ball.ypos);
//   return d < 25;
// }
