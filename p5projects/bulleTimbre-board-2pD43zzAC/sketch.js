// https://p5js.org/reference/p5.Element/draggable/

// TYPE FIRST
// left to right placemnet determines panning
// up and down determines delay

// Create a gain node
let gainNode = new Tone.Gain(0.5).toDestination(); // Default volume at 50%

let sampler = new Tone.Sampler({
  A1: "samples/casio/A1.mp3",
  B1: "samples/casio/B1.mp3",
  C2: "samples/casio/C2.mp3",
  D2: "samples/casio/D2.mp3",
  E2: "samples/casio/E2.mp3",
  F2: "samples/casio/F2.mp3",
  G2: "samples/casio/G2.mp3",
}).connect(gainNode); // Connect sampler to gainNode instead of toDestination


let keyMap = {
  q: "B3",
  w: "A3",
  e: "G3",
  r: "F3",
  t: "E3",
  y: "D3",
  u: "C3",
  i: "B2",
  o: "A2",
  p: "G2",
  a: "F2",
  s: "E2",
  d: "D2",
  f: "C2",
  g: "B1",
  h: "A1",
  j: "G1",
  k: "F1",
  l: "E1",
  z: "D1",
  x: "C1",
  c: "B0",
  v: "A0",
  b: "G0",
  n: "F0",
  m: "E0",
};

let stickyNotes = [];
let dim, boardX, boardY, boardSize, sw;

function setup() {
  dim = min(windowWidth, windowHeight);
  sw = dim / 30;
  createCanvas(dim, dim - dim / 4);

  // Draw board area
  boardX = dim / 4 + sw / 2;
  boardY = sw / 2;
  boardSize = dim - dim / 4 - sw;
  background('white');
  fill("#C18E69");
  stroke("#633c32");
  strokeWeight(sw);
stroke("#633c32");
  square(boardX, boardY, boardSize);
  strokeWeight(sw/4);
  // stroke("white");
  // line(width-2*sw,2*sw,width-2*sw,height-2*sw)
  // line(boardX + 2*sw,height-2*sw,width-2*sw,height-2*sw)
  // Create initial sticky note
  stickyNotes.push(new StickyNote(dim / 35, dim / 35));
}

function draw() {
  for (let note of stickyNotes) {
    note.update();
  }
  
  
}

// Store pressed keys in the active sticky note
function keyPressed() {
  let pitch = keyMap[key.toLowerCase()];
  if (key === " ") {
    // Space adds a rest (null)
    if (stickyNotes.length > 0) {
      stickyNotes[stickyNotes.length - 1].recordSound(null);
    }
  } else if (pitch && sampler.loaded) {
    sampler.triggerAttack(pitch);

    // Store sound in the most recent sticky note
    if (stickyNotes.length > 0) {
      stickyNotes[stickyNotes.length - 1].recordSound(pitch);
    }
  }
}

function keyReleased() {
  sampler.triggerRelease();
}

