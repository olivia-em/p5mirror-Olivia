let gameTimer = 0;
let isGameActive = false;
let lastPlatformHit = null;
let score = 0;
const PERFECT_TIMING = {
  "work it": 0, // Starting point
  "make it": 2000, // Should hit 2 seconds after start
  "do it": 4000, // Should hit 4 seconds after start
  "makes us": 6000, // Should hit 6 seconds after start
  harder: 8000, // Should hit 8 seconds after start
  better: 10000, // Should hit 10 seconds after start
  faster: 12000, // Should hit 12 seconds after start
  stronger: 14000, // Should hit 14 seconds after start
};

// How much time deviation is allowed (in milliseconds)
const TIMING_WINDOW = 5000; // ±5000ms window for "perfect" timing

// The correct sequence of platform texts
const CORRECT_SEQUENCE = [
  "work it",
  "make it",
  "do it",
  "makes us",
  "harder",
  "better",
  "faster",
  "stronger",
];

let floor,
  platform1,
  platform2,
  platform3,
  platform4,
  platform5,
  platform6,
  platform7,
  platform8;
let img, img2;
let p1, p2;
let gravity = 0.5; // Gravity pulls the sprite down
let jumpPower = -10; // Initial velocity for jump
let isOnGround = true; // Tracks if the sprite is on the ground

// Sound variables
let sound1, sound2, sound3, sound4, sound5, sound6, sound7, sound8;
let platformCooldowns = new Map(); // Track cooldown for each platform
const COOLDOWN_TIME = 1000; // Cooldown time in milliseconds

