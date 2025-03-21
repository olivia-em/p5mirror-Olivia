// send one binary value from P5 to Arduino with webSerial
// with video capture and pixel brightness access
// based on Tom Igoe's lab examples

const serial = new p5.WebSerial();
let portButton;
let capture;

function setup() {
  createCanvas(400, 300);
  allSerialStuff();

  capture = createCapture(VIDEO); // initiate the capture object
  capture.size(width, height); // define the capture size
  capture.hide(); // make it not show on HTML
}

function draw() {
  background(255, 0, 0);
  image(capture, 0, 0); // show the live video
  let pixi = get(mouseX, mouseY); // get the pixel under the mouse
  let brighti = int(brightness(pixi)); // get the brightness of the pixel
  //print(brighti); // puts in the console
  serial.write(brighti); // sends as byte unles its a string
}

/*  
// Arduino Code 
void setup() {
  Serial.begin(9600);
}
void loop() {
  if(Serial.available()){
  byte byteFromSerial = Serial.read();
  int mappedValue= map(byteFromSerial, 0,100,0,255);
  analogWrite(3,mappedValue);
  }
}






*/
function allSerialStuff() {
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  }
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
  // add serial connect/disconnect listeners:
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
}
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

function serialEvent() {}

// open the selected port, and make the port
// button invisible:
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
// read any incoming data as a string
// (assumes a newline at the end of it):

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
