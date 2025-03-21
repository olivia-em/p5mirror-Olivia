class Track{
  constructor(i, name, url){
    this.i = i;
    
    this.player = new Tone.Player(url);
    this.player.toDestination();
    this.meter = new Tone.Meter();
    this.meter.normalRange = true;
    this.player.connect(this.meter);
    
    this.color = color(random(0, 360), 100, 100);
    
    this.slider = createSlider(-60, 0);
    this.slider.input(this.setVolume.bind(this));
    // this.label = createSpan(name);
  }
  setVolume(){
    this.player.volume.rampTo(this.slider.value());
  }
  draw(){
    fill(100);
    rect(this.i*40, 0, 40, height);
    fill(this.color);
    let h = this.meter.getValue()*height*2;
    rect(this.i*40, height-h, 40, height);
  }
}