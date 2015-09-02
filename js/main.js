$(document).ready(function() {
  /******************************/
  /** 
      Countdown timer function modified 
      from code originally found here:
      http://stackoverflow.com/a/20618517
  ***/
  function CountDownTimer(duration, granularity) {
    // data validation on duration and granularity?
    this.duration = duration;
    // this.granularity = granularity || 1000;
    this.granularity = granularity || 10; // Check every 10 milliseconds
    this.tickFtns = [];
    this.running = false;
  }

  CountDownTimer.prototype.start = function() {
    var start = Date.now(),
        that = this,
        diff, obj;
    if (this.running) {
      return;
    }
    this.running = true;

    (function timer() {
      // diff = that.duration - (((Date.now() - start) / 1000) | 0);
      diff = that.duration - (((Date.now() - start)) | 0);
      if (diff > 0) {
        setTimeout(timer, that.granularity);
      } else {
        diff = 0;
        that.running = false;
      }

      obj = CountDownTimer.parse(diff);
      that.tickFtns.forEach(function(ftn) {
        ftn.call(this, obj.minutes, obj.seconds, obj.centiseconds);
      }, that);
    }());
  };

  CountDownTimer.prototype.onTick = function(ftn) {
    if (typeof ftn === 'function') {
      this.tickFtns.push(ftn);
    }
    return this;
  };

  CountDownTimer.prototype.expired = function() {
    return !this.running;
  };

  // Got the format calculation from here:
  // http://stackoverflow.com/a/29553068/4771469
  CountDownTimer.parse = function(milliseconds) {
    return {
      'minutes': (milliseconds / 60000) | 0,
      'seconds': ((milliseconds / 1000) % 60) | 0,
      'centiseconds': ((milliseconds / 10) % 100) | 0
    };
  };
  /******************************/

  
  
  var timer = new CountDownTimer(65 * 1000),
      timeObj = CountDownTimer.parse(65 * 1000);

  format(timeObj.minutes, timeObj.seconds, timeObj.centiseconds);
    
  timer.onTick(format);
           
  document.querySelector('button').addEventListener('click', 
    function () { timer.start(); });
    
  function format(minutes, seconds, centiseconds) {
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    centiseconds = centiseconds < 10 ? "0" + centiseconds : centiseconds;
    $('#time').html(minutes + ':' + seconds + ':' + centiseconds);
  }

}); // end of $(document).ready(function() {