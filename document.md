## Commentary of the processing

In this report, I comment on handling of orientation_lib.js content.

In addition, it does not support all mobile browsers because I check the operation in this library only at a terminal in the hand of the author.  
I may deal by the following method if there is the terminal where this library does not work normally.

## Problems of the orientationchange event

When a screen turn was carried out, orientationchange event is published by the mobile browser basically,
When, by an event handler of orientationchange, I acquire the width of the window object long, width,  
That, depending on a mobile browser, can acquire only a value before a screen turns; have a problem.  
(this is the process that made this library)

When a screen turn was carried out, resize event may be published by the mobile browser,  
When, by resize event handler, I acquire the width of the window object long, width,  
I can acquire the value after the screen turn, but cannot distinguish the turn of the screen with this handler.  
(The resize event is published as well as a screen turn in various opportunities)

I publish custom event (orientation_event) in this library by putting these two together,
I enable the acquisition with the screen length width after the turn, a value of the width while detecting a screen turn.

## Processing flow

The flow until orientation_event event publication is as follows.

1. By onload event handler, this library maintain a value of length and breadth orientation  
   (To distinguish portrait or landscape from a size comparison here with a value of orientation)
2. This library detects a screen change by orientationchange event  
3. This library publishes custom event (orientation_event) by resize event to occur just after that  
   (To acquire the screen length width after the screen turn, width)
4. This library ignores the resize event to occur in other timings

※ But because handling of orientationchange and resize is a mobile browser, and there is a difference,  
  It is necessary to distribute processing by pattern distinction to mention later each.

## Publication pattern of orientationchange and resize

The place that carried out an investigation at the time of a screen turn at a terminal in the hand,  
By a mobile browser, the publication pattern of orientationchange event and the resize event is as follows.

* A ： orientationchange → resize 
* B ： orientationchange → resize → resize 
* C ： resize → orientationchange 
* D ： resize 
* E ： resize → resize → orientationchange

※ But the subjects of survey are only Safari, Android standard browser, Mobile Chrome.

## Correspondence method according to each pattern

I divided the correspondence of this library in each browser into the cause by the pattern mentioned above as follows.

### Overall Android standard browser (when a browser corresponds to pattern A)

Because it is the case that orientation event handler does not enable the size acquisition after the screen turn, I acquire this library by resize event handler.  
orientation(Flag ON)→resize(Flag ON generates a custom event)

### Overall iOS Safari (a browser corresponds to pattern A, B, C)

Event order is different in each version,  
In the case of iOS, I can acquire the size after the screen turn by orientationchange event handler.  
Thus, this library generates a custom event in defiance of resize event if orientationchange event is published.

### Overall Mobile Chrome (a browser corresponds to pattern B, E)

As for the event, either pattern B and E is published in random,; but this library  
The size after the screen turn can acquire Chrome by orientationchange event handler like Safari, too.  
Thus, this library generates a custom event in defiance of resize event if orientationchange event is published.

### An exception case: IS11S standard browser (a browser corresponds to pattern C)

An event is blown off in order of only (?) pattern C in Android.  
Fortunately, because I can acquire the size after the screen turn in orientationchange,  
If orientationchange occurs like Safari, Chrome, this library generates a custom event.

### An exception case: IS03[Android2.1-1] standard browser (a browser corresponds to pattern D)

The only (?)orientationchange event is not published in Android.  
But because I can acquire size and window.orientation (rotary state of the screen) after the screen turn by resize event handler,  
I consider this library to be a turn at the time of resize event publication if different from a value in a value of `window.orientation` last time and generate a custom event.

## The collection of the pattern
Two patterns can gather it than the above.

* Pattern01 ： The case which has to acquire screen width in a timing of orientationchange → resize
* Pattern02 ： The case which this library acquires screen width only in orientationchange, and does not have any problem

## Matters that require attention

It becomes out of movement security without being able to expect normal movement when there is the browser that was off a pattern of A - E.  
If it is the case which does not fulfill the correspondence method according to each pattern mentioned above although a browser corresponds to a pattern of A - E,  
a user can do recovery in the state that this library can work by adding an exception definition.
(For example, when it is Mobile Chrome, but corresponds to a pattern of D)

## Method of the exception definition

The user appoints a distinction level of the browser concerned in a pattern defining the constant at the constructer of this library (plural designated possibility).  
The distinction level assumes it the character string that I can acquire from the user agent, and it and the browser that I matched are not the patterns mentioned above,  
We will be holding the processing by the pattern that I defined here.
But, please define the character string that can limit a mobile browser.
(Prevent you from appointing the character string of the wide sense such as `Chrome` and `Android` because it is dangerous)

```
var CustomOrientationEvent = function() {
	this.PAT_01 = new Array(/Chrome\/33.0.1750.146/); // Only when it accesses it in Version33.0.1750.146 of Chrome
	this.PAT_02 = new Array(/SonyEricssonIS11S/);
```
