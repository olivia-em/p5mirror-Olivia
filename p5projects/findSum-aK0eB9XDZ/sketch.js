function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  findSum(10, 15);
}

function findSum(x, y) {
  result = x + y;
  console.log(result);
}
