let recorder;
let player;
let isRecording = false;
let angle = 0;
let xpos, ypos;
let D = 0;
let R = 0.001;
let lastRecording = null;
let recordingWithEffects = null;
let isTestingEffects = true;
let processButton;
let isDragging = false;

// Create a destination for clean recording
const cleanRecordingDest = new Tone.Gain();

// Create effects chain
const filter = new Tone.Filter(400, "lowpass");
const feedbackDelay = new Tone.FeedbackDelay(D, 0.5);
const myReverb = new Tone.Reverb({
  decay: R,
  preDelay: 0.05,
});

// Create master gain to control volume
const masterGain = new Tone.Gain(0.7).toDestination();
const dryGain = new Tone.Gain(0.5);
mic.connect(dryGain);
dryGain.connect(masterGain);

myReverb.wet.value = 0.5;
feedbackDelay.wet.value = 0.5;

// Connect the effects chain
filter.connect(feedbackDelay);
feedbackDelay.connect(myReverb);
myReverb.connect(masterGain);

let analyzer = new Tone.Waveform(2048);
let clearButton, exportButton, recordButton, loopButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  rectMode(CENTER);
  let minDimension = min(width, height);
  let spacing = minDimension / 10;
  let rectX = width / 2;
  let rectY = height / 2;
  let rectW = width / 1.5;
  let rectH = height / 1.5;
  xpos = rectX;
  ypos = rectY;

  // Initialize Tone.js
  Tone.start();  // Ensure audio starts inside a user action

  // Create recorder (connected to the clean recording destination)
  recorder = new Tone.Recorder();
  cleanRecordingDest.connect(recorder);

  // Set up the microphone
  const mic = new Tone.UserMedia();
  mic
    .open()
    .then(() => {
      // Connect mic to the clean recording destination
      mic.connect(cleanRecordingDest);

      // Connect mic to live monitoring through effects
      mic.connect(filter);

      // Connect to analyzer for visualization
      myReverb.connect(analyzer);

      console.log("Microphone ready");
    })
    .catch((e) => {
      console.error("Error opening microphone:", e);
      alert("Couldn't access your microphone. Please check permissions.");
    });

  // // Set up the buttons
  // const buttonSpacing = width / 6;
  // const buttonY = spacing;

  // Record Button
  recordButton = createButton("Record");

  recordButton.mousePressed(myRecord);

  // Loop/Test Button
  loopButton = createButton("Testing Effects");

  loopButton.mousePressed(toggleTestMode);

  // Process Button
  processButton = createButton("Process with Effects");

  processButton.mousePressed(processRecordingWithEffects);

  // Clear Button
  clearButton = createButton("Clear");

  clearButton.mousePressed(clearRecording);

  // Export Button
  exportButton = createButton("Export");

  exportButton.mousePressed(exportRecording);

  // Initially disable process and export buttons
  processButton.attribute("disabled", "");
  exportButton.attribute("disabled", "");

  repositionButtons();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  let minDimension = min(width, height);
  let spacing = minDimension / 10;
  let rectX = width / 2;
  let rectY = height / 2;

  // Only reset position if not dragging
  if (!isDragging) {
    xpos = rectX;
    ypos = rectY;
  }
}

