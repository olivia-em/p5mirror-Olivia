function setup() {
  createCanvas(200, 200);
}

function draw() {
  for (x=0;x<=200;x++) {
    for (y=0;y<200;y++){
      stroke(255,0,0);
      point(x,y);
    }
  }
}