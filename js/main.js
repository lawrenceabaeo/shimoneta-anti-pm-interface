$(document).ready(function() {
  /******************************************/
  // Start of all the Countdown Timer stuff
  /** 
      Countdown timer function modified from:
      http://stackoverflow.com/a/20618517
  **/
  function CountDownTimer(duration, numberOfMillisecondsToWaitBeforeExecutingCode) {
    this.duration = duration;
    this.numberOfMillisecondsToWaitBeforeExecutingCode = numberOfMillisecondsToWaitBeforeExecutingCode || 10; // Check every 10 milliseconds
    this.tickFuntions = []; // functions to run during each tick
    this.running = false;
    this.lastDiff;
    this.remainingTimeThatWasLeftWhenPaused;
  }

  CountDownTimer.prototype.start = function() {
    // console.log("At the top of the timer start method"); // Only called once
    // console.log("this.lastDiff is: " + this.lastDiff);
    var that = this,
        startTime = Date.now(), 
        objectOfTimeProperties;
    if (this.running) {
      // console.log("It's already running"); // This is never invoked?
      return;
    }
    this.running = true;
    
    
    /******************************/
    // start of the IIFE
    
    (function timer() { 
      // console.log("in the timer IIFE");
      // console.log("that.running is: " + that.running);
      
      if (that.running === true) {
        
        // How much time has already lapsed from when the timer started?
        if (that.remainingTimeThatWasLeftWhenPaused === undefined) { // calculate remaining time using max duration
          that.lastDiff = that.duration - (((Date.now() - startTime)) | 0);
        } else { // calculate remaining time using the time that was remaining after the last pause
          that.lastDiff = that.remainingTimeThatWasLeftWhenPaused - (((Date.now() - startTime)) | 0);
        }
        if (that.lastDiff > 0) {
          setTimeout(timer, that.numberOfMillisecondsToWaitBeforeExecutingCode); // run this timer IIFE again
        } else {
          that.lastDiff = 0;
          that.remainingTimeThatWasLeftWhenPaused = undefined;
          that.running = false;
        }

        // Create an object that has properties of the time remaining
        objectOfTimeProperties = CountDownTimer.parseFromMilliseconds(that.lastDiff);

        // Run functions that were passed into tickFunctions Array
        // In this app, the formatAndDisplayer function is passed in
        that.tickFuntions.forEach(function(ftn) {
          ftn.call(this, objectOfTimeProperties.minutes, 
                   objectOfTimeProperties.seconds, 
                   objectOfTimeProperties.centiseconds);
        }, that);
      } // end of if branch
    }());
    
    // end of the IIFE
    /******************************/
    
    
  }; // end of CountDownTimer.prototype.start

  CountDownTimer.prototype.onTick = function(ftn) {
    // Get functions passed into onTick and put it into tickFunctions Array
    // ...notice the IIFE function will run the tickFunctions Array
    // console.log("In the onTick method");
    if (typeof ftn === 'function') {
      this.tickFuntions.push(ftn);
    }
    return this;
  };
  
  CountDownTimer.parseFromMilliseconds = function(milliseconds) {
    // The format calculation is from here:
    //   http://stackoverflow.com/a/29553068/4771469
    return {
      'minutes': (milliseconds / 60000) | 0,
      'seconds': ((milliseconds / 1000) % 60) | 0,
      'centiseconds': ((milliseconds / 10) % 100) | 0
    };
  };
  
  CountDownTimer.prototype.stop = function() {
    this.running = false;
    this.remainingTimeThatWasLeftWhenPaused = this.lastDiff;
  };
  
  CountDownTimer.prototype.expired = function() {
    // Is the timer expired?
    // return true if timer is no longer running
    return !this.running;
  };
  
  // End of all the Countdown Timer stuff
  /******************************************/
  

  
  /******************************************/
  // Start of the 'app' in action: 
  
  // 'app' variables and functions:
  var durationInSeconds = 3*60;
  var timer = new CountDownTimer(durationInSeconds * 1000),
      objectThatHasTimeProps = CountDownTimer.parseFromMilliseconds(durationInSeconds * 1000);
  function formatAndDisplayer(minutes, seconds, centiseconds) {
    // console.log("Updating inside formatAndDisplayer"); // This is called initially AND with each countdown
    minutes = minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    centiseconds = centiseconds < 10 ? "0" + centiseconds : centiseconds;
    $('#time').html(minutes + ':' + seconds + ':' + centiseconds);
  }
  
  // 'app' party starts here:
  // Get and display the initial start/remaining time
  formatAndDisplayer(objectThatHasTimeProps.minutes, 
                     objectThatHasTimeProps.seconds, 
                     objectThatHasTimeProps.centiseconds);
  
  // Give the format/display function to the onTick method, 
  // the onTick method then places that function in an Array,
  // and the timer object's IIFE will run functions from that Array
  timer.onTick(formatAndDisplayer);
  
  // Start listening:
  document.querySelector('.start').addEventListener('click', 
    function () { 
      // console.log("About to trigger timer.start"); // Only called once
      timer.start(); 
  });
  document.querySelector('.stop').addEventListener('click', 
    function () { 
      timer.stop();
  });
  document.querySelector('.ok-button').addEventListener('click', 
    function () { 
      if (timer.running === false) {  
        timer.start();
      } else {
        timer.stop();
      }
  });
  // End of the 'app' in action
  /******************************************/
  

}); // end of $(document).ready(function() {





















