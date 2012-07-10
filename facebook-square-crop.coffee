
class FacebookSquareCrop
  # Wait threshold for debouncing.
  threshold: 100
  # Animation duration time after a facebook response.
  duration: 300
  # Deferred object for when the sdk has been initialized.
  dfd: null

  constructor: (dfd) ->
    @ids = []
    @dfd = dfd

  # Instantly queries the facebook api.
  instant: (id) ->
    @pre id
    @query id

  # Debounced function for querying the facebook api.
  # Gathers ids for a single request.
  debounce: (id) ->
    @pre id
    @ids.push id if $.inArray id, @ids >= 0

    delayed = =>
      @query @ids
      @ids = []
      @timeout = null

    if @timeout?
      clearTimeout @timeout

    @timeout = setTimeout delayed, @threshold

  # Queries facebook.
  query: (id) ->
    if $.isArray(id)
      selector = "id IN ("+id.join(",")+")"
    else
      selector = "id = "+id

    @dfd.done =>
      FB.api
        method: "fql.query"
        query: "SELECT id, pic_crop FROM profile WHERE "+selector
        (data) =>
          @crop data

  # Positions the image correctly.
  crop: (data) ->
    for item in data
      crop = item.pic_crop

      if crop.width > crop.height
        set = Math.min((crop.width / crop.height) * (crop.left / crop.bottom), 1 - (crop.height / (crop.width - 1)))
        style =
          "left": -set*100+"%"
          "height": "100%"
          "min-height": "100%"
      else if crop.height > crop.width
        set = Math.min(crop.top, 1 - (crop.width / (crop.height - 1)))
        style =
          "top": -set*100+"%"
          "height": "auto"
          "width": "100%"
      else
        style =
          "height": "auto"
          "width": "100%"

      $(".fbImage" + item.id).css style
      @post item.id

  pre: (id) ->
      $(".fbImage" + id).css "display", "none"
  post: (id) ->
      $(".fbImage" + id).fadeIn @duration

window.FacebookSquareCrop = FacebookSquareCrop
