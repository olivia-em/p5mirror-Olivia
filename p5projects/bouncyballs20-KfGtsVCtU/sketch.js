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
        random(colors)
      )
    );
  }
}

function draw() {
  background(0);
  for (let i = 0; i < num; i++) {
    bballs[i].draw();
  }
}

class Ball {
  constructor(xpos, ypos, w, dx, dy, ccolor) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.w = w;
    this.dx = dx;
    this.dy = dy;
    this.color = ccolor;
  }

  draw() {
    this.move(this.dx, this.dy);
    fill(this.color);
    circle(this.xpos, this.ypos, this.w);
  }

  move() {
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
