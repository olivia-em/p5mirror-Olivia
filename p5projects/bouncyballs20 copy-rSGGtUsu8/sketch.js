let bballs = [];
let num = 800;

function setup() {
  createCanvas(400, 400);

  for (let i = 0; i <= num; i++) {
    bballs.push(
      new Ball(
        i/2,
        random(-5,15),
        random(10, 25),
        random(0.3,0.5),
        random(0,255)
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
  constructor(xpos, ypos, w, dy, ccolor) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.w = w;
    this.dy = dy;
    this.color = ccolor;
  }

  draw() {
    this.move(this.dy);
    noStroke();
    fill(this.color,20);
    circle(this.xpos, this.ypos, this.w);
  }

  move() {
    if (this.ypos + this.w / 2 >= 40 || this.ypos - this.w / 2 <= -20) {
      this.dy = -this.dy;
    }
    this.ypos += this.dy;
  }
}
