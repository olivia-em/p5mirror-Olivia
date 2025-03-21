let glitchlen = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  
  if (frameCount % 60 === 0) {
     background(random(255), random(255), random(255));
    // new colored circle
    fill(random(255), random(255), random(255));
    ellipse(width / 2, height / 2, 300, 300);

    // random glitch pixel length
    glitchlen = int(random(4, 2400)) * 10;
  }
}

function keyPressed() {
  if ((key = "q")) {
    loadPixels();
    // channel shift?
    let channelshift = int(random(0, 4));
    // loop over chunks
    for (
      let i = 0;
      i < pixels.length - glitchlen;
      i = i + glitchlen
    ) {
      // set all pixels in chunk to color of the first pixel
      for (let p = channelshift; p < glitchlen; p += 4) {
        pixels[i + p] = pixels[i];
        pixels[i + p + 1] = pixels[i + 1];
        pixels[i + p + 2] = pixels[i + 2];
        //pixels[i+p+3] = pixels[i+3];
      }
    }
    updatePixels();
  }
}

// function glitch() {
//    loadPixels();
//   // channel shift?
//   let channelshift = int(random(0, 4));
//   // loop over chunks
//   for (
//     let i = pixels.length / 2;
//     i < pixels.length - glitchlen;
//     i = i + glitchlen
//   ) {
//     // set all pixels in chunk to color of the first pixel
//     for (let p = channelshift; p < glitchlen; p += 4) {
//       pixels[i + p] = pixels[i];
//       pixels[i + p + 1] = pixels[i + 1];
//       pixels[i + p + 2] = pixels[i + 2];
//       //pixels[i+p+3] = pixels[i+3];
//     }
//   }
//   updatePixels();
// }
