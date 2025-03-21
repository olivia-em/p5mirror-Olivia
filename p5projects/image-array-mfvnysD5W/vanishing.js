// // Body segmentation variables
// let bodySegmentation;
// let video;
// let segmentation;
// let personImage;

// let options = {
//   maskType: "parts",
// };

// let portals = [];
// let layeredImage; // off-screen graphics buffer for layering

// function preload() {
//   let images = 18;
//   for (let i = 1; i < images + 1; i++) {
//     let path = 'images/' + String(i) + '.jpeg';
//     loadImage(path, 
//       img => {
//         portals.push(img);
//       }, 
//       err => console.error("Failed to load:", path, err)
//     );
//   }

//   bodySegmentation = ml5.bodySegmentation("BodyPix", options);
// }

// function setup() {
//   createCanvas(640, 480);
//   // Create the video
//   video = createCapture(VIDEO);
//   video.size(640, 480);
//   video.hide();

//   bodySegmentation.detectStart(video, gotResults);

//   // Create an image for segmented output (if needed)
//   personImage = createImage(video.width, video.height);
  
//   // Create a graphics buffer to draw our layered effect
//   layeredImage = createGraphics(width, height);
// }

// var ii = 0;

// function draw() {
//   background(0);
  
//   // Draw the background image normally
//   image(portals[2], 0, 0, 640, 480);
  
//   // Display the segmented mask filled with layered images
//   if (segmentation) {
//     // Clear the off-screen graphics
//     layeredImage.clear();
    
//     // Number of layers and scale decrement
//     let numLayers = 5;
//     // Here we assume the vanishing point is the center; adjust offsets if needed.
//     for (let j = 0; j < numLayers; j++) {
//       // Each layer is drawn at a decreased scale
//       let scaleFactor = 1 - j * 0.15; // adjust 0.15 to change the decrement
//       let imgW = width * scaleFactor;
//       let imgH = height * scaleFactor;
//       // Center the image so they converge toward the center (vanishing point)
//       let offsetX = (width - imgW) / 2;
//       let offsetY = (height - imgH) / 2;
      
//       layeredImage.image(portals[2], offsetX, offsetY, imgW, imgH);
//     }
    
//     // Get the layered composition as a p5.Image so we can apply the mask
//     let layeredImg = layeredImage.get();
//     layeredImg.mask(segmentation.mask);
    
//     // Draw the masked layered image on top
//     image(layeredImg, 0, 0, width, height);
//   }
// }

// // callback function for body segmentation
// function gotResults(result) {
//   segmentation = result;
// }


