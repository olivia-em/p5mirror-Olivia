let songFiles = ["DEEPEST2.mp3", "DEEPEST3.mp3"];
let songs = [];
let i = 0;
//let r = 100;
let amp, fft;
let myLine = [];
let num = 1500;
let theta = 60;
let isPlaying = false;
let startTime;
let stage = 0;
let myeegD, myeegT, myeegA, myeegB, myeegG;
let weAreConnected=false;
let portButton;
let inData;         // for incoming serial data
let outByte = 0;
let stageIsChanging=false;
let o=0;

let serial = new p5.WebSerial();

function preload() {
  for (let j = 0; j < songFiles.length; j++) {
    songs[j] = loadSound(songFiles[j]);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(15);
  o=width/8;
  amp = new p5.Amplitude();
  fft = new p5.FFT();
  angleMode(DEGREES);
 // b = width / 2;
  //n = height / 2;
  setupMuse();
  setupMuseML();
if(!navigator.serial){
  alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
}
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
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

  if(eeg.delta<50){
   startTime = millis(); 
  }  
}
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton("choose port");
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(choosePort);
}
 
// make the port selector window appear:
function choosePort() {
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
    weAreConnected=true;
  }
  // hide the port button once a port is chosen:
  if (portButton) portButton.hide();
}
 
// read any incoming data as a byte:
function serialEvent() {
  // read a byte from the serial port:
 var inByte = serial.read();
  print("in:", inByte);
  // store it in a global variable:
 // inData = inByte;
  //let inStr=serial.readUntil("\n");
  //print("in:", inStr);
}
 
// pop up an alert if there's a port error:
function portError(err) {
  alert("Serial port error: " + err);
}
 
// try to connect if a new serial port 
// gets added (i.e. plugged in via USB):
function portConnect() {
  console.log("port connected");
  serial.getPorts();
}
 
// if a port is disconnected:
function portDisconnect() {
  sendModeToArduino(10);
  serial.close();
  console.log("port disconnected");
  weAreConnected=false;
}
 
function closePort() {
  serial.close();
}

function mousePressed() {
  // If there's a song playing, toggle play/pause on it
  if (isPlaying) {
    songs[i].pause();
    isPlaying = false;
  } else {
    songs[i].play();
    isPlaying = true;
  }
}


function proccessEEG() {
  let elapsedTime = millis() - startTime;
 
 // Stage progression
  if (elapsedTime > 10000 && stage === 0) {
    stage = 1;
    stageIsChanging=false;
  }
  if (elapsedTime > 30000 && stage === 1) {
    stage = 2;
    stageIsChanging=false;
  }
  if (elapsedTime > 50000 && stage === 2) {
    stage = 3;
    stageIsChanging=false;
  }
  if (elapsedTime > 70000 && stage === 3) {
    stage = 4;
    stageIsChanging=false;
  } 
  if (elapsedTime > 90000 && stage === 4) {
    stage = 5;
    stageIsChanging=false;
  } 
  if (elapsedTime > 100000 && stage === 5) {
    stage = 6;
    stageIsChanging=false;
  }

  // Stage-specific actions
  if(!stageIsChanging){
  if (stage === 1 && elapsedTime <= 30000) {
    if (myeegD < 10) {
      sendModeToArduino(3);
    }
    else if(myeegD < 20 && myeegD >= 10){
      sendModeToArduino(1);
    }else{
      sendModeToArduino(2);
    }
  } else if (stage === 2 && elapsedTime > 30000 && elapsedTime <= 50000) {
    if (myeegA < 10 && myeegB < 10) {
      sendModeToArduino(3);
    }
    else if( myeegB < 10){
      sendModeToArduino(1);
      sendModeToArduino(1);
    } else{
      sendModeToArduino(1);
      sendModeToArduino(2);
    }
  } else if (stage === 3 && elapsedTime > 50000 && elapsedTime <= 70000) {
    if (myeegA < 10 && myeegB < 10) {
      sendModeToArduino(3);
    }
    else if(myeegA < 10) {
      sendModeToArduino(2);
      sendModeToArduino(2);
    }else{
      sendModeToArduino(1);
      sendModeToArduino(2);
    }
  } else if (stage === 4 && elapsedTime > 70000 && elapsedTime <= 90000) {
    if (myeegT < 10) {
      sendModeToArduino(1);
      sendModeToArduino(5);
    } else {
      sendModeToArduino(2);
      sendModeToArduino(5);
    }
  } else if (stage === 5 && elapsedTime > 90000 && elapsedTime <= 100000) {
    if (myeegG < 10) {
      sendModeToArduino(6);
    }
    else {
      sendModeToArduino(7);
    }
  } else if (stage === 6 && elapsedTime > 100000 && elapsedTime <= 110000) {
    if (myeegT < 10) {
      sendModeToArduino(8);
    }
    else {
      sendModeToArduino(9);
    }
  }
    stageIsChanging=true;
  }
}

