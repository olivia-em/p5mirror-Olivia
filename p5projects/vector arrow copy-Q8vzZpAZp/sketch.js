function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  translate(200,200);  //origin is center 
  circle(0,0,20)
  var mouseVec = createVector(mouseX-200, mouseY-200);
  line(0,0,mouseVec.x, mouseVec.y);
  center = createVector(0,0)
  arrowHead(center, mouseVec)
  
}
function arrowHead(start, vector){
  push()   //start new drawing state
  var norm = createVector(vector.x, vector.y)
  norm.normalize()
  // applyMatrix(1,0,0,1,vector.x - start.x,vector.y - start.y)
  applyMatrix(norm.x,norm.y,-norm.y, norm.x, vector.x - start.x,vector.y - start.y)

  triangle(0,6,12,0,0,-6)
  pop()
}
