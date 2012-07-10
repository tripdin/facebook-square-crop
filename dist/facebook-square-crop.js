// Generated by CoffeeScript 1.3.3
(function() {
  var FacebookSquareCrop;

  FacebookSquareCrop = (function() {

    FacebookSquareCrop.prototype.threshold = 100;

    FacebookSquareCrop.prototype.duration = 300;

    FacebookSquareCrop.prototype.dfd = null;

    function FacebookSquareCrop(dfd) {
      this.ids = [];
      this.dfd = dfd;
    }

    FacebookSquareCrop.prototype.instant = function(id) {
      this.pre(id);
      return this.query(id);
    };

    FacebookSquareCrop.prototype.debounce = function(id) {
      var delayed,
        _this = this;
      this.pre(id);
      if ($.inArray(id, this.ids >= 0)) {
        this.ids.push(id);
      }
      delayed = function() {
        _this.query(_this.ids);
        _this.ids = [];
        return _this.timeout = null;
      };
      if (this.timeout != null) {
        clearTimeout(this.timeout);
      }
      return this.timeout = setTimeout(delayed, this.threshold);
    };

    FacebookSquareCrop.prototype.query = function(id) {
      var selector,
        _this = this;
      if ($.isArray(id)) {
        selector = "id IN (" + id.join(",") + ")";
      } else {
        selector = "id = " + id;
      }
      return this.dfd.done(function() {
        return FB.api({
          method: "fql.query",
          query: "SELECT id, pic_crop FROM profile WHERE " + selector
        }, function(data) {
          return _this.crop(data);
        });
      });
    };

    FacebookSquareCrop.prototype.crop = function(data) {
      var crop, item, set, style, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        item = data[_i];
        crop = item.pic_crop;
        if (crop.width > crop.height) {
          set = Math.min((crop.width / crop.height) * (crop.left / crop.bottom), 1 - (crop.height / (crop.width - 1)));
          style = {
            "left": -set * 100 + "%",
            "height": "100%",
            "min-height": "100%"
          };
        } else if (crop.height > crop.width) {
          set = Math.min(crop.top, 1 - (crop.width / (crop.height - 1)));
          style = {
            "top": -set * 100 + "%",
            "height": "auto",
            "width": "100%"
          };
        } else {
          style = {
            "height": "auto",
            "width": "100%"
          };
        }
        $(".fbImage" + item.id).css(style);
        _results.push(this.post(item.id));
      }
      return _results;
    };

    FacebookSquareCrop.prototype.pre = function(id) {
      return $(".fbImage" + id).css("display", "none");
    };

    FacebookSquareCrop.prototype.post = function(id) {
      return $(".fbImage" + id).fadeIn(this.duration);
    };

    return FacebookSquareCrop;

  })();

  window.FacebookSquareCrop = FacebookSquareCrop;

}).call(this);
