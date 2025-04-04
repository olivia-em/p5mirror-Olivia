let stickyNotes = [];
let boardX, boardY, boardSize, sw;
let dim;

function setup() {
  dim = min(windowWidth, windowHeight);
  sw = dim / 30;
  createCanvas(dim, dim - dim / 4);

  // Board Area
  boardX = dim / 4 + sw / 2;
  boardY = sw / 2;
  boardSize = dim - dim / 4 - sw;

  background(200);
  fill('#C18E69');
  stroke('#633c32');
  strokeWeight(sw);
  square(boardX, boardY, boardSize);

  // Create initial sticky note
  stickyNotes.push(new StickyNote(dim/35, dim/35));
}

function draw() {
  // Continuously check for notes that have been moved into the board
  for (let note of stickyNotes) {
    note.update();
  }
}

class StickyNote {
  constructor(x, y) {
    this.note = createDiv('Note');
    this.note.position(x, y);
    this.note.size(dim/6, dim/6);
    this.note.style('font-size', '16px');
    this.note.style('font-family', 'Comic Sans MS');
    this.note.style('background', 'orchid');
    this.note.style('padding', '5px');
    this.note.style('border', '2px solid purple');
    this.note.draggable();

    this.panel = createDiv('');
    this.panel.position(x, y * 23);
    this.panel.size(100,24);
    this.panel.style('background', 'orchid');
    this.panel.style('padding', '5px');
    this.panel.style('text-align', 'center');

    this.textInput = createInput('Note');
    this.textInput.size(90);
    this.textInput.parent(this.panel);

    this.textInput.input(() => {
      this.note.html(this.textInput.value());
    });

    this.moved = false;
  }

  update() {
    let x = this.note.position().x;
    let y = this.note.position().y;

    if (!this.moved && x > boardX && x < boardX + boardSize && y > boardY && y < boardY + boardSize) {
      this.moved = true;
      stickyNotes.push(new StickyNote(dim/35, dim/35)); // Create a new sticky note at the initial position
    }
  }
}
