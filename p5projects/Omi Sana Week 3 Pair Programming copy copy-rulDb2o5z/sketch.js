/*
Part 1
1. Do some debugging. Unscramble the code to create what you see on the screen. One thing at a time. Start with what you recognize.

2. (Extra) Add color in some way
*/

let total = 30;

let seed = 1000

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  background(255);

  //strokeWeight(2);
}

function draw() {
  // randomSeed (seed)
  let columnWidth;
  columnWidth = width / total;

  for (let counter = 0; counter < total; counter++) {
    let x = counter * columnWidth;
    let y = height / 4;
    let colHeight = height / 3;
    fill(random (255), 0 + (counter*10), 100);
    rect(x, y, columnWidth, colHeight, counter);
    
    frameRate (12)
  }
}
// function mousePressed (){
// seed = random (1000)
// }



