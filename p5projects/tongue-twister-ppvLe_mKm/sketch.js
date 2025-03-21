let myTwister;
let allWords = [];

function preload() {
  myTwister = loadStrings("/twister.txt");
}

function setup() {
  createCanvas(625, 200);
  background(200);
  textFont("Courier New", 14);
  textStyle(BOLDITALIC);
  background(0);
}

function draw() {
  // split lines
  for (let i = 0; i < myTwister.length; i++) {
    let words = splitTokens(myTwister[i]);
    for (let j = 0; j < words.length; j++) {
      append(allWords, words[j]);
    }
  }
  shuffle(allWords, true);

  // five lines of text with 10-13 words per line
  let y = 40;
  for (let i = 0; i < 5; i++) {
    let lineLength = int(random(10, 13)); // Random length between 10 and 13 words
    let lineWords = allWords.splice(0, lineLength); // get words
    let newLine = join(lineWords, " "); // Join words into a single string
    fill(random(0, 255), random(0, 255), random(0, 255));
    text(newLine, 10, y); // Draw the line on the canvas
    y += 30; // Move y-coordinate for the next line
  }
  noLoop();
}
