let glitchlen = 0;
let originalImage;

function setup() {
  createCanvas(400, 400);
  saveOriginalState();
}

function draw() {
  if (frameCount % 60 === 0) {
    // Generate a new background and ellipse every second
    background(random(255), random(255), random(255));
    fill(random(255), random(255), random(255));
    ellipse(width / 2, height / 2, 300, 300);

    // Save the current canvas as the "original" image
    saveOriginalState();

    // Random glitch pixel length
    glitchlen = int(random(4, 2400)) * 10;
  }
}

function keyPressed() {
  if (key === "q") {
    loadPixels();
    // Random channel shift
    let channelshift = int(random(0, 4));
    // Loop over chunks
    for (let i = 0; i < pixels.length - glitchlen; i += glitchlen) {
      // Apply glitch by setting all pixels in chunk to the color of the first pixel
      for (let p = channelshift; p < glitchlen; p += 4) {
        pixels[i + p] = pixels[i];
        pixels[i + p + 1] = pixels[i + 1];
        pixels[i + p + 2] = pixels[i + 2];
        // pixels[i + p + 3] = pixels[i + 3]; // Optional alpha channel
      }
    }
    updatePixels();
  }
}

function keyReleased() {
  if (key === "q") {
    // Restore the original canvas when 'q' is released
    image(originalImage, 0, 0);
  }
}

function saveOriginalState() {
  // Save the current canvas as an image
  originalImage = get();
}


