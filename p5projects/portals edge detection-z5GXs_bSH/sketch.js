// Body segmentation variables
let bodySegmentation;
let video;
let segmentation;
let personImage;

let options = {
  maskType: "parts",
};

let portals = [];


function preload() {
  let images = 5;
  for (let i = 1; i < images + 1; i++) {
    let path = 'images/' + String(i) + '.jpeg';
    loadImage(path, 
      img => {
        portals.push(img);
        // console.log("Loaded:", path);
      }, 
      err => console.error("Failed to load:", path, err)
    );
  }

  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
}


function setup() {
  createCanvas(640, 480);
  // Create the video
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);

  // Create an image for segmented output
  personImage = createImage(video.width, video.height);
  
   // frameRate(5);
}

var ii = 0;

function draw() {
  background(0);

  image(video, 0, 0, 640, 480);

  // Display the segmented video grid
  if (segmentation) {
    copyForegroundPixels(video, segmentation.mask, personImage);
    image(personImage, 0, 0, width, height);
  }
}

// callback function for body segmentation
function gotResults(result) {
  segmentation = result;
}

function copyForegroundPixels(imgSource, imgMask, imgResult) {
  imgSource.loadPixels();
  imgMask.loadPixels();
  imgResult.loadPixels();

  const imgWidth = imgResult.width;
  const imgHeight = imgResult.height;
  const imgChannels = 4;

  const sourceWidth = imgSource.width;
  const sourceHeight = imgSource.height;

  const scaleX = sourceWidth / imgWidth;
  const scaleY = sourceHeight / imgHeight;

  let edgePoints = [];
  let totalX = 0, totalY = 0, count = 0;

  // Step 1: Compute Center of Mass (COM)
  for (let y = 0; y < imgHeight; y++) {
    for (let x = 0; x < imgWidth; x++) {
      let index = (y * imgWidth + x) * imgChannels;
      if (imgMask.pixels[index] !== 255) { // Foreground
        totalX += x;
        totalY += y;
        count++;
      }
    }
  }

  let centerX = count > 0 ? totalX / count : imgWidth / 2;
  let centerY = count > 0 ? totalY / count : imgHeight / 2;

  // Step 2: Find Edge Pixels and Lerp Background Colors
  for (let y = 1; y < imgHeight - 1; y++) {
    for (let x = 1; x < imgWidth - 1; x++) {
      let index = (y * imgWidth + x) * imgChannels;
      if (imgMask.pixels[index] !== 255) { // Foreground
        let isEdge = false;

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            let neighborIndex = ((y + dy) * imgWidth + (x + dx)) * imgChannels;
            if (imgMask.pixels[neighborIndex] === 255) { // Background neighbor
              isEdge = true;
              break;
            }
          }
          if (isEdge) break;
        }

        if (isEdge) {
          edgePoints.push({ x, y });

          // Sample background color from portals[2]
          let srcX = floor(x * scaleX);
          let srcY = floor(y * scaleY);
          let srcIndex = (srcY * sourceWidth + srcX) * imgChannels;
          let bgColor = color(
            imgSource.pixels[srcIndex],
            imgSource.pixels[srcIndex + 1],
            imgSource.pixels[srcIndex + 2]
          );

          // Step 3: Lerp Position Toward Center of Mass
          let lerpFactor = 0.0; // Adjust for stronger pull
          let newX = lerp(x, centerX, lerpFactor);
          let newY = lerp(y, centerY, lerpFactor);

          let newIdx = (floor(newY) * imgWidth + floor(newX)) * imgChannels;
          imgResult.pixels[newIdx] = red(bgColor);
          imgResult.pixels[newIdx + 1] = green(bgColor);
          imgResult.pixels[newIdx + 2] = blue(bgColor);
          imgResult.pixels[newIdx + 3] = 255;
        }
      }
    }
  }

  imgResult.updatePixels();
}