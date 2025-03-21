let img1;

let p1, p2;
let gravity = 0.5; // Gravity pulls the sprite down
let jumpPower = -10; // Initial velocity for jump
let isOnGround = true; // Tracks if the sprite is on the ground

function preload() {
  img1 = loadImage("skullsprite.png");
}

function setup() {
  createCanvas(600, 400);

  // Create the sprite
  p1 = createSprite(width / 4, height / 2);
  p1.image = "skullsprite.png";
  p2 = createSprite((3 * width) / 4, height / 2);
  p2.image = "skullsprite.png";

  // Add a "ground" sprite
  ground = createSprite(width / 2, height, width, 10);
  ground.collider = "static"; // Ground won't move when collided
  wall1 = createSprite(0, height / 2, 10, height);
  wall1.collider = "static";
  wall2 = createSprite(width, height / 2, 10, height);
  wall2.collider = "static";
  ceiling = createSprite(width / 2, 0, width, 10);
  ceiling.collider = "static";
}

function draw() {
  background(200);

  // Apply gravity to the sprite
  p2.velocity.y += gravity;

  // Left movement
  if (keyIsDown(LEFT_ARROW)) {
    p2.velocity.x = -5;
  }
  // Right movement
  else if (keyIsDown(RIGHT_ARROW)) {
    p2.velocity.x = 5;
  }
  // Stop horizontal movement when no key is pressed
  else {
    p2.velocity.x = 0;
  }

  // Jump (only if on the ground)
  if (keyIsDown(UP_ARROW)) {
    p2.velocity.y = jumpPower;
    // isOnGround = false; // Prevent repeated jumping in the air
  }

  // Check collision with the ground
  p2.collide(ground, () => {
    p2.velocity.y = 0;
    // isOnGround = true; // Reset jump ability
  });

  p1.velocity.y += gravity;

  // Left movement
  if (keyIsDown(65)) {
    p1.velocity.x = -5;
  }
  // Right movement
  else if (keyIsDown(68)) {
    p1.velocity.x = 5;
  }
  // Stop horizontal movement when no key is pressed
  else {
    p1.velocity.x = 0;
  }

  // Jump (only if on the ground)
  if (keyIsDown(87)) {
    p1.velocity.y = jumpPower;
    // isOnGround = false; // Prevent repeated jumping in the air
  }

  // Check collision with the ground
  p1.collide(ground, () => {
    p1.velocity.y = 0;
    // isOnGround = true; // Reset jump ability
  });


}