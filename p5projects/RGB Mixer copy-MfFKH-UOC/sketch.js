let sliders = [];

function setup() {
  createCanvas(600, 600);

  let colArgs = [
    color(255, 0, 0), 
    color(0, 255, 0), 
    color(0, 0, 255)
  ];

  for (let i = 0; i < 3; i++) {
    sliders[i] = new Slider(colArgs[i], i);
  }
}

function draw() {
  let r = sliders[0].val;
  let g = sliders[1].val;
  let b = sliders[2].val;
  
  background(r, g, b);

  for (let slider of sliders) {
    slider.display();

    if (mouseX > slider.x && mouseX < slider.x + width / 3) {
      let mappedY = map(mouseY, 0, height, height, 0);
      slider.h = mappedY;
      cursor(HAND);
    }
  }
}

class Slider {
  constructor(_color, _num) {
    this.num = _num;
    this.color = _color;
    this.x = (width / 3) * _num;
    this.h = 20;
    this.val = 0;
  }

  display() {
    noStroke();
    fill(this.color);
    rect(this.x, height, width / 3, -this.h);

    fill(255);
    textSize(20);
    textAlign(CENTER);
    this.val = floor(map(this.h, 0, height, 0, 255, true));
    text(this.val, this.x + width / 6, 560);
  }
}