function draw() {
  blendMode(BLEND);
  background(0, 50);

  let minDimension = min(width, height);
  let spacing = minDimension / 10;

  let rectX = width / 2;
  let rectY = height / 2;
  let rectW = width / 1.5;
  let rectH = height / 1.5;

  // Draw movement bounds
  noFill();
  stroke(0, 0, 255);
  rect(rectX, rectY, rectW, rectH);

  // Constrain movement within the rectangle (only when dragging)
  if (isDragging) {
    xpos = constrain(mouseX, rectX - rectW / 2, rectX + rectW / 2);
    ypos = constrain(mouseY, rectY - rectH / 2, rectY + rectH / 2);
  }

  // Update record button appearance
  if (isRecording) {
    recordButton.style("background", "red");
    recordButton.html("Stop");
  } else {
    recordButton.style("background", "darkblue");
    recordButton.html("Record");
  }

  // Map position to effect parameters
  D = constrain(map(xpos, rectX - rectW / 2, rectX + rectW / 2, 0, 1), 0, 1);
  R = constrain(
    map(ypos, rectY - rectH / 2, rectY + rectH / 2, 20, 0.001),
    0.001,
    20
  );

  // Update effects
  feedbackDelay.delayTime.value = D;
  myReverb.decay = R;

  // Display current effect values
  fill(255);
  noStroke();
  textAlign(LEFT);
  textSize(16);
  text(`Delay: ${D.toFixed(2)}`, 20, height - 60);
  text(`Reverb: ${R.toFixed(2)}`, 20, height - 30);

  // Show mode status
  textAlign(CENTER);
  if (isTestingEffects) {
    fill(0, 255, 0);
    text("Test Mode: Adjust effects in real-time", width / 2, height - 30);
  } else if (recordingWithEffects) {
    fill(255, 165, 0);
    text(
      "Final Mode: Effects processed and ready to export",
      width / 2,
      height - 30
    );
  }

  // Draw the draggable control point
  let controlPointSize = minDimension / 30;
  let rev = color(map(D, 0, 1, 150, 0), 0, map(R, 0.001, 20, 150, 255));
  let del = color(0, map(R, 0.001, 20, 255, 150), map(D, 0, 1, 150, 255));

  // Check if mouse is over the control point for hover effect
  let distToControl = dist(mouseX, mouseY, xpos, ypos);
  let isHovering = distToControl < controlPointSize;

  // Draw drag handle with hover effect
  stroke(rev);
  strokeWeight(2);
  if (isHovering || isDragging) {
    fill(255);
    cursor(HAND);
  } else {
    fill(lerpColor(rev, del, 0.9));
    cursor(ARROW);
  }
  ellipse(xpos, ypos, controlPointSize, controlPointSize);

  push(); // Save the current transformation
  translate(xpos, ypos);
  rotate(angle);

  myWaveform(1, rev);
  myWaveform(1.5, del);
  myWaveform(2.5, lerpColor(rev, del, 0.5));

  pop(); // Restore the transformation

  angle += 0.01;
}

function myWaveform(val, c) {
  let minDimension = min(width, height);
  let spacing = minDimension / 10;
  let waveform = analyzer.getValue();
  beginShape();
  let points = floor(waveform.length / 50);
  for (let i = 0; i < waveform.length; i += points) {
    let phi = radians(map(i, 0, waveform.length, 0, 360));
    let radius = map(waveform[i], -1, 1, 0, 3 * spacing);
    let x = (radius / val) * cos(phi);
    let y = (radius / val) * sin(phi);
    noStroke();
    fill(c);
    ellipse(
      x * 1.5,
      y * 1.5,
      minDimension / (100 * val),
      minDimension / (100 * val)
    );
  }
  endShape();
}

function mousePressed() {
  // Check if the mouse is over the control point
  let controlPointSize = min(width, height) / 30;
  let distToControl = dist(mouseX, mouseY, xpos, ypos);

  if (distToControl < controlPointSize) {
    isDragging = true;
  }
}

function mouseReleased() {
  isDragging = false;
}

function myRecord() {
  if (!isRecording) {
    // Start a new recording
    recorder.start();
    isRecording = true;
    console.log("Recording started");

    // Reset the processed recording when starting a new recording
    recordingWithEffects = null;
    if (player) {
      player.stop();
    }

    // Disable buttons during recording
    loopButton.attribute("disabled", "");
    processButton.attribute("disabled", "");
    exportButton.attribute("disabled", "");
  } else {
    // Stop recording
    isRecording = false;
    console.log("Recording stopped");

    // Using async/await with the recorder stop method
    (async () => {
      try {
        // Get the clean recording
        const recording = await recorder.stop();
        console.log("Recording size:", recording.size, "bytes");

        // Store the recording
        lastRecording = recording;

        // Create a URL for the recording
        const url = URL.createObjectURL(recording);

        // Stop any existing player
        if (player) {
          player.stop();
          player.dispose();
        }

        // Create a new player with the recording
        player = new Tone.Player({
          url: url,
          loop: true,
          autostart: true,
        });

        // Connect player to effects chain for playback
        player.connect(filter);

        // Enable test mode buttons
        loopButton.removeAttribute("disabled");
        processButton.removeAttribute("disabled");

        // Set to testing mode by default
        isTestingEffects = true;
        updateTestModeButton();

        console.log("Player created and started in test mode");
      } catch (err) {
        console.error("Error processing recording:", err);
        alert("Error processing recording: " + err.message);
      }
    })();
  }
}

function toggleTestMode() {
  if (!lastRecording) return;

  isTestingEffects = !isTestingEffects;
  updateTestModeButton();

  if (player) {
    player.stop();
    player.dispose();

    // Create a URL for the appropriate recording
    const recordingToUse = isTestingEffects
      ? lastRecording
      : recordingWithEffects;
    const url = URL.createObjectURL(recordingToUse);

    // Create a new player
    player = new Tone.Player({
      url: url,
      loop: true,
      autostart: true,
    });

    // Connect appropriately based on mode
    if (isTestingEffects) {
      // In test mode, connect to the effects chain
      player.connect(filter);
    } else {
      // In final mode, connect directly to destination
      player.toDestination();
    }
  }
}

