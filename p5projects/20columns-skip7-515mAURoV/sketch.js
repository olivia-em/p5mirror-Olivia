function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);

  let W;
  let num = 20;
  let mycolor1 = "red";
  let mycolor2 = "blue";
  let i = 0;

  W = width / num;

  while (i < num) {
    let xpos = i * W;
    
    if (i==6) {
      i++
      continue
    }

    if (mouseX > xpos && mouseX < xpos + W) {
      fill(mycolor1);
    } else {
      fill(255);
    } 
      
    rect(xpos, 0, W, height);
    i += 1;
  }
}
