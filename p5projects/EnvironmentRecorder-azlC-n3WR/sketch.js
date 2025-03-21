let recorder;
let player;
let isRecording = false;
let lastRecording = null;
let recordingWithEffects = null;
let isTestingEffects = true;

// Effect parameters
let delayAmount = 0.3; // 0-1 scale
let reverbAmount = 0.5; // 0.001-10 scale (decay time)

// Draggable control
let angle = 0;
let xpos, ypos;
let isDragging = false;

// UI elements
let recordButton, effectsTestButton, processButton, exportButton, clearButton;

// Audio components
const cleanRecordingDest = new Tone.Gain();
const feedbackDelay = new Tone.FeedbackDelay(delayAmount, 0.5);
const reverb = new Tone.Reverb({
  decay: reverbAmount,
  preDelay: 0.05,
  wet: 0.5,
});
const masterGain = new Tone.Gain(0.7).toDestination();
const analyzer = new Tone.Waveform(1024);

// Connect effects chain
feedbackDelay.connect(reverb);
reverb.connect(masterGain);
reverb.connect(analyzer);

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  rectMode(CENTER);
  // Set initial position to center
  xpos = width / 2;
  ypos = height / 2;

  // Initialize Tone.js
  Tone.start();

  // Create recorder
  recorder = new Tone.Recorder();
  cleanRecordingDest.connect(recorder);

  // Create UI elements

  makeButtons();
  repositionButtons();

  // Set up the microphone
  setupMicrophone();
}

function setupMicrophone() {
  const mic = new Tone.UserMedia();
  mic
    .open()
    .then(() => {
      console.log("Microphone ready");
      // Connect mic to clean recording destination
      mic.connect(cleanRecordingDest);
      // Connect mic to effects for monitoring
      mic.connect(feedbackDelay);
    })
    .catch((e) => {
      console.error("Error accessing microphone:", e);
      alert("Please allow microphone access to use this application.");
    });
}

function repositionButtons() {
  let minDimension = min(width, height);
  let spacing = minDimension / 10;
  let buttonSpacing = width / 6;
  let buttonY = spacing;

  recordButton.position(buttonSpacing - recordButton.width / 2, buttonY);
  effectsTestButton.position(
    2 * buttonSpacing - effectsTestButton.width / 2,
    buttonY
  );
  processButton.position(3 * buttonSpacing - processButton.width / 2, buttonY);
  exportButton.position(4 * buttonSpacing - exportButton.width / 2, buttonY);
  clearButton.position(5 * buttonSpacing - clearButton.width / 2, buttonY);
}

function makeButtons() {
  // Create buttons
  recordButton = createButton("Record");
  recordButton.mousePressed(toggleRecording);

  effectsTestButton = createButton("Testing");
  effectsTestButton.mousePressed(toggleTestMode);
  effectsTestButton.attribute("disabled", "");

  processButton = createButton("Process");
  processButton.mousePressed(processRecordingWithEffects);
  processButton.attribute("disabled", "");

  exportButton = createButton("Export");
  exportButton.mousePressed(exportRecording);
  exportButton.attribute("disabled", "");

  clearButton = createButton("Clear");
  clearButton.mousePressed(clearRecording);
}

function draw() {
  background(0, 50); // Slight fade for trail effect

  // Calculate bounds for draggable area
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

  // Update button appearance based on recording state
  if (isRecording) {
    recordButton.style("background-color", "red");
    recordButton.html("Stop");
  } else {
    recordButton.style("background-color", "darkblue");
    recordButton.html("Record");
  }

  // Map position to effect parameters
  delayAmount = constrain(
    map(xpos, rectX - rectW / 2, rectX + rectW / 2, 0, 1),
    0,
    1
  );
  reverbAmount = constrain(
    map(ypos, rectY - rectH / 2, rectY + rectH / 2, 10, 0.001),
    0.001,
    10
  );

  // Update effects
  feedbackDelay.delayTime.value = delayAmount;
  reverb.decay = reverbAmount;

  // Display current effect values
  fill(255);
  noStroke();
  textAlign(LEFT);
  textSize(16);
  text(`Delay: ${delayAmount.toFixed(2)}`, 20, height - 60);
  text(`Reverb: ${reverbAmount.toFixed(2)}`, 20, height - 30);

  // Show mode status
  textAlign(CENTER);
  if (isTestingEffects && lastRecording) {
    fill(0, 255, 0);
    text(
      "Test Mode: Drag to adjust effects in real-time",
      width / 2,
      height - 30
    );
  } else if (recordingWithEffects) {
    fill(255, 165, 0);
    text(
      "Final Mode: Effects processed and ready to export",
      width / 2,
      height - 30
    );
  }

  // Draw the draggable control point
  let controlPointSize = min(width, height) / 30;

  // Create colors based on effect values
  let rev = color(
    map(delayAmount, 0, 1, 150, 0),
    0,
    map(reverbAmount, 0.001, 10, 150, 255)
  );
  let del = color(
    0,
    map(reverbAmount, 0.001, 10, 255, 150),
    map(delayAmount, 0, 1, 150, 255)
  );

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

  // Draw visualizer
  drawWaveform(1, rev);
  drawWaveform(1.5, del);
  drawWaveform(2.5, lerpColor(rev, del, 0.5));

  pop(); // Restore the transformation

  angle += 0.01;

  // Display recording status
  if (isRecording) {
    fill(255, 0, 0);
    ellipse(width - 30, (10 * height) / 11, 20, 20);
    fill(255);
    text("Recording...", width - 120, (10.1 * height) / 11);
  }
}

