let invader1;
let floor;

function preload() {
  invader1=createSprite(50,50,32,32);
  invader1.spriteSheet='invaderBlue.png';
  // invader1.addAni({frameDelay:20,frames:4});
}

function createFloor() {
  floor = createSprite(width/2,height-20,400,20);
  floor.collider="static";
}
function setup() {
  createCanvas(400, 400);
  createFloor();
  world.gravity.y=1;
}

function draw() {
  clear();
}