function sendModeToArduino(mode) {
    try {
      serial.write(`${mode}\n`);
      console.log(`Sent mode: ${mode}`);
    } catch (error) {
      console.error("Failed to write to serial:", error);
    }
}

function draw() {
    let level = amp.getLevel();
  let spectrum = fft.analyze();
  background(230-(spectrum[1]*2), 50-(spectrum[1]*2), 15-(spectrum[1]*2));
  //print(Math.abs(230-(spectrum[1]*2)), Math.abs(50-(spectrum[1]*2)), Math.abs(15-(spectrum[1]*2)));
push();
  if(eeg.alpha>0 ){
     stroke( 200, 2000/eeg.alpha*level, 255  ,2000/eeg.theta);
  } 
  strokeWeight(0.5);
  noFill();
   translate(width / 2, height / 2); // Center the sphere

  // Dynamically update parameters using frameCount
  let thetaMax = map(Math.abs(sin(frameCount *6)), -1, 1, 30, 360); // Oscillates between 0 and 360
  let phiMax = map(Math.abs(cos(frameCount *6)), -1, 1, 90, 360);  // Oscillates between 0 and 360 for full shape
  let density = int(map(sin(frameCount *4), -1, 1, 8, 102)); // Oscillates between 13 and 72

  // Loop through phi and theta to calculate 2D projected positions
  for (let phi = 0; phi < phiMax; phi += 360 / density) {
    beginShape();
    for (let alp = 0; alp < thetaMax; alp += 360 / density) {
      // Calculate 3D coordinates
      let x3D = o * spectrum[4]/500*cos(phi) * cos(alp);
      let y3D = o * spectrum[4]/500*sin(phi) * sin(alp);
      let z3D = o * cos(alp);

      // Project 3D coordinates into 2D (perspective effect)
      let x2D = x3D;
      let y2D = y3D - z3D * 0.4;

      vertex(x3D, y3D);
    }
    endShape(CLOSE);
  }
  pop();


  if (!songs[i].isPlaying() && isPlaying) {
    i++;
    if (i >= songs.length) {
      i = 0; // Loop back to the first song if reach the end
    }
    songs[i].play();
  }
  push();
  translate(width/2, height/2);

  for (let i = 0; i < num; i++) {
    let Noise =
      550 * noise(frameCount / 100 + i / 100, (millis() / 2500) * level);
    stroke((i / 1.5) * level, 0, (Noise * spectrum[4]) / 200, 20);
    strokeWeight(2);
    rotate(2000 / num);
    //center circle eeg affacted
    line(
      600,
      600,
      eegSpectrum[4] / 100+80,
      (Math.floor(eeg.alpha) * 0.5 * Math.floor(eeg.delta)) / 10+80
    );
    let r = random(width*2); //use random radius
    let x = Math.cos(theta) * r+width ;
    let y = Math.sin(theta) * r +width;
    stroke((i / 1.5) * level, 0, (Noise * spectrum[1]) / 200, 80);
    //outer circle music affacted
   line(spectrum[4], spectrum[4] / 2,x * level,y * Noise);

    strokeWeight(4);
    //point music affacted
    point(Noise / 1.5, Noise / 1.5);
  }
  pop();
  //print(level);
  //print(eegSpectrum[4]);
  // print(eegSpectrum[6]);
  /* for (let i = 1; i <= eegSpectrum.length / 2; i++) {
    let x = map(i, 0, 48, 0, width);
    let y = map(eegSpectrum[i], 0, 50, height, 0);
    vertex(x, y); //<-- draw a line graph
  }
  endShape();

  // PPG chart
  if (ppg.buffer.length == PPG_SAMPLES_MAX) {
    beginShape();
    strokeWeight(1);
    noFill();
    stroke(255, 100, 100);

   for (let i = 1; i <= PPG_SAMPLES_MAX; i++) {
      let x = map(i, 0, PPG_SAMPLES_MAX, 0, width);
      let y = map(ppg.buffer[i], ppg.min, ppg.max, height * 0.6, height * 0.4);
      vertex(x, y); //<-- draw a line graph
    }
    endShape();
  }*/

  noStroke();
  fill(255);
  textSize(10);
  text("BATTERY: " + Math.floor(batteryLevel), width - 80, 30);
  /*
  textSize(12);
  text("NOISE: " + state.noise, 10, 135);
  text("MUSCLE: " + state.muscle, 10, 150);
  text("FOCUS: " + state.focus, 10, 165);
  text("CLEAR:  " + state.clear, 10, 180);
  text("MEDITATE: " + state.meditation.toFixed(4), 10, 195);
  text("DREAM: " + state.dream, 15, 105);

  let statePos = [-10, 30, 45, 60, 75, 90, 105];
  let highestState = 0;
  let highestValue = 0;
  if (state.noise > highestValue) {
    highestValue = state.noise;
    highestState = 1;
    
  }
  if (state.muscle > highestValue) {
    highestValue = state.muscle;
    highestState = 2;
  }
  if (state.focus > highestValue) {
    highestValue = state.focus;
    highestState = 3;
  }
  if (state.clear > highestValue) {
    highestValue = state.clear;
    highestState = 4;
  }
  if (state.meditation > highestValue) {
    highestValue = state.meditation;
    highestState = 5;
  }
  if (state.dream > highestValue) {
    highestValue = state.dream;
    highestState = 6;
  }

  text(">", 5, statePos[highestState] - 1);*/
  let statePos = [-10, 30, 45, 60, 75, 90, 105];
  let highestState = 0;
  let highestValue = 0;
  if (eeg.delta > highestValue) {
    highestValue = eeg.delta;
    highestState = 1;
  }
  if (eeg.theta > highestValue) {
    highestValue = eeg.theta;
    highestState = 2;
  }
  if (eeg.alpha > highestValue) {
    highestValue = eeg.alpha;
    highestState = 3;
  }
  if (eeg.beta > highestValue) {
    highestValue = eeg.beta;
    highestState = 4;
  }
  if (eeg.gamma > highestValue) {
    highestValue = eeg.gamma;
    highestState = 5;
  }

  text(">", 5, statePos[highestState] - 1);

  text("NO-FOCUS: " + eeg.delta.toFixed(0), 15, 30);
  text("ACTIVE: " + eeg.theta.toFixed(0), 15, 45);
  text("TENSE: " + eeg.alpha.toFixed(0), 15, 60);
  text("CALM:  " + eeg.beta.toFixed(0), 15, 75);
  text("SADNESS: " + eeg.gamma.toFixed(0), 15, 90);

  myeegD = Math.floor(eeg.delta);
  myeegT = Math.floor(eeg.theta);
  myeegA = Math.floor(eeg.alpha);
  myeegB = Math.floor(eeg.beta);
  myeegG = Math.floor(eeg.gamma);

  //print(myeegA);
  if(weAreConnected){
     proccessEEG();
  }
 
}
