let pw=20;
let ph=20;

let cw,ch;

let video;

function setup() {
  createCanvas(300, 300);
  cw=width/pw;
  ch=height/ph;
  video=createCapture(VIDEO);
  video.hide();
   // Use HSB color.
  colorMode(HSB);
}

function draw() {
  background(220);
  let cImage=video.get();
  let wr=floor(cImage.width/pw);
  let hr=floor(cImage.width/ph);
  noStroke();
  cImage.loadPixels();
  for (j=0; j<ph; j++) {
    for (i=0; i<pw; i++) {
      let imageI=i*wr;
      let imageJ=j*hr;
      let h=cImage.pixels[(imageI+imageJ*cImage.width)*4];
      let s=cImage.pixels[(imageI+imageJ*cImage.width)*4+1];
      let b=cImage.pixels[(imageI+imageJ*cImage.width)*4+2];

      if (b>50) {
        fill(255)
      rect(i*cw,j*ch,cw,ch);
      } else {
        fill(0)
 
      rect(i*cw,j*ch,cw,ch);}
      
    }
  }
}