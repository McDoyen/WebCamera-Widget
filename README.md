# Web camera
Allows users to take and save pictures on their mendix applications.

## Features
* Supports webp, jpeg and png image file formats
* Set capturing window dimensions
* Take pictures and store them
* Detect presence of multi camera devices
* Swap between the different camera devices

## Dependencies
Mendix 7.6

## Demo project
https://webcamera-widget.mxapps.io/

## Usage
The widget requires a context and should be configured as shown below.
 ### Image
 #### File type
    The file format of image/photo that is taken and stored.
 #### Image Filter
    The filter type to applied to the capturing window of the web cam.
 #### Select Entity type
    An entity that inherits/generalized from system.images is selected.
### Capturing window
 #### Width unit
    The unit to be applied to the width of the capturing window.
 #### Height unit
    The unit to be applied to the height of the capturing window.
 #### Max resolution width
    The value of the width property of the capturing window.
 #### Max resolution height
    The value of the height property of the capturing window.
### Button captions
 #### Capture button
     The label on the take picture button.
 #### Recapture button
    The label on the retake picture button.
 #### OK button
    The label on the use picture button.
 #### Capture icon
    Icon displayed to take pictures onn the web cam.
 #### Use picture icon
    Icon displayed to save the photo captured.
 #### Switch camera icon
    Icon displayed to call the switch camera function.
 #### Label to use
    The kind of labels to be used for the onclick events in the widget

## Issues, suggestions and feature requests
Please report issues at [https://github.com/McDoyen/WebCamera-Widget/issues](https://github.com/McDoyen/WebCamera-Widget/issues)

## Development and contribution
Please follow [development guide](/development.md)
