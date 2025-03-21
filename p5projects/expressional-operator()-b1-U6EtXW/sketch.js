let myYellow = "#FFEF66";
let myGrey = "#808080";
let myBlack = "#323232";
let cubetopHeight = 20;
let cubeWidth = 60;
let cubeHeight = 40;
let xOffset = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  noStroke();
  
  for (let x = 0; x < width + cubeWidth; x += cubeWidth) {
    for (let y = 0; y < height + cubeWidth; y += cubeHeight + cubetopHeight / 2) {
      // Even rows are offset to the left
      xOffset = (y / (cubeHeight + cubetopHeight / 2)) % 2 === 0 ? -cubeWidth / 2 : 0;

      // Check if the mouse is over the cube
      let isMouseOver = mouseX > x + xOffset && mouseX < x + xOffset + cubeWidth &&
                        mouseY < y + cubetopHeight + cubeHeight &&
                        mouseY > y + cubetopHeight / 2;

      // Set the color based on mouse position
      if (isMouseOver) {
        fill(255, 0, 0); // Change all to red
      } else {
        fill(myGrey); // Default to grey for the top parallelogram
      }

      // The top parallelogram
      quad(x + xOffset, cubetopHeight / 2 + y, 
           cubeWidth / 2 + x + xOffset, y, 
           cubeWidth + x + xOffset, cubetopHeight / 2 + y, 
           cubeWidth / 2 + x + xOffset, cubetopHeight + y);

      // The left parallelogram
      fill(isMouseOver ? color(255, 0, 0) : myYellow); // Change left parallelogram to red if hovered
      quad(x + xOffset, cubetopHeight / 2 + y, 
           cubeWidth / 2 + x + xOffset, cubetopHeight + y, 
           cubeWidth / 2 + x + xOffset, cubetopHeight + cubeHeight + y, 
           x + xOffset, cubetopHeight / 2 + cubeHeight + y);

      // The right parallelogram
      fill(isMouseOver ? color(255, 0, 0) : myBlack); // Change right parallelogram to red if hovered
      quad(cubeWidth / 2 + x + xOffset, cubetopHeight + y, 
           cubeWidth + x + xOffset, cubetopHeight / 2 + y, 
           cubeWidth + x + xOffset, cubetopHeight / 2 + cubeHeight + y, 
           cubeWidth / 2 + x + xOffset, cubetopHeight + cubeHeight + y);
    }
  }
}