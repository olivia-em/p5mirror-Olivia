// change grid size, bigger number means more cells
let squares = [];
// change frame rate, bigger number is faster
let f = 1;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  let angle = [0, PI, PI / 2, (3 * PI) / 2];
  let cA = [
    "#D74102",
    "#290431",
    "#DF1233",
    "red",
    "#CA2C09",
    "#1F1155",
    "#4D57DD",
    "#640124",
    "#A90E0C",
    "#002464",
    "#78BADB",
    "#F13450",
    "#EB712E",
    "#640124",
    "#002464",
    "#12A7F1",
  ];
  
  background(0);

  frameRate(f);

  for (let i = 0; i <= 20; i++) {
    squares.push(new Square(random(angle), random(angle), random(angle), random(angle), random(cA), random(cA), random(cA), random(cA)));
  }

  for (let i = 0; i < squares.length; i++) {
    squares[i].draw();
  }
}

class Square {
  constructor(angle1, angle2, angle3, angle4, color1, color2, color3, color4) {
    this.angle1 = angle1;
    this.color1 = color1;
    this.color2 = color2;
    this.angle2 = angle2;
    this.color3 = color3;
    this.color4 = color4;
    this.angle3 = angle3;
    this.angle4 = angle4;
  }

  draw() {
    for (let j = 0; j <= 20; j++) {
      let ypos = j * 20;
      for (let i = 0; i <= 20; i++) {
        let xpos = 20 * i;

        if ((i + j) % 3 == 0) {
          push();
          translate(xpos + 10, ypos + 10);
          rotate((3 * PI) / 2);
          noStroke();
          fill(this.color1);
          ellipse(0, 0, 20, 20);
          pop();
          push();
          translate(xpos, ypos);
          rotate(this.angle1);
          fill(this.color2);
          stroke(255);
          arc(0, 0, 20, 20, 0, PI / 2);
          ellipse((2 * 20) / 3, (2 * 20) / 3, 20 / 2, 20 / 2);
          pop();
        } else if ((i + j) % 3 == 1) {
          push();
          translate(xpos + 10, ypos + 10);
          rotate((3 * PI) / 2);
          noStroke();
          fill(this.color2);
          ellipse(0, 0, 20, 20);
          pop();
          push();
          translate(xpos, ypos);
          rotate(this.angle2);
          fill(this.color3);
          stroke(255);
          arc(0, 0, 20, 20, 0, PI / 2);
          ellipse((2 * 20) / 3, (2 * 20) / 3, 20 / 2, 20 / 2);
          pop();
        } else if ((i + j) % 3 == 2) {
          push();
          translate(xpos + 10, ypos + 10);
          rotate((3 * PI) / 2);
          noStroke();
          fill(this.color3);
          ellipse(0, 0, 20, 20);
          pop();
          push();
          translate(xpos, ypos);
          rotate(this.angle3);
          fill(this.color4);
          stroke(255);
          arc(0, 0, 20, 20, 0, PI / 2);
          ellipse((2 * 20) / 3, (2 * 20) / 3, 20 / 2, 20 / 2);
          pop();
        } else if ((i + j) % 3 == 3) {
          push();
          translate(xpos + 10, ypos + 10);
          rotate((3 * PI) / 2);
          noStroke();
          fill(this.color4);
          ellipse(0, 0, 20, 20);
          pop();
          push();
          translate(xpos, ypos);
          rotate(this.angle4);
          fill(this.color1);
          stroke(255);
          arc(0, 0, 20, 20, 0, PI / 2);
          ellipse((2 * 20) / 3, (2 * 20) / 3, 20 / 2, 20 / 2);
          pop();
        }
      }
    }
  }
}

// function saveDrawing() {
//   save("pattern.png");
// }
