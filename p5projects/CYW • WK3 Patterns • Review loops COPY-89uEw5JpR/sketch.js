/*

Assemble and modify:
1. Unscramble and assemble the code to create something like this:
https://printablee.com/postpic/2015/04/free-printable-grid-paper_18888.png

2. Add some random variation, for example:

- Change some of the elements to be different from the others
- Or maybe all the elements are different from each other
- Or replace an element with an entirely new one

*/

let cellSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
}

function draw() {
  background(255);
  strokeWeight(2);
  noFill();
  cellSize = min(width / 10, height / 10);
  
  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      square(x, y, cellSize);
    }
  }
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}













