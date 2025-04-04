// https://editor.p5js.org/Jennybkowalski/sketches/N-geQ3DRx
let font;
let textA = "he had just been\na concept";
let textB = "you put words\nto the page";
let currentText = textA;
let nextText = textB;
let lerpAmt = 0;
let transitioning = false;

function preload() {
  font = loadFont("Staatliches-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  blendMode(BLEND);
  background("black");
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(50);
  orbitControl();
  //rotateY(map(frameCount, 0, 600, 0, TWO_PI));
  //rotateY(map(mouseX,0,height,0,TWO_PI));

  push();

  // Interpolating the opacity for smooth transition
  let lerpAlpha = lerp(255, 0, lerpAmt);
  let nextAlpha = lerp(0, 255, lerpAmt);

  //Display current text
    push()
  for (let i = 0; i <=200; i=i+20) {
    push()
    translate(0,0,i)
  //fill(255, lerpAlpha);
    fill(255, 0,255,i);
    text(textA, 0, 0);
    pop()
  }
    push()
  rotateY(PI)
for (let i = 200; i >=0; i=i-20) {
    push()
    translate(0,0,i)
   // fill(255, lerpAlpha);
    fill(255, 0,255,i);
    text(textB, 0, 0);
    pop()
  }
  pop()


  // Display next text fading in
  fill(255, nextAlpha);
  text(nextText, 0, 0);

  pop();

  // Handle the transition progress
  if (transitioning) {
    lerpAmt += 0.02; // Speed of transition
    if (lerpAmt >= 1) {
      lerpAmt = 0;
      transitioning = false;
      // Swap texts
      let temp = currentText;
      currentText = nextText;
      nextText = temp;
    }
  }
}

// // Trigger text change when mouse is pressed
// function mousePressed() {
//   if (!transitioning) {
//     transitioning = true;
//   }
// }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
