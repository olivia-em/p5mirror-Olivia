var ims = [];
var ii = 0;

function preload() {
  let images = 35;
  for (let i = 0; i < images; i++) {
    let path = 'images/' + String(i) + '.jpg'; // Corrected str() issue
    let loaded_image = loadImage(path); // Use let for local scope
    ims.push(loaded_image);
  }
}

function setup() {
  if (ims.length > 0) {
    createCanvas(ims[0].width, ims[0].height); // Ensure ims[0] is defined
  } else {
    createCanvas(400, 400); // Fallback in case images fail to load
  }
  frameRate(5);
}

function draw() {
  if (ims.length > 0) {
    image(ims[ii], 0, 0);
    ii = (ii + 1) % ims.length; // Ensure it loops correctly
  }
}