function preload() {
  // Load sound files
  soundFormats("mp3", "wav");
  sound1 = loadSound("workit.mp3");
  sound2 = loadSound("makeit.mp3");
  sound3 = loadSound("doit.mp3");
  sound4 = loadSound("makesus.mp3");
  sound5 = loadSound("older.mp3");
  sound6 = loadSound("better.mp3");
  sound7 = loadSound("faster.mp3");
  sound8 = loadSound("stronger.mp3");
  youwin = loadSound("youwin.mp3");

  // Set volumes
  [sound1, sound2, sound3, sound4, sound5, sound6, sound7, sound8].forEach(
    (sound) => {
      sound.setVolume(0.3);
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(18);
  textAlign(CENTER);
  fill(0, 0, 100);
  textFont("Courier New");
  textStyle(BOLD);
  stroke(0, 0, 100);
  strokeWeight(2);

  // Initialize checkboxes for each platform (one per platform)
  let startX = width / 2 - 220; // Start at the center of the screen
  let startY = 30; // Place them just below the top of the screen

  for (let i = 0; i < CORRECT_SEQUENCE.length; i++) {
    let checkbox = createCheckbox("", false);
    checkbox.position(startX + i * 60, startY);
    checkboxes.push(checkbox);
  }

  p1 = createSprite(width / 4 - 50, 30);
  p2 = createSprite((3 * width) / 4 + 50, 30);

  // Add a "ground" sprite
  ground = createSprite(width / 2, height, width, 10);
  ground.collider = "static"; // Ground won't move when collided
  wall1 = createSprite(0, height / 2, 10, height);
  wall1.collider = "static";
  wall2 = createSprite(width, height / 2, 10, height);
  wall2.collider = "static";
  ceiling = createSprite(width / 2, 0, width, 10);
  ceiling.collider = "static";

  // Create platforms
  function createPlatform(x, y, color, text, sound) {
    let platform = new Sprite(x, y, 100, 20, "static");
    platform.color = color;
    platform.text = text;
    platform.sound = sound;
    return platform;
  }

  // Left side platforms
  platform1 = createPlatform(
    width / 2 - 400,
    height / 2 - 150,
    "yellow",
    "work it",
    sound1
  );
  platform2 = createPlatform(
    width / 2 - 300,
    height / 2 - 50,
    "magenta",
    "make it",
    sound2
  );
  platform3 = createPlatform(
    width / 2 - 200,
    height / 2 + 50,
    "lime",
    "do it",
    sound3
  );
  platform4 = createPlatform(
    width / 2 - 100,
    height / 2 + 150,
    "red",
    "makes us",
    sound4
  );

  // Right side platforms
  platform5 = createPlatform(
    width / 2 + 400,
    height / 2 - 150,
    "yellow",
    "harder",
    sound5
  );
  platform6 = createPlatform(
    width / 2 + 300,
    height / 2 - 50,
    "magenta",
    "better",
    sound6
  );
  platform7 = createPlatform(
    width / 2 + 200,
    height / 2 + 50,
    "lime",
    "faster",
    sound7
  );
  platform8 = createPlatform(
    width / 2 + 100,
    height / 2 + 150,
    "red",
    "stronger",
    sound8
  );
}

function draw() {
  background(250, 250, 250, 10);

  if (isGameActive) {
    gameTimer = Date.now() - platformCooldowns.get(platform1);
  }

  playersMove();
  checkPlatformCollisions();

  // Apply the color to the sprite

  let r = (frameCount + 100) % 255;
  let g = (frameCount + 200) % 255;
  let b = (frameCount + 300) % 255;

  p1.color = color(r, g, b);
  p1.stroke = color(g, b, r);
  p2.color = color(b, r, g);
  p2.stroke = color(r, b, g);

  ground.color = color(b, g, r);
  ceiling.color = color(g, b, r);
  wall1.color = color(b, r, g);
  wall2.color = color(r, b, g);

  // Display game info on screen
  push();
  translate(0, 20);
  textSize(20);
  textAlign(CENTER);
  fill(0, 0, 100);
  textFont("Courier New");
  strokeWeight(0);
  textStyle(BOLD);
  if (isGameActive) {
    push();
    rectMode(CENTER);
    fill(150, 150, 250);
    stroke(r, g, b);
    strokeWeight(8);
    rect(width / 2, 115, 300, 125, 10);
    pop();
    text(`Time: ${(gameTimer / 1000).toFixed(2)}s`, width / 2, 90);
    text(`Score: ${score}`, width / 2, 120);
    text(
      `Next Platform: ${CORRECT_SEQUENCE[currentSequenceIndex]}`,
      width / 2,
      150
    );
  } else {
    push();
    rectMode(CENTER);
    fill(150, 150, 250);
    stroke(r, g, b);
    strokeWeight(8);
    rect(width / 2, 115, 300, 70, 10);
    pop();
    text('Hit "work it" to start!', width / 2, 120);
  }
  pop();

  for (let i = 0; i < checkboxes.length; i++) {
    if (i < currentSequenceIndex) {
      checkboxes[i].checked(true);
      checkboxes[i].style("background-color", "navy");
    } else {
      checkboxes[i].checked(false);
      checkboxes[i].style("background-color", "#ccc");
    }
  }
}

function playersMove() {
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

  // Jump
  if (keyIsDown(UP_ARROW)) {
    p2.velocity.y = jumpPower;
  }

  // Check collision with the ground
  p2.collide(ground, () => {
    p2.velocity.y = 0;
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

  // Jump
  if (keyIsDown(87)) {
    p1.velocity.y = jumpPower;
  }

  // Check collision with the ground
  p1.collide(ground, () => {
    p1.velocity.y = 0;
  });
}

let checkboxes = [];

let currentSequenceIndex = 0;

function checkPlatformCollisions() {
  const platforms = [
    { sprite: platform1, sound: sound1 },
    { sprite: platform2, sound: sound2 },
    { sprite: platform3, sound: sound3 },
    { sprite: platform4, sound: sound4 },
    { sprite: platform5, sound: sound5 },
    { sprite: platform6, sound: sound6 },
    { sprite: platform7, sound: sound7 },
    { sprite: platform8, sound: sound8 },
  ];

  const allSprites = [p1, p2];

  for (let platform of platforms) {
    for (let sprite of allSprites) {
      if (platform.sprite.colliding(sprite)) {
        const now = Date.now();
        const lastCollision = platformCooldowns.get(platform.sprite) || 0;

        if (now - lastCollision >= COOLDOWN_TIME) {
          platform.sound.play();
          platformCooldowns.set(platform.sprite, now);

          // If we hit the "work it" platform and the game isn't active, start the game
          if (platform.sprite.text === "work it" && !isGameActive) {
            startGame();
          }
          // If the game is active, check the timing
          else if (isGameActive) {
            checkTiming(platform.sprite.text);
          }
        }
      }
    }
  }
}

function startGame() {
  isGameActive = true;
  gameTimer = 0;
  currentSequenceIndex = 1;
  score = 0;
  console.log(
    "Game started! Hit the platforms in sequence with the right timing!"
  );
}

function checkTiming(platformText) {
  // Check if this is the platform we're expecting
  console.log(currentSequenceIndex);
  if (platformText !== CORRECT_SEQUENCE[currentSequenceIndex]) {
    console.log("Wrong platform! Game over!");
    endGame(false);
    return;
  }

  // Get the expected timing for this platform
  const expectedTiming = PERFECT_TIMING[platformText];
  const timingDifference = Math.abs(gameTimer - expectedTiming);

  if (timingDifference <= TIMING_WINDOW) {
    // Perfect timing!
    score += 100;
    console.log(`Perfect timing! Score: ${score}`);
  } else {
    // Hit the right platform but timing was off
    console.log(`Timing off by ${timingDifference}ms`);
    endGame(false);
    return;
  }

  currentSequenceIndex++;

  // Check if we've completed the sequence
  if (currentSequenceIndex >= CORRECT_SEQUENCE.length) {
    console.log("Congratulations! Perfect sequence!");
    endGame(true);
  }
}
function endGame(won) {
  isGameActive = false;
  currentSequenceIndex = 0;
  checkboxes.forEach((checkbox) => {
    checkbox.checked(false);
    checkbox.style("background-color", "#ccc");
  });

  if (won) {
    console.log(`You won! Final score: ${score}`);
    youwin.play();
  } else {
    console.log(`Game over! Final score: ${score}`);
  }
}
