let portals = [];

function preload() {
  let images = 18;
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
}

function setup() {
  createCanvas(640, 480);
}

// var ii = 0;

function draw() {
  background(0);

// shift through all images in array

// if (portals.length > 0) {
//     image(portals[ii], 0, 0, 640, 480);
//     ii = (ii + 1) % portals.length; 
//   }
  
  image(portals[2], 0, 0, 640, 480);

}
