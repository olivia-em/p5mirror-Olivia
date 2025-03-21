let floor;
let img1;

let mySkulls;

let skullNum = 2;

function preload() {
  img1 = loadImage("skullsprite.png");
}
function setup() {
  createCanvas(400, 400);

  mySkulls = new Group();
  for (let i = 0; i < skullNum; i++) {
    let s = new mySkulls.Sprite(
      random(width),
      random(height),
      img1.width,
      img1.height
    );
    s.image = "skullsprite.png";
  }
  
  world.gravity.y = 4;
  // set a diameter of 30 creates a circle

  // invader1=createSprite(100,100,img1.width,img1.height);
  mySkulls.image = "skullsprite.png";
  invader2 = createSprite(100, 100);
  floor = createSprite(width / 2, height, width, 40);
  floor.collider = "static"
}

function draw() {
  clear();
  background(0, 0, 200);
  // invader2.x++;
  invader2.rotation = frameCount;
}
