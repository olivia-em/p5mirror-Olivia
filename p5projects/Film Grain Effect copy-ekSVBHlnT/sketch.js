/** inspired by
 * Coding Train - Daniel Shiffman
 *
 * 11.3: The Pixel Array - p5.js Tutorial
 * https://www.youtube.com/watch?v=nMUMZ5YRxHI
 *
 *
 * And
 *
 *
 * Szenia Zadvornykh
 *
 * Canvas film grain
 * https://codepen.io/zadvorsky/pen/PwyoMm
 *
 *
 */

let grain;

function setup() {
  let w = windowWidth;
  let h = windowHeight;
  createCanvas(w, h);

  createFilmGrain(0, 0, windowWidth, windowHeight, 500, 3, 0.1);
}

function draw() {
  background(220);
  fill(100,100,255)
  rect(200,200,200,200)
  updateGrain();
  displayGrain();
  
}

function updateGrain() {
  grain.update();
}

function displayGrain() {
  grain.display();
}

function createFilmGrain(x, y, w, h, patternSize, sampleSize, patternAlpha) {
  grain = new FilmGrainEffect(x, y, w, h, patternSize, sampleSize, patternAlpha);
}

