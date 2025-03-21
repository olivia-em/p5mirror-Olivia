// function copyForegroundPixels(imgSource, imgMask, imgResult) {
//   imgSource.loadPixels();
//   imgMask.loadPixels();
//   imgResult.loadPixels();

//   const imgWidth = imgResult.width;
//   const imgHeight = imgResult.height;
//   const imgChannels = 4;
  
//   const sourceWidth = imgSource.width;
//   const sourceHeight = imgSource.height;
  
//   const scaleX = sourceWidth / imgWidth;
//   const scaleY = sourceHeight / imgHeight;

//   let edgePoints = []; // Store edge points

//   for (let y = 1; y < imgHeight - 1; y++) {
//     for (let x = 1; x < imgWidth - 1; x++) {
//       let index = (y * imgWidth + x) * imgChannels;
//       let maskR = imgMask.pixels[index];

//       // Check if the current pixel is part of the person
//       if (maskR !== 255) {
//         // Check if any neighbor is part of the background
//         let isEdge = false;
//         for (let dy = -1; dy <= 1; dy++) {
//           for (let dx = -1; dx <= 1; dx++) {
//             let neighborIndex = ((y + dy) * imgWidth + (x + dx)) * imgChannels;
//             if (imgMask.pixels[neighborIndex] === 255) {
//               isEdge = true;
//               break;
//             }
//           }
//           if (isEdge) break;
//         }

//         if (isEdge) {
//           edgePoints.push({ x, y });

//           // Extract background color (assuming portals[2] is the background)
//           let srcX = floor(x * scaleX);
//           let srcY = floor(y * scaleY);
//           let srcIndex = (srcY * sourceWidth + srcX) * imgChannels;

//           let bgColor = {
//             r: imgSource.pixels[srcIndex],
//             g: imgSource.pixels[srcIndex + 1],
//             b: imgSource.pixels[srcIndex + 2]
//           };

//           console.log(`Edge at (${x}, ${y}) - Background color:`, bgColor);
//         }
//       }
//     }
//   }

//   imgResult.updatePixels();
// }

// Copy foreground pixels from the video based on the mask
// function copyForegroundPixels(imgSource, imgMask, imgResult) {
//   imgSource.loadPixels();
//   imgMask.loadPixels();
//   imgResult.loadPixels();

//   const imgWidth = imgResult.width;
//   const imgHeight = imgResult.height;
//   const imgChannels = 4;

//   const sourceWidth = imgSource.width;
//   const sourceHeight = imgSource.height;

//   const scaleX = sourceWidth / imgWidth;
//   const scaleY = sourceHeight / imgHeight;

//   for (let y = 0; y < imgHeight; y++) {
//     for (let x = 0; x < imgWidth; x++) {
//       let index = (y * imgWidth + x) * imgChannels;
//       let maskR = imgMask.pixels[index];
//       let maskG = imgMask.pixels[index + 1];
//       let maskB = imgMask.pixels[index + 2];

//       // Map coordinates to the source image
//       let srcX = floor(x * scaleX);
//       let srcY = floor(y * scaleY);
//       let srcIndex = (srcY * sourceWidth + srcX) * imgChannels;

//       if (maskR === 255 && maskG === 255 && maskB === 255) {
//         // If the mask is white, make pixel transparent
//         imgResult.pixels[index] = 0;
//         imgResult.pixels[index + 1] = 0;
//         imgResult.pixels[index + 2] = 0;
//         imgResult.pixels[index + 3] = 0;
//       } else {
//         // Map pixels from portals[2] properly
//         imgResult.pixels[index] = imgSource.pixels[srcIndex];
//         imgResult.pixels[index + 1] = imgSource.pixels[srcIndex + 1];
//         imgResult.pixels[index + 2] = imgSource.pixels[srcIndex + 2];
//         imgResult.pixels[index + 3] = 255; // Full opacity
//       }
//     }
//   }

//   imgResult.updatePixels();
// }