function drawWaveform(val, c) {
  let waveform = analyzer.getValue();
  beginShape();
  let minDimension = min(width, height);
  let spacing = minDimension / 10;

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

function updateTestModeButton() {
  if (isTestingEffects) {
    // loopButton.html("Testing Effects: ON");
    loopButton.style("background", "green");
  } else {
    // loopButton.html("Testing Effects: OFF");
    loopButton.style("background", "orange");
  }
}

function toggleRecording() {
  if (!isRecording) {
    // Start recording
    recorder.start();
    isRecording = true;
    console.log("Recording started");

    // Reset the processed recording
    recordingWithEffects = null;
    if (player) {
      player.stop();
    }

    // Disable buttons during recording
    effectsTestButton.attribute("disabled", "");
    processButton.attribute("disabled", "");
    exportButton.attribute("disabled", "");
  } else {
    // Stop recording
    isRecording = false;
    console.log("Recording stopped");

    // Process the recording
    (async () => {
      try {
        // Get the clean recording
        const recording = await recorder.stop();
        console.log("Recording captured:", recording.size, "bytes");

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

        // Connect player to effects chain for real-time adjustment
        player.connect(feedbackDelay);

        // Enable buttons
        effectsTestButton.removeAttribute("disabled");
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

    // Use the appropriate recording based on mode
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
      player.connect(feedbackDelay);
    } else {
      // In final mode, connect directly to destination (effects already applied)
      player.toDestination();
    }
  }
}

function updateTestModeButton() {
  if (isTestingEffects) {
    effectsTestButton.style("background-color", "#2ecc71");
    effectsTestButton.html("Testing");
  } else {
    effectsTestButton.style("background-color", "#f39c12");
    effectsTestButton.html("Final Result");
  }
}

async function processRecordingWithEffects() {
  if (!lastRecording) return;

  // Disable buttons during processing
  processButton.attribute("disabled", "");
  processButton.html("Processing...");

  // Create a temporary recorder and effects chain with current settings
  const tempRecorder = new Tone.Recorder();
  const tempDelay = new Tone.FeedbackDelay(delayAmount, 0.5);
  const tempReverb = new Tone.Reverb({
    decay: reverbAmount,
    preDelay: 0.05,
    wet: 0.5,
  });

  // Connect effects chain to recorder
  tempDelay.connect(tempReverb);
  tempReverb.connect(tempRecorder);

  // Create temporary player
  const tempUrl = URL.createObjectURL(lastRecording);
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
      tempDelay.dispose();
      tempReverb.dispose();
      tempRecorder.dispose();
      URL.revokeObjectURL(tempUrl);

      // Update buttons
      processButton.removeAttribute("disabled");
      processButton.html("Process Effects");
      exportButton.removeAttribute("disabled");
    },
  });

  // Connect temporary player to effects
  tempPlayer.connect(tempDelay);
}

function exportRecording() {
  if (!recordingWithEffects) {
    console.log("No processed recording available to export");
    alert("Please process your recording with effects before exporting!");
    return;
  }

  // Create download link
  const url = URL.createObjectURL(recordingWithEffects);
  const anchor = document.createElement("a");
  anchor.download = "recording_with_effects.webm";
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
  effectsTestButton.attribute("disabled", "");
  processButton.attribute("disabled", "");
  exportButton.attribute("disabled", "");
  isTestingEffects = true;
  updateTestModeButton();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  xpos = width / 2;
  ypos = height / 2;
  repositionButtons();
}
