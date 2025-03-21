let video;
let bodypose;
let myNose;
let keypoints;

function preload() {
  // bodypose = ml5.bodyPose("BlazePose");
  bodypose = ml5.bodyPose();
}

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  bodypose.detectStart(video, gotPoses);
}

function gotPoses(results) {
  print("Poses Loaded:");
  if (results) {
    if (results.length > 0) {
      // print(results[0]);
      keypoints = results[0].keypoints;
      //print(keypoints);
      /*
      if (results[0].nose.confidence>0.95) {
        myNose=results[0].nose;        
        print(myNose);
      }
      */
    }
  }
}

function draw() {
  background(220);
  image(video, 0, 0);
  /*
  if (myNose) {
    fill(255,0,0);
    circle(myNose.x,myNose.y,20);
  }
  */

  if (keypoints) {
    // print(keypoints[0]);
    for (let i = 0; i < keypoints.length; i++) {
      // circle(keypoints[i].x,keypoints[i].y,20);
      // print(keypoints);
    }

    if (keypoints.length > 0) {
      circle(keypoints[0].x, keypoints[0].y, 20);

      circle(keypoints[1].x, keypoints[1].y, 20);
      circle(keypoints[2].x, keypoints[2].y, 20);
      // circle((keypoints[9].x +keypoints[10].x)/2 ,(keypoints[9].y +keypoints[10].y)/2 ,20)
    }
  }
}
