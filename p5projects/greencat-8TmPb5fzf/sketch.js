let img;

function preload() {
  img = loadImage("cat.jpg"); 
}

function setup() {
  createCanvas(img.width, img.height);
  img.loadPixels();
  
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      if ((x + y) % 2 === 0) { 
        img.pixels[index] = 0;     
        img.pixels[index + 1] = 255; 
        img.pixels[index + 2] = 0;   
      }
    }
  }
  
  let line1 = img.height / 2;
  for (let y = line1 - 5; y < line1 + 5; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      img.pixels[index] = 255;     
      img.pixels[index + 1] = 255; 
      img.pixels[index + 2] = 255; 
    }
  }
  
  let line2 = img.width / 2;
  for (let x = line2 - 5; x < line2 + 5; x++) {
    for (let y = 0; y < img.height; y++) {
      let index = (x + y * img.width) * 4;
      img.pixels[index] = 0;       
      img.pixels[index + 1] = 0;   
      img.pixels[index + 2] = 255; 
    }
  } 
  
  img.updatePixels();
  image(img, 0, 0);
}