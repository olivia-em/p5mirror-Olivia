// Input hue2 (range 0 to 360)
let hue2 = 0;

// Generate three hue values spaced approximately 120 apart
let hue2A = (hue2 + 30) % 360;       // Base hue
let hue2B = (hue2 + 350) % 360;     // +120 degrees
let hue2C = (hue2 + 240) % 360;     // +240 degrees

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  // Log or use the hue values
console.log("Hue2A:", hue2A, "Hue2B:", hue2B, "Hue2C:", hue2C);
}