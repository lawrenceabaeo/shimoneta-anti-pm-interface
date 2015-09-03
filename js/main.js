$(document).ready(function() {
  /******************************/
  /** 
      Countdown timer function modified 
      from code found here:
      http://stackoverflow.com/a/20618517
  ***/
  function CountDownTimer(duration, numberOfMillisecondsToWaitBeforeExecutingCode) {
    this.duration = duration;
    this.numberOfMillisecondsToWaitBeforeExecutingCode = numberOfMillisecondsToWaitBeforeExecutingCode || 10; // Check every 10 milliseconds
    this.tickFuntions = []; // functions to run during each tick
    this.running = false;
  }

  CountDownTimer.prototype.start = function() {
    // console.log("At the top of the timer start method"); // Only called once
    var start = Date.now(),
        that = this,
        diff, 
        obj;
    if (this.running) {
      // console.log("It's running"); // This is never invoked?
      return;
    }
    this.running = true;

    /******************************/
    (function timer() { // start of IIFE
      // console.log("in the timer IIFE");
      
      // How much time has already lapsed from when the timer started?
      diff = that.duration - (((Date.now() - start)) | 0);
      if (diff > 0) {
        setTimeout(timer, that.numberOfMillisecondsToWaitBeforeExecutingCode); // run this timer IIFE again
      } else {
        diff = 0;
        that.running = false;
      }
      
      // Create an object that has properties for time remaining
      objectOfTimeProperties = CountDownTimer.parseFromMilliseconds(diff);
      
      // Run functions that were passed into tickFunctions Array
      // In this app, the formatAndDisplayer function is passed in
      that.tickFuntions.forEach(function(ftn) {
        ftn.call(this, objectOfTimeProperties.minutes, 
                 objectOfTimeProperties.seconds, 
                 objectOfTimeProperties.centiseconds);
      }, that);
    }()); // end of IIFE
    /******************************/
  };

  // Get any functions passed in and put it into tickFunctions Array,
  // notice the IIFE function will run the tickFunctions Array
  CountDownTimer.prototype.onTick = function(ftn) {
    // console.log("In the onTick method");
    if (typeof ftn === 'function') {
      this.tickFuntions.push(ftn);
    }
    return this;
  };

  CountDownTimer.prototype.expired = function() {
    // Is the timer expired?
    // return true if timer is no longer running
    return !this.running;
  };

  // The format calculation is from here:
  // http://stackoverflow.com/a/29553068/4771469
  CountDownTimer.parseFromMilliseconds = function(milliseconds) {
    return {
      'minutes': (milliseconds / 60000) | 0,
      'seconds': ((milliseconds / 1000) % 60) | 0,
      'centiseconds': ((milliseconds / 10) % 100) | 0
    };
  };
  /******************************/

  
  var durationInSeconds = 5;
  var timer = new CountDownTimer(durationInSeconds * 1000),
      objectThatHasTimeProps = CountDownTimer.parseFromMilliseconds(durationInSeconds * 1000);
  function formatAndDisplayer(minutes, seconds, centiseconds) {
    // console.log("Updating inside formatAndDisplayer"); // This is called initially AND with each countdown
    minutes = minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    centiseconds = centiseconds < 10 ? "0" + centiseconds : centiseconds;
    $('#time').html(minutes + ':' + seconds + ':' + centiseconds);
  }
  
  // Get and display the initial start/remaining time
  formatAndDisplayer(objectThatHasTimeProps.minutes, 
                     objectThatHasTimeProps.seconds, 
                     objectThatHasTimeProps.centiseconds);
  
  // Give the format/display function to the onTick method, 
  // the onTick method will run this function whenever the 
  // timer object's timer method is run:
  timer.onTick(formatAndDisplayer);

  document.querySelector('button').addEventListener('click', 
    function () { 
      // console.log("About to trigger timer.start"); // Only called once
      timer.start(); 
  });
    

}); // end of $(document).ready(function() {





















