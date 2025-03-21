let pw=100;
let ph=100;

let cw,ch;

let video;

function setup() {
  createCanvas(600, 600);
  cw=width/pw;
  ch=height/ph;
  video=createCapture(VIDEO);
  video.hide();
  pixelDensity(1);
}

function draw() {
  background(220);
  let cImage=video.get();
  let wr=floor(cImage.width/pw);
  let hr=floor(cImage.width/ph);
  noStroke();
  rectMode(CENTER);
  cImage.loadPixels();
  for (j=0; j<ph; j++) {
    for (i=0; i<pw; i++) {
      let imageI=i*wr;
      let imageJ=j*hr;
      let r=cImage.pixels[(imageI+imageJ*cImage.width)*4];
      let g=cImage.pixels[(imageI+imageJ*cImage.width)*4+1];
      let b=cImage.pixels[(imageI+imageJ*cImage.width)*4+2];
      fill(r,g,b);
      if (r>70) {
      rect(i*cw,j*ch,cw,ch);
      } else {
        fill(150,50,100)
       
      ellipse(i*cw,j*ch,cw,ch);}
      
    }
  }
}