class StickyNote {
  constructor(x, y) {
    this.sounds = [];
    this.isPlaying = false;
    this.sequence = null;
    this.volume = 0.5;
    
  this.color = this.getRandomColor();
    // Create a dedicated Gain node for volume control
     // Create effects chains that we'll reuse
    this.gainNode = new Tone.Gain(this.volume);
    this.panner = new Tone.Panner(0);
    this.delay = new Tone.FeedbackDelay({
      delayTime: 0,
      feedback: 0.5
    });
    
    // Connect the effects chain
    this.gainNode.connect(this.panner);
    this.panner.connect(this.delay);
    this.delay.toDestination();

 // Sticky note div with random color
    this.note = createDiv("Note");
    this.note.position(x, y);
    this.note.size(dim / 6, dim / 6);
    this.note.style("background", this.color);
    this.note.style("padding", "5px");
    this.note.style("border", "2px solid " + this.getDarkerShade(this.color));
    this.note.draggable();

    // Create container for controls
    this.controlsContainer = createDiv("");
    this.controlsContainer.parent(this.note);
    this.controlsContainer.style("display", "flex");
    this.controlsContainer.style("flex-direction", "column");
    this.controlsContainer.style("gap", "5px");
    this.controlsContainer.style("margin-top", "5px");

    // Play/Pause button - more seamless design
    this.playButton = createButton("Play");
    this.playButton.mousePressed(() => this.togglePlayback());
    this.playButton.parent(this.controlsContainer);
    this.playButton.style("background", this.getDarkerShade(this.color));
    this.playButton.style("color", "white");
    this.playButton.style("border", "none");
    this.playButton.style("border-radius", "3px");
    this.playButton.style("padding", "3px 8px");
    this.playButton.style("cursor", "pointer");
    this.playButton.style("font-size", "12px");
    this.playButton.style("width", "80%");
    this.playButton.style("align-self", "center");

    // Volume control container
    this.volumeContainer = createDiv("");
    this.volumeContainer.parent(this.controlsContainer);
    this.volumeContainer.style("display", "flex");
    this.volumeContainer.style("align-items", "center");
    this.volumeContainer.style("gap", "5px");
    this.volumeContainer.style("width", "100%");
    this.volumeContainer.style("padding", "0 5px");

    // Volume slider - more seamless design
    this.volumeSlider = createSlider(0, 1, this.volume, 0.1);
    this.volumeSlider.parent(this.volumeContainer);
    this.volumeSlider.style("width", "90%");
    this.volumeSlider.style("height", "4px");
    this.volumeSlider.style("appearance", "none");
    this.volumeSlider.style("-webkit-appearance", "none");
    this.volumeSlider.style("background", this.getLighterShade(this.color));
    this.volumeSlider.style("cursor", "pointer");
    this.volumeSlider.style("margin", "5px 0");

    // Prevent slider from triggering note dragging
    this.volumeSlider.elt.addEventListener("mousedown", (e) => {
      e.stopPropagation();
    });

    this.volumeSlider.input(() => {
      this.volume = this.volumeSlider.value();
      console.log("Slider Moved:", this.volumeSlider.value());
      gainNode.gain.setValueAtTime(this.volume, Tone.now());
    });

    // Text input panel
    this.panel = createDiv("");
    this.panel.position(x, y * 23);
    this.panel.size(100, 24);
    this.panel.style("background", this.color);
    this.panel.style("padding", "5px");
    this.panel.style("text-align", "center");
    this.panel.style("border", "1px solid " + this.getDarkerShade(this.color));

    this.textInput = createInput("");
    this.textInput.size(90);
    this.textInput.parent(this.panel);
    this.textInput.style("border", "none");
    this.textInput.style("background", this.getLighterShade(this.color, 0.7));
    this.textInput.style("padding", "2px 5px");

    this.moved = false;
    this.finalSounds = [];

    // Modify the text input to update sounds when content changes
    this.textInput.input(() => {
      // Update note text without re-creating controls
      this.note.html(`<span>${this.textInput.value()}</span>`, false);
      
      // Re-append controls to ensure they aren't lost
      this.controlsContainer.parent(this.note);

      // Update final sounds based on current text
      this.updateFinalSounds();
    });
  }

  update() {
    let x = this.note.position().x;
    let y = this.note.position().y;

    if (
      !this.moved &&
      x > boardX &&
      x < boardX + boardSize &&
      y > boardY &&
      y < boardY + boardSize
    ) {
      this.moved = true;
      stickyNotes.push(new StickyNote(dim / 35, dim / 35));
    }

    // Update volume based on vertical position
    this.updateVolumeFromPosition();
  }
  
