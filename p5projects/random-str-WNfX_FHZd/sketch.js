let str = "I wish to wash my Irish wristwatch.";

let index = 0;

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER);
  textFont("Courier New", 36);
  textStyle(ITALIC);
  background(random(255), random(255), random(255));
}

function draw() {
  for (index = 0; index <= str.length; index++) {
    let ch = str.charAt(index);
    let x = random(20, width - 20);
    let y = random(20, height - 20);
    fill(random(0, 255), random(0, 255), random(0, 255));
    text(ch, x, y);
  }
  noLoop();
}
