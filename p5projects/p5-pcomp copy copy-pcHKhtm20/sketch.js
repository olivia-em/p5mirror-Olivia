// variable to hold an instance of the p5.webserial library:
const serial = new p5.WebSerial();
let pot1 = 0;
let pot2 = 0;
let pot3 = 0;
let button1 = 0;
let button2 = 0;

// HTML button object:
let portButton;
let inData = []; // for incoming serial data
let inString = [];
let outByte = 0; // for outgoing data

function setup() {
  createCanvas(700, 700); // make the canvas
  angleMode(DEGREES);
  rectMode(CENTER);
  // check to see if serial is available:
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  }
  // if serial is available, add connect/disconnect listeners:
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
  // check for any ports that are available:
  serial.getPorts();
  // if there's no port chosen, choose one:
  serial.on("noport", makePortButton);
  // open whatever port is available:
  serial.on("portavailable", openPort);
  // handle serial errors:
  serial.on("requesterror", portError);
  // handle any incoming serial data:
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);
}

// function draw() {

//  background(pot1);
// fill(pot2);
//   rect(100,100,100-(20*button),100)
// }

// if there's no port selected,
// make a port select button appear:
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton("choose port");
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(choosePort);
}

// make the port selector window appear:
function choosePort() {
  if (portButton) portButton.show();
  serial.requestPort();
}

// open the selected port, and make the port
// button invisible:
function openPort() {
  // wait for the serial.open promise to return,
  // then call the initiateSerial function
  serial.open().then(initiateSerial);

  // once the port opens, let the user know:
  function initiateSerial() {
    console.log("port open");
  }
  // hide the port button once a port is chosen:
  if (portButton) portButton.hide();
}

// pop up an alert if there's a port error:
function portError(err) {
  alert("Serial port error: " + err);
}

// read any incoming data:
function serialEvent() {
  // read from port until new line:
  let inString = serial.readStringUntil("\r\n");
  if (inString != null) {
    let list = split(trim(inString), ",");
    if (list.length > 4) {
      // conver list items to floats:
      pot1 = float(list[0]);
      pot2 = float(list[1]);
      pot3 = float(list[2]);
      button1 = float(list[3]);
      button2 = float(list[4]);
      console.log(
        pot1 + "," + pot2 + "," + pot3 + "," + button1 + "," + button2
      );
      // send a byte to the microcontroller to get new data:
      serial.write("x");
    }
  }
}

// try to connect if a new serial port
// gets added (i.e. plugged in via USB):
function portConnect() {
  console.log("port connected");
  serial.getPorts();
}

// if a port is disconnected:
function portDisconnect() {
  serial.close();
  console.log("port disconnected");
}

function closePort() {
  serial.close();
}

function draw() {
  background(0);
  ripple(button2, button1, pot3, pot2, pot1);
}

function ripple(frequency, myspeed, num, ramp1, ramp2) {
  let margin = 10;

  let mysize = (width - margin * 2) / num;

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      let x = margin + mysize / 2 + i * mysize;
      let y = margin + mysize / 2 + j * mysize;

      f =
        sin(
          -frameCount * myspeed + dist(width / 2, width / 2, x, y) * frequency
        ) *
          myspeed +
        cos(-frameCount * myspeed);

      if ((i + j) % 2 == 0) {
        noFill();
        strokeWeight(2);
        stroke(dist(width / 2, width / 2, x, y) / 2, ramp1, j * 5);
        rect(x, y, (f * mysize) / 3);
        stroke(dist(width / 2, width / 2, x, y), 20, j);
        circle(x, y, (f * mysize) / 5);
      } else if ((i + j) % 2 == 1) {
        noFill();
        strokeWeight(2);
        stroke(dist(width / 2, width / 2, x, y) / 4, j, ramp2);
        rect(x, y, (f * mysize) / 4);
        stroke(dist(width / 2, width / 2, x, y), 20, j);
        circle(x, y, (f * mysize) / 2);
      }
    }
  }
}