  // Method to update volume based on position
  updateVolumeFromPosition() {
    
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }

  }

  // Method to parse and update sounds from text
  updateFinalSounds() {
    // Reset the final sounds
    this.finalSounds = [];
    
    // Split the text input into words
    let words = this.textInput.value().trim().toLowerCase().split(/\s+/);
    
    // Convert words to corresponding pitches
    words.forEach(word => {
      for (let char of word) {
        let pitch = keyMap[char];
        if (pitch) {
          this.finalSounds.push(pitch);
        }
      }
    });

    console.log(`Updated sounds for note: ${this.finalSounds}`);
  }
 // Helper method to get random pastel color
  getRandomColor() {
    const colors = [
      "#FFD3B6", // Peach
      "#FFAAA5", // Light pink
      "#A8E6CF", // Mint green
      "#DCEDC1", // Light yellow-green
      "#FF8B94", // Salmon
      "#CCE2CB", // Sage
      "#B5EAD7", // Light cyan
      "#C7CEEA", // Lavender
      "#F6EAC2", // Light yellow
      "#E2F0CB"  // Light lime
    ];
    return colors[floor(random(colors.length))];
  }
  
  // Helper method to get a darker shade of a color for borders
  getDarkerShade(hexColor) {
    // Convert hex to RGB
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);
    
    // Darken by reducing each component
    r = Math.max(0, r - 40);
    g = Math.max(0, g - 40);
    b = Math.max(0, b - 40);
    
    // Convert back to hex
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  
  // Helper method to get a lighter shade of a color for highlights
  getLighterShade(hexColor, factor = 0.85) {
    // Convert hex to RGB
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);
    
    // Lighten by mixing with white
    r = Math.min(255, r + Math.round((255 - r) * factor));
    g = Math.min(255, g + Math.round((255 - g) * factor));
    b = Math.min(255, b + Math.round((255 - b) * factor));
    
    // Convert back to hex
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  recordSound(pitch) {
    this.sounds.push(pitch);
  }

  togglePlayback() {
    if (this.isPlaying) {
      this.stopSequence();
    } else {
      this.playSequence();
    }
  }

  playSequence() {
    if (this.finalSounds.length === 0) return;

    // Create audio effects based on note position
    let x = this.note.position().x;
    let y = this.note.position().y;

    // Map position to effect parameters
    let panAmount = constrain(
      map(x, boardX, boardX + boardSize, -1, 1),
      -1,
      1
    );

    let delayAmount = constrain(
      map(y, boardY, boardY + boardSize, 0, 0.5),
      0,
      0.5
    );

    // Use the current volume value
    let volumeAmount = this.volume;

    // Console log the pan, delay, and volume amounts
    console.log(`Sticky Note - Pan: ${panAmount.toFixed(2)}, Delay: ${delayAmount.toFixed(2)}, Volume: ${volumeAmount.toFixed(2)}`);

    // Update effect parameters
    this.panner.pan.value = panAmount;
    this.delay.delayTime.value = delayAmount;
    this.gainNode.gain.value = volumeAmount;

    // Create a temporary sampler just for this sequence with our effects chain
    let noteSpecificSampler = new Tone.Sampler({
      A1: "samples/casio/A1.mp3",
      B1: "samples/casio/B1.mp3",
      C2: "samples/casio/C2.mp3",
      D2: "samples/casio/D2.mp3",
      E2: "samples/casio/E2.mp3",
      F2: "samples/casio/F2.mp3",
      G2: "samples/casio/G2.mp3",
    }).connect(this.gainNode); // Connect to our effects chain

    // Create a new sequence specific to this sticky note
    this.sequence = new Tone.Sequence(
      (time, note) => {
        if (note !== null) {
          let currentVolume = this.volumeSlider.value();
          noteSpecificSampler.triggerAttackRelease(note, "8n", time, currentVolume);
        }
      },
      this.finalSounds,
      "8n"
    );
    
    this.sequence.loop = true;
    this.sequence.start(0);
    Tone.Transport.start();

    this.isPlaying = true;
    this.playButton.html("Pause");
    
    // Store the sampler so we can dispose of it later
    this.noteSpecificSampler = noteSpecificSampler;
  }
  
  stopSequence() {
    if (this.sequence) {
      this.sequence.stop();
      this.sequence.dispose();
      this.sequence = null;
    }
    
    // Dispose of the temporary sampler
    if (this.noteSpecificSampler) {
      this.noteSpecificSampler.dispose();
      this.noteSpecificSampler = null;
    }
    
    this.isPlaying = false;
    this.playButton.html("Play");
  }
}