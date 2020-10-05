// var five = require("johnny-five"),
//   board, motor, led;

// board = new five.Board();

// board.on("ready", function() {
//   // Create a new `motor` hardware instance.
//   motor = new five.Motor({
//     pin: 5
//   });

//   // Inject the `motor` hardware into
//   // the Repl instance's context;
//   // allows direct command line access
//   board.repl.inject({
//     motor: motor
//   });

//   // Motor Event API

//   // "start" events fire when the motor is started.
//   motor.on("start", function() {
//     console.log("start", Date.now());

//     // Demonstrate motor stop in 2 seconds
//     board.wait(110000, function() {
//       motor.stop();
//     });
//   });

//   // "stop" events fire when the motor is stopped.
//   motor.on("stop", function() {
//     console.log("stop", Date.now());
//   });

//   // Motor API

//   // start([speed)
//   // Start the motor. `isOn` property set to |true|
//   // Takes an optional parameter `speed` [0-255]
//   // to define the motor speed if a PWM Pin is
//   // used to connect the motor.
//   motor.start();

//   // stop()
//   // Stop the motor. `isOn` property set to |false|
// });

///////////////////////////////////////////////////////////////////////
// var five = require("johnny-five");
// var keypress = require("keypress");
// var board = new five.Board();


// board.on("ready", function() {
//   var speed, commands, motors;

//   speed = 100;
//   commands = null;
//   motors = {
//     a: new five.Motor([5, 13]),
//     b: new five.Motor([3, 11])
//   };

//   this.repl.inject({
//       motors: motors
//   });

//   function controller(ch, key) {
//     if (key) {
//       if (key.name === "space") {
//         motors.a.stop();
//         motors.b.stop();
//       }
//       if (key.name === "up") {
//         motors.a.rev(speed);
//         motors.b.fwd(speed);
//       }
//       if (key.name === "down") {
//         motors.a.fwd(speed);
//         motors.b.rev(speed);
//       }
//       if (key.name === "right") {
//         motors.a.fwd(speed * 0.75);
//         motors.b.fwd(speed * 0.75);
//       }
//       if (key.name === "left") {
//         motors.a.rev(speed * 0.75);
//         motors.b.rev(speed * 0.75);
//       }

//       commands = [].slice.call(arguments);
//     } else {
//       if (ch >= 1 && ch <= 9) {
//         speed = five.Fn.scale(ch, 1, 9, 0, 255);
//         controller.apply(null, commands);
//       }
//     }
//   }


//   keypress(process.stdin);

//   process.stdin.on("keypress", controller);
//   process.stdin.setRawMode(true);
//   process.stdin.resume();
// });

//////////////////////////////////////////////////////////////////
var five = require("johnny-five");
var keypress = require("keypress");
var board = new five.Board();
board.on("ready", function() {
  var motorL = new five.Motor([3, 12]);
  var motorR = new five.Motor([5, 13]);
  // Reverse the motor at maximum speed
 // motor1.reverse(255);
 var speed = 150;
        if (key == "space") {
        motorL.stop();
        motorR.stop();
      }
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