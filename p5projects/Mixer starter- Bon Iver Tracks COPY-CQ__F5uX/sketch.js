let players = [];
let sliders = [];

// load a track
players[0] = new Tone.Player({
  url: "stems/blobtower.mp3",
  autostart: true,
});
players[0].toDestination();

players[1] = new Tone.Player({
  url: "stems/brazen_mo.mp3",
  autostart: true,
});
players[1].toDestination();

players[2] = new Tone.Player({
  url: "stems/breezy_point_rd.mp3",
  autostart: true,
});
players[2].toDestination();

players[3] = new Tone.Player({
  url: "stems/lower_long_lake.mp3",
  autostart: true,
});
players[3].toDestination();

function setup() {
  noCanvas();
  for (let i in players) {
    // create sliders
    sliders[i] = createSlider(-60, 0);
    sliders[i].id = i; 
    // connect the value of the slider to volume of the track
    sliders[i].input(volumeInput);
  }
}

function volumeInput() {
  console.log(this.id , this.value());
  players[this.id].volume.rampTo(this.value());
}

function draw() {
  background(220);
}
