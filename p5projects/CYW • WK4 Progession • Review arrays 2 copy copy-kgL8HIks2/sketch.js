let columnWidth;
let columnHeight;
let hues = [0,15,30];


function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB,360,100,100)
  columnWidth = width / 3;
  columnHeight = height / 3; 
 
}

function draw() {
  background(255,100,100);

  for (let counter = 0; counter < 3; counter++) {
    // let h = counter * 15;
    let h = hues[counter]
    let x = counter * columnWidth;
    let y = height / 4;
    
    fill(h,100,100)
    rect(x, y, columnWidth, columnHeight);
  }
}
