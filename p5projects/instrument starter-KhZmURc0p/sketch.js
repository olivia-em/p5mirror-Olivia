const blip = new SimplePlayer("sounds/blip.wav").toDestination();
const pink = new SimplePlayer("sounds/pink.wav").toDestination();
const takerimba = new SimplePlayer("sounds/takerimba.wav").toDestination();
const tears = new SimplePlayer("sounds/tears.wav").toDestination();

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);
  // console.log(tears.progress());

  // pink
  let x = map(pink.progress(), 0, 1, 0, width);
  fill("green");
  ellipse(x, height / 2, 50, 50);

  // tears
  let y = map(tears.progress(), 0, 1, 0, height);
  fill("red");
  ellipse(width / 2, y, 50, 50);
}

// function mouseClicked() {
//   if (loaded) {
//     blip.start();
//   }
// }

function keyTyped() {
  if (loaded) {
    if (key === "a") {
      blip.start();
    } else if (key === "s") {
      pink.start();
    } else if (key === "d") {
      takerimba.start();
    } else if (key === "f") {
      tears.start();
    }
  }
}

let loaded = false;

Tone.loaded().then(function () {
  loaded = true;
});



