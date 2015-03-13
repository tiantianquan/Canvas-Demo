var util = {}

util.hackHighDpi = function(canvas, ctx) {
  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStorePixelRatio = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;

  var ratio = devicePixelRatio / backingStorePixelRatio;

  if (devicePixelRatio !== backingStorePixelRatio) {
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';

    ctx.scale(ratio, ratio);
  }
}

util.loop = function(callback) {
  callback()
  requestAnimationFrame(function() {
    util.loop(callback)
  })
}

util.copyArray = function(arr) {
  var copy = []
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].length !== undefined && typeof(arr[i]) === 'object') {
      copy[i] = this.copyArray(arr[i])
    } else {
      copy[i] = arr[i]
    }
  }
  return copy
}

util.random = function() {
  function _random(min, max) {
    var dis = max - min
    var result = min + dis * Math.random()
    return result
  }

  //一个区间
  if (typeof(arguments[0]) === 'number') {
    return _random(arguments[0], arguments[1])
  }
  //多个区间
  else {
    var target = Math.round(_random(0, arguments.length-1))
    return _random(arguments[target][0],arguments[target][1])
  }
}

util.getTime = function(callback) {
  var t = Date.now()
  callback()
  t = Date.now() - t
  var timeDom = document.createElement('DIV')
  timeDom.innerText = t
  timeDom.style.position = 'absolute'
  var b = document.getElementsByTagName('BODY')
  b[0].appendChild(timeDom)
}