let ball1,ball2;

function setup() {
  createCanvas(400, 400);
  ball1 = new Ball(20,20,10,0.5,0.5,"red");
  ball2 = new Ball(300,100,20,0.9,-0.9,"blue");
}

function draw() {
  background(220);
  ball1.draw();
  ball2.draw();
}

class Ball {
  
  constructor(xpos,ypos,w,dx,dy,ccolor){
    this.xpos = xpos;
    this.ypos = ypos;
    this.w = w;
    this.dx = dx;
    this.dy = dy;
    this.color = ccolor;
  }
  
  draw(){
  this.move(this.dx,this.dy);
  fill(this.color);
  circle(this.xpos,this.ypos,this.w);
  }
  
  move(){
    if((this.xpos+(this.w)/2)>=400 ||(this.xpos-(this.w)/2)<=0){
      this.dx=-this.dx;
    }
    if((this.ypos+(this.w)/2)>=400 || (this.ypos-(this.w)/2)<=0){
      this.dy=-this.dy;
    }
    
    this.xpos += this.dx;
    this.ypos += this.dy;
  }
}