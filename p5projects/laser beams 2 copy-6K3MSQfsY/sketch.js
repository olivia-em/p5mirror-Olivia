let xLength = 500;
let yLength = 500;

let numLines = 28;
let xDist = 11;

//sliders
let distSlider;
let colorSlider;
let lineSlider;


let leftLine = {
  x1 : 0,
  y1 : yLength,
  x2 : xLength,
  y2 : 0
}

let rightLine = {
  x1 : xLength,
  y1 : yLength,
  x2 : 0,
  y2 : 0
}

function setup() {
  createCanvas(xLength, yLength);
  
  //sliders
  distSlider = createSlider(1, 20, 3);
  colorSlider = createSlider(1, 200, 1);
  lineSlider = createSlider(1, 30, 10);
}

function draw() {
  background(0);
  vertLine1();
  vertLine2();
	vertLine3();
  vertLine4();
}

function vertLine1() {
  strokeWeight(1);
  stroke(10, 255, 155);
  let x2 = xLength;
  line(leftLine.x1, leftLine.y1, leftLine.x2, leftLine.y2);
  for (let i = 0; i < lineSlider.value(); i++) {
    line(leftLine.x1, leftLine.y1, x2, leftLine.y2);
    let shiftX = -(distSlider.value());
    x2 += shiftX; 
  }
  
}

function vertLine2() {
  strokeWeight(1);
  stroke(colorSlider.value(), 10, 155);
  let x2 = 0;
  line(rightLine.x1, rightLine.y1, rightLine.x2, rightLine.y2);
  for (let i = 0; i < lineSlider.value(); i++) {
    line(rightLine.x1, rightLine.y1, x2, rightLine.y2);
    let shiftX = distSlider.value();
    x2 += shiftX;
  }
}

function vertLine3() {
  strokeWeight(1);
  stroke(10, 255, 155);
  let x2 = xLength;
  line(leftLine.x1, leftLine.y2, leftLine.x2, leftLine.y1);
  for (let i = 0; i < lineSlider.value(); i++) {
    line(leftLine.x1, leftLine.y2, x2, leftLine.y1);
    let shiftX = -(distSlider.value());
    x2 += shiftX; 
  }
}

function vertLine4() {
  strokeWeight(1);
  stroke(colorSlider.value(), 10, 155);
  let x2 = 0;
  line(rightLine.x1, rightLine.y2, rightLine.x2, rightLine.y1);
  for (let i = 0; i < lineSlider.value(); i++) {
    line(rightLine.x1, rightLine.y2, x2, rightLine.y1);
    let shiftX = distSlider.value();
    x2 += shiftX;
  }
}
  
  
  
  
  
  
  
  
  