class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.prev = this.pos.copy();
  }
  
  show() {
    strokeWeight(1);
    stroke(140, 210, 250, 255);
    line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);
  }
  
  update(maxSpeed) {
    if (this.pos.x > width) {
        this.pos.x = 0;
    }
    if (this.pos.x < 0) {
        this.pos.x = width;
    }
    if (this.pos.y > height) {
        this.pos.y = 0;
    }
    if (this.pos.y < 0) {
        this.pos.y = height;
    }
    this.prev = this.pos.copy();
    this.vel.add(this.acc);
    this.vel.limit(maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }
  
  follow(flowfield, scl, cols) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = flowfield[index];
    this.applyForce(force);
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
}