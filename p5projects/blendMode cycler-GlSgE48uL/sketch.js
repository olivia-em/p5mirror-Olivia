function createBlendModeCycler(modes) {
  let index = 0;
  
  return function () {
    blendMode(modes[index]);
    console.log("Current Blend Mode:", modes[index]);
    index = (index + 1) % modes.length;
  };
}

// Usage in a sketch
let cycleBlendMode;

function setup() {
  createCanvas(400, 400);
  // blendMode(BLEND)
  // background(220);
  cycleBlendMode = createBlendModeCycler([
    BLEND, ADD, DARKEST, LIGHTEST, DIFFERENCE, EXCLUSION, MULTIPLY, SCREEN, REPLACE, HARD_LIGHT, SOFT_LIGHT,DODGE,OVERLAY,BURN
  ]);
}

function draw() {
 
  fill(255, 0, 0,);
  ellipse(200, 200, 150);
  
  fill(0, 0, 255);
  rect(150, 150, 100);
}

function keyPressed() {
  if (key === ' ') {
    cycleBlendMode();
  }
}
