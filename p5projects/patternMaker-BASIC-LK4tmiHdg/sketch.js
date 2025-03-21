// patternMaker - Basic

// change the grid size; increase the number for more cells
let num = 10;
// change the framerate; increase the number to go faster
let f = 1;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);
  // adjust the speed of the framerate
  frameRate(f);

  // determine the size of grid by adjusting the width of the squares to be a ratio of the canvas dimensions and desired number of cells
  let W = width / num;
  let H = height / num;

  // create an angle array, which randomly updates with the framerate
  let angle = random([0, PI, PI / 2, (3 * PI) / 2]);

  // this nested forloop creates a grid of rotating squares
  for (let j = 0; j <= height / H; j++) {
    let ypos = j * H; // y direction
    for (let i = 0; i <= width / W; i++) {
      let xpos = W * i; // x direction

      push();
      translate(xpos, ypos); // rotate within the bounds of the square
      rotate(angle); // rotate random angle 1
      fill(255);
      stroke(255);
      arc(0, 0, W, H, 0, PI / 2);
      ellipse((2 * W) / 3, (2 * H) / 3, W / 2, H / 2);
      pop();
    }
  }
}
