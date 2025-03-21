palette = [
  (31, 41, 82),
  (192, 3, 51),
  (3, 2, 6),
  (89, 24, 79),
  (255, 87, 75),
  (120, 186, 219),
];

function setup() {
  createCanvas(400, 400);

  describe('A gray cloudy pattern that changes.');
}

function draw() {
  // Set the noise level and scale.
  let noiseLevel = 255;
  let noiseScale = 0.015;

  // Iterate from top to bottom.
  for (let y = 0; y < 100; y += 1) {
    // Iterate from left to right.
    for (let x = 0; x < width; x += 1) {
      // Scale the input coordinates.
      let nx = noiseScale * x;
      let ny = noiseScale * y;
      let nt = noiseScale * frameCount;

      // Compute the noise value.
      let c = noiseLevel * noise(nx, ny, nt);

      // Draw the point.
      stroke(c);
      point(x, y);
    }
  }
}