function updateTestModeButton() {
  if (isTestingEffects) {
    // loopButton.html("Testing Effects: ON");
    loopButton.style("background", "green");
  } else {
    // loopButton.html("Testing Effects: OFF");
    loopButton.style("background", "orange");
  }
}

async function processRecordingWithEffects() {
  if (!lastRecording) return;

  // Disable buttons during processing
  processButton.attribute("disabled", "");
  processButton.html("Processing...");

  // Create a temporary player and recorder to process the recording with effects
  const tempUrl = URL.createObjectURL(lastRecording);
  const tempRecorder = new Tone.Recorder();

  // Create a temporary effects chain with current settings
  const tempFilter = new Tone.Filter(400, "lowpass");
  const tempDelay = new Tone.FeedbackDelay(D, 0.5);
  const tempReverb = new Tone.Reverb({
    decay: R,
    preDelay: 0.05,
  });

  // Connect the temporary effects chain to the recorder
  tempFilter.connect(tempDelay);
  tempDelay.connect(tempReverb);
  tempReverb.connect(tempRecorder);

  // Create temporary player
  const tempPlayer = new Tone.Player({
    url: tempUrl,
    loop: false,
    autostart: false,
    onload: async () => {
      // Start recording
      tempRecorder.start();

      // Play the audio through the effects
      await Tone.loaded();
      tempPlayer.start();

      // Wait for the audio to finish playing
      await new Promise((resolve) => {
        tempPlayer.onstop = resolve;
      });

      // Stop recording and get the processed audio
      const processedRecording = await tempRecorder.stop();
      recordingWithEffects = processedRecording;
      console.log("Recording processed with effects");

      // Switch to processed mode
      isTestingEffects = false;
      updateTestModeButton();

      // Update playback to use processed recording
      if (player) {
        player.stop();
        player.dispose();

        const processedUrl = URL.createObjectURL(recordingWithEffects);
        player = new Tone.Player({
          url: processedUrl,
          loop: true,
          autostart: true,
        }).toDestination();
      }

      // Clean up
      tempPlayer.dispose();
      tempFilter.dispose();
      tempDelay.dispose();
      tempReverb.dispose();
      tempRecorder.dispose();
      URL.revokeObjectURL(tempUrl);

      // Re-enable buttons
      processButton.removeAttribute("disabled");
      processButton.html("Process with Effects");
      exportButton.removeAttribute("disabled");
    },
  });

  // Connect temporary player to the temporary effects chain
  tempPlayer.connect(tempFilter);
}

function exportRecording() {
  if (!recordingWithEffects) {
    console.log("No processed recording available to export");
    alert("Please process your recording with effects before exporting!");
    return;
  }

  // Using the approach from the example code
  const url = URL.createObjectURL(recordingWithEffects);
  const anchor = document.createElement("a");
  anchor.download = "recording_with_effects.webm"; // Using webm format as in the example
  anchor.href = url;
  anchor.click();

  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(url);
    console.log("Recording with effects exported");
  }, 100);
}

function clearRecording() {
  if (player) {
    player.stop();
    player.dispose();
    player = null;
  }

  lastRecording = null;
  recordingWithEffects = null;
  console.log("Recording cleared");

  // Reset button states
  processButton.attribute("disabled", "");
  exportButton.attribute("disabled", "");
  loopButton.attribute("disabled", "");
  isTestingEffects = true;
  updateTestModeButton();
}

function keyPressed() {
  if (key === "f") {
    let fs = fullscreen();
    fullscreen(!fs);
    setTimeout(() => {
      resizeCanvas(windowWidth, windowHeight);
      repositionButtons();
    }, 100);
  }
}

function repositionButtons() {
  let minDimension = min(width, height);
  let spacing = minDimension / 10;
  let buttonSpacing = width / 6;
  let buttonY = spacing;

  recordButton.position(buttonSpacing - recordButton.width / 2, buttonY);
  loopButton.position(2 * buttonSpacing - loopButton.width / 2, buttonY);
  processButton.position(3 * buttonSpacing - processButton.width / 2, buttonY);
  exportButton.position(4 * buttonSpacing - exportButton.width / 2, buttonY);
  clearButton.position(5 * buttonSpacing - clearButton.width / 2, buttonY);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  repositionButtons();
}

function setupMic() {
  const mic = new Tone.UserMedia();
  mic
    .open()
    .then(() => {
      mic.connect(cleanRecordingDest);
      mic.connect(filter);
      myReverb.connect(analyzer);
      console.log("Microphone ready");
    })
    .catch((e) => {
      console.error("Microphone access denied:", e);
      alert("Microphone permission needed.");
    });
}
