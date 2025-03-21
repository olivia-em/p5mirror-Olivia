let cols = 5; // Number of columns in the grid
let rows = 5; // Number of rows in the grid
let cellWidth, cellHeight;
let video;
let buffers = [];

function setup() {
  createCanvas(800, 800);
  video = createCapture(VIDEO);
  video.size(width, height); // Capture video at the canvas resolution
  video.hide();

  // Initialize buffers for each grid cell
  for (let i = 0; i < cols * rows; i++) {
    buffers.push([]);
  }

  cellWidth = width / cols;
  cellHeight = height / rows;
}

function draw() {
  background(0);

  // Capture current frame
  video.loadPixels();
  let currentFrame = video.get(); // Get the full-resolution frame

  // Add the current frame to each buffer
  for (let i = 0; i < buffers.length; i++) {
    buffers[i].push(currentFrame);

    // Limit the buffer size to create delay
    if (buffers[i].length > (i + 1) * 5) {
      buffers[i].shift();
    }
  }

  // Draw the delayed frames
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;

      // Check if the buffer has a delayed frame to display
      if (buffers[index].length > 0) {
        let frameToShow = buffers[index][0];
        image(frameToShow, x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  }
}
