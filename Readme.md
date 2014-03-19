## Jquery Orientation_lib.js
When this library performed the screen turn (portrait ⇔ landscape) in the mobile browser,
The publication of the rotary event, the acquisition of the screen width after the screen turn in the rotary event handler are possible.

## license
It is free software offered with MIT license and can use this library regardless of a personal use, business free.

## Support browser
* Mobile Safari（More than iOS Version4.0）
* Android Standard browser（More than Android Version2.1）
* Mobile Chrome（More than Version18）

## The environment that works
This library works in more than jQuery v1.7.2.
It is necessary to read the main body of jQuery earlier than this library.

```
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="jquery.orientation_lib.js"></script>
```

## Parameters
In this library, the user can acquire the following parameters in `orientation_event` event handler.

* `orientation(string:"portrait" or "landscape")` ： Screen display state (portrait, landscape)
* `width(int)` ： Screen width (theoretical value of resolution /pixcelRatio) of the existing screen state
* `height(int)` ： Screen height (theoretical value of resolution /pixcelRatio) of the existing screen state
* `availWidth(int)` : Available screen width (size of the drawing domain that does not include the fixation domains of the terminal)
* `availHeight(int)` : Available screen height (size of the drawing domain that does not include the domains such as the headers of the browser)

## Use example
The user defines the `orientation_event` event handler.

```
$(window).on('orientation_event', function(ev) {
    var orientation_str = "ORIENTATION: " + ev.orientation + "\n";
    orientation_str += "WIDTH: " + ev.width + "\n";
    orientation_str += "HEIGHT: " + ev.height + "\n";
    orientation_str += "A_WIDTH: " + ev.availWidth + "\n";
    orientation_str += "A_HEIGHT: " + ev.availHeight + "\n";
    alert(orientation_str);
});
```