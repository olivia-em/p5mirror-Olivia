// patternMaker

function setup() {
  createCanvas(400, 400);

  // create a button so you can save the pattern
  button = createButton("save pattern :)");
  button.position(10, height + 10);
  button.mousePressed(saveDrawing);
}

function draw() {
  // generate a random color palette and random angle
  let angles = [0, PI, PI / 2, (3 * PI) / 2];
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

  background(random(cA)); // change the background in every frame to a random color

  // adjust the speed of the framerate
  frameRate(1);

  drawPattern(
    random(cA),
    random(cA),
    random(cA),
    random(cA),
    random(angles),
    random(angles),
    random(angles),
    random(angles)
  );
}

// function to create grid pattern

function drawPattern(color1, color2, color3, color4, ang1, ang2, ang3, ang4) {
  // change the grid size; increase the number for more cells
  let num = 10;
  // determine the size of grid by adjusting the width & height of the squares to be a ratio of the canvas dimensions and desired number of cells
  let W = width / num;
  let H = height / num;

  // this nested forloop creates a grid of rotating squares
  for (let j = 0; j <= height / H; j++) {
    let ypos = j * H; // y direction
    for (let i = 0; i <= width / W; i++) {
      let xpos = W * i; // x direction

      // the orientation and style of the squares will repeat after four iterations, so there must be four versions of the design created using if statements and a modulus

      if ((i + j) % 3 == 0) {
        // random orientation 1

        // there are a few designs in each square
        push();
        // move the rotation origin so this shape appears within the square
        translate(xpos + W / 2, ypos + H / 2);
        rotate((3 * PI) / 2);
        noStroke();
        fill(color1); // fill random color one
        ellipse(0, 0, W, H); // the base circle
        pop();

        push();
        translate(xpos, ypos);
        rotate(ang1); // rotate random angle 1
        fill(color2);
        stroke(255);
        arc(0, 0, W, H, 0, PI / 2);
        ellipse((2 * W) / 3, (2 * H) / 3, W / 2, H / 2);
        pop();
      } else if ((i + j) % 3 == 1) {
        // random orientation 2
        push();
        translate(xpos + W / 2, ypos + H / 2);
        rotate((3 * PI) / 2);
        noStroke();
        fill(color2);
        ellipse(0, 0, W, H);
        pop();

        push();
        translate(xpos, ypos);
        rotate(ang2);
        fill(color4);
        stroke(255);
        arc(0, 0, W, H, 0, PI / 2);
        ellipse((2 * W) / 3, (2 * H) / 3, W / 2, H / 2);
        pop();
      } else if ((i + j) % 3 == 2) {
        // random orientation 3

        push();
        translate(xpos + W / 2, ypos + H / 2);
        rotate((3 * PI) / 2);
        noStroke();
        fill(color4);
        ellipse(0, 0, W, H);
        pop();

        push();
        translate(xpos, ypos);
        rotate(ang3);
        fill(color1);
        stroke(255);
        arc(0, 0, W, H, 0, PI / 2);
        ellipse((2 * W) / 3, (2 * H) / 3, W / 2, H / 2);
        pop();
      } else if ((i + j) % 4 == 3) {
        // random orientation 4

        push();
        translate(xpos + W / 2, ypos + H / 2);
        rotate((3 * PI) / 2);
        noStroke();
        fill(color4);
        ellipse(0, 0, W, H);
        pop();

        push();
        translate(xpos, ypos);
        rotate(ang4);
        fill(color2);
        stroke(255);
        arc(0, 0, W, H, 0, PI / 2);
        ellipse((2 * W) / 3, (2 * H) / 3, W / 2, H / 2);
        pop();
      }
    }
  }
}

// function to create & save a specific path name

function saveDrawing() {
  save("pattern.png");
}
