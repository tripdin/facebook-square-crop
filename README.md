# Facebook square crop

Facebook square crop is a small plugin that crops large Facebook profile pictures to square images larger than 50px (180x180px max). It queries the Facebook API for the [pic_crop](https://developers.facebook.com/docs/reference/fql/profile/pic_crop) field and calculates the correct offsets, directly client-side, in the browser.

## Requirements
* jQuery
* Facebook javascript SDK

## Usage
### Stylesheet

    /* Required styles */
    .square {
      overflow: hidden;
      width: 100px;
      height: 100px;
    }
    .square img {
      position: relative;
    }


### Markup

    <div class="square">
      <img class="fbImage${facebookId}" data-fb-id="${facebookId}" src="http://graph.facebook.com/${facebookId}/picture?type=large">
    </div>


### Javascript

    // create a deferred object
    var fbLoaded = $.Deferred();
    // create the facebook square crop object
    var fbSquareCrop = new FacebookSquareCrop(fbLoaded);

    // normal facebook init
    window.fbAsyncInit = function() {
      FB.init({
        ...
      });
      // tell the plugin that the API is ready to be used
      fbLoaded.resolve();
    };
    ...
    // crop the img elements and query facebook with a single request
    fbSquareCrop.debounce(facebookId);
    fbSquareCrop.debounce(facebookId2);

### Complete example
[example](http://tripdin.github.com/facebook-square-crop)

## Notes
This plugin supports two types of requests. When many pictures are to be displayed, it is recommended to use the `debounce` method, which will make a single request for all images. It is also possible to use the `instant` method, which will make one request for every image.

Call the `debounce` or `instant` method directly after the image element has been inserted into the DOM.

## License
MIT License
