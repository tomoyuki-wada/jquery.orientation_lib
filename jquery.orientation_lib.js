/*!
 * jQuery Orientation_lib v1.0.1
 * https://github.com/
 *
 * Copyright 2014 Tomoyuki Wada
 * Released under the MIT license
 */

// onload
$(function() {
  var custom_orient = new CustomOrientationEvent();
  var orientation_val = window.orientation;
  $(window).on("resize",function(){
    if (custom_orient.checkChrome() || 
        custom_orient.checkIos() || 
        custom_orient.checkPattern_02()){
          return;
    }
    else if ((custom_orient.change_flag && 
              custom_orient.checkAndroid()) || 
             (custom_orient.checkAndroidLowerVersion(2.2) && 
              custom_orient.checkOrientationAndroid()) || 
              custom_orient.checkPattern_01()){
      custom_orient.setOrientationEvent();
      custom_orient.change_flag = false;
    }
  });
  
  $(window).on("orientationchange",function(){
    if (custom_orient.checkChrome() || 
        custom_orient.checkIos() || 
        custom_orient.checkPattern_02()){
        custom_orient.setOrientationEvent();
    }
    else {
      var new_orient_val = window.orientation;
      if (orientation_val != new_orient_val) {
        orientation_val = new_orient_val;
        custom_orient.change_flag = true;
      }
    }
  });
});

// Constructer
function CustomOrientationEvent() {
  this.PAT_01 = "";
  this.PAT_02 = new Array(/SonyEricssonIS11S/);
  this.load_width = $(window).width();
  this.or_val = window.orientation;
  this.or_param = "portrait";
  this.save_height = 0;
  this.change_flag = false;
  
  if (this.or_val == 0 || this.or_val == 180){
    this.load_orientation = "portrait";
  }
  else {
    this.load_orientation = "landscape";
  }
}

// Custom event class.
CustomOrientationEvent.prototype = {

  // Create custom event
  setOrientationEvent : function() {
    var re_orient = window.orientation;
    var re_width = $(window).width();
    var re_height = $(window).height();
    
    if(this.save_height == 0) {
      this.save_height = re_width;
    }
      
    if (re_orient == 0 || re_orient == 180){
      this.or_param = "portrait";
    }
    else {
      this.or_param = "landscape";
    }
      
    var out_width = 0;
    var out_height = 0;
    if (this.or_param == this.load_orientation){
      out_width = this.load_width;
      out_height = this.save_height;
    }
    else {
      out_width = this.save_height;
      out_height = this.load_width;
    }
    
    // Definition of the custom event.
    var orientation_event = new $.Event("orientation_event", {
      orientation: this.or_param, 
      width: out_width, 
      height: out_height, 
      availWidth: re_width, 
      availHeight: re_height
    });
    $(window).trigger(orientation_event);
  
  },
  
  // Terminals rotary judgment less than Android2.1.
  checkOrientationAndroid : function() {
    var now_orient = window.orientation;
    if (this.or_val != now_orient){
      this.or_val = now_orient;
      return true;
    }
    else {
      return false;
    }
  },
  
  // Android check
  checkAndroid : function() {
    var ua = navigator.userAgent; 
    if(ua.match(/Android/)){
      return true;
    }
    return false;
  },
  
  // Android version check(ver less than argument is true)
  checkAndroidLowerVersion : function(ver) {
    var bo = false;
    var ua = navigator.userAgent.toLowerCase();
    var version = ua.substr(ua.indexOf('android')+8, 3);
    if(ua.indexOf("android")) if(parseFloat(version) < ver) bo = true;
    return bo;
  },
  
  // iOS check
  checkIos : function() {
    var ua = navigator.userAgent; 
    if(ua.match(/iPhone/) || ua.match(/iPad/)){
      return true;
    }
    return false;
  },
  
  // Chrome check
  checkChrome : function() {
    var ua = navigator.userAgent; 
    if(ua.match(/Chrome/)){
      return true;
    }
    return false;
  },

  checkPattern_01 : function() {
    var ua = navigator.userAgent; 
    for (var i = 0; i < this.PAT_01.length; i++) {
      if(ua.match(this.PAT_01[i])){
        return true;
      }
    }
    return false;
  },

  checkPattern_02 : function() {
    var ua = navigator.userAgent; 
    for (var i = 0; i < this.PAT_02.length; i++) {
      if(ua.match(this.PAT_02[i])){
        return true;
      }
    }
    return false;
  }
};
