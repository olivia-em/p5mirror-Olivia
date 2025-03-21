let W;
let num = 20;
let colors = [];

function setup() {
  createCanvas(400, 400);
  W = width / num;
  for (let i = 0; i < num; i++) {
    colors.push(255); 
  }
}

function draw() {
  background(255);
  for (let i = 0; i < width; i+=W) {
    let xpos = i/W;
    fill(colors[xpos]);
    rect(i, 0, W, height);
  }
}

function mousePressed() {
  for (let i = 0; i < width; i+=W) {
    let xpos = i/W;
    if (mouseX > i && mouseX < i + W) {
      if (colors[xpos] === 255) {
        colors[xpos] = color(255, 0, 0); 
      } else {
        colors[xpos] = 255; 
      }

    }
  }
}


