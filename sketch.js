let video;
let poseNet;
let pose; 
let skeleton;
let brain;
let count;
let poselabel ="...";
//**********hardware************/
var five = require("johnny-five");
var keypress = require("keypress");
var board = new five.Board();
//*******************/
let state = 'waiting';
let targetlabel;

function keyPressed(){
    if(key=='s'){
        brain.saveData();
    }
    else{
    targetlabel = key;
    console.log(targetlabel);

    setTimeout(function(){
        console.log('collecting');
        state='collecting';

        setTimeout(function(){
            console.log('notcollecting');
            state='waiting';
        },10000);  

    },10000);  
}

}

function setup(){
    createP('NodeBot : { Try staying inside frame. Move left and right slowly and stay in position. }');
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide(); 
    background(240);
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose',gotPoses);
    //

    let options = {
        inputs: 34, //fixed
        outputs: 4, // req. output numbers
        task: 'classification',
        debug: true
    }
     brain = ml5.neuralNetwork(options);
    const modelDetails = {
       model: 'model/model.json',
       metadata: 'model/model_meta.json',
       weights: 'model/model.weights.bin'
     };
   
 brain.load(modelDetails,brainLoaded);
//brain.loadData('left_right.json', dataReady);
}
  
    function brainLoaded(){
        console.log("pose classify ready");
        classifyPose();
    }

        function classifyPose(){
            if(pose){
                let inputs = [];
                for(let i=0; i<pose.keypoints.length; i++){
                    let x = pose.keypoints[i].position.x;
                    let y = pose.keypoints[i].position.y;
                   inputs.push(x);
                   inputs.push(y);
                }
                brain.classify(inputs, gotResult);
            } else {
                setTimeout(classifyPose,100);
            }
        }

        function gotResult(error, results){
       //console.log(results);
            if(results[0].confidence){
                count=count+1;
            poselabel = results[0].label.toUpperCase();
             console.log(results[0].label);
            console.log(results[0].confidence);
            console.log(count);
                       }
                                  classifyPose();
        }

    function dataReady(){
        brain.normalizeData();
        brain.train({epochs:70 }, finish);
    }

    function finish(){
        console.log('model trained');
        brain.save();
    }

function gotPoses(poses){
    console.log(poses);
    if(poses.length>0){
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
        //
        if(state == 'collecting'){
        let inputs = [];
        for(let i=0; i<pose.keypoints.length; i++){
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
           inputs.push(x);
           inputs.push(y);
        }
        let target = [targetlabel];

        brain.addData(inputs,target);
    }
    }
}

function modelLoaded(){
    console.log('ready');
}

function draw(){ 
    push();
     translate(width,0);
     scale(-1,1);
    image(video,0,0,width,height);
    if(pose){

        let righteye=pose.rightEye;
        let lefteye=pose.leftEye;
        let distance = dist(righteye.x,righteye.y,lefteye.x,lefteye.y);


    fill(255,0,0);
    ellipse(pose.nose.x, pose.nose.y,distance);
    fill(255,255,0);
    ellipse(pose.rightWrist.x, pose.rightWrist.y,distance);
    fill(255,0,255);
    ellipse(pose.leftWrist.x, pose.leftWrist.y,distance);

    for(let i=0; i<pose.keypoints.length; i++){
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        fill(0,255,0);
        ellipse(x,y,16,16);
        // display body part name
       let bodypart = pose.keypoints[i].part;
       textSize(20);
       text(bodypart, x, y);
        //display accuracy
        let score = pose.keypoint[i].score;
        text(score, x, y);

    }

      for(let i=0; i<skeleton.length ; i++){
          let x0 = skeleton[i][0].position.x;
          let y0 = skeleton[i][0].position.y;
          let x1 = skeleton[i][1].position.x;
          let y1 = skeleton[i][1].position.y;

        // line property
        strokeWeight(2);
        stroke(255);

        // draw line
          line(x0,y0,x1,y1);

      }
}
pop();
fill(255,0,255);
noStroke();
textSize(256);
textAlign(CENTER,CENTER);
text(poselabel,width/2,height/2);
try{
    text(count,0,height+1);
} catch {
    text('count = 0 ',0,height+1);
}
//  ***********************HARDWARE ******************************
board.on("ready", function() {
    var motorL = new five.Motor([3, 12]);
    var motorR = new five.Motor([5, 13]);
    // Reverse the motor at maximum speed
   // motor1.reverse(255);
   var speed = 150;
   //TO STOP MOTION     
        if (key == "space") {
          motorL.stop();
          motorR.stop();
        }
        //MOTION CONTROL 
        if (poselabel == "L") {
          motorL.rev(speed);
          motorR.fwd(speed);
        }
        if (poselabel == "R") {
          motorL.fwd(speed);
          motorR.rev(speed);
        }
        if (poselabel == "F") {
          motorL.fwd(speed * 0.75);
          motorR.fwd(speed * 0.75);
        }
        if (poselabel == "B") {
          motorL.rev(speed * 0.75);
          motorR.rev(speed * 0.75);
        }
  });

  // **************************HARDWARE END*************************
}
