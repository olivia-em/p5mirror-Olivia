let myInput;

function setup() {
  createCanvas(500, 100);
  myInput = createInput();
  myInput.position(180, 400);
}

function draw() {
  background("red");
  let msg = myInput.value();
  fill("white");
  textAlign(CENTER);
  text(msg, 250, 55);
}

function keyPressed() {
  if (keyCode === ENTER) {
    myInput.value("");
  }
}

const newspaperSpinning = [
  { transform: "rotate(0) scale(0.5)" },
  { transform: "rotate(360deg) scale(1)" },
];

const newspaperTiming = {
  duration: 2000,
  iterations: 1,
};

const newspaper = document.querySelector(".newspaper");

newspaper.addEventListener("click", () => {
  newspaper.animate(newspaperSpinning, newspaperTiming);
});
