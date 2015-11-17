 // Using https://github.com/reactjs/react-timer-mixin

'use strict';

import * as Extension from 'react-component-extension';

var GLOBAL = typeof window === 'undefined' ? global : window;

var setter = function(_setter, _clearer, array) {
  return function(callback, delta) {
    var id = _setter(function() {
      _clearer.call(this, id);
      callback.apply(this, arguments);
    }.bind(this), delta);

    if (!this[array]) {
      this[array] = [id];
    } else {
      this[array].push(id);
    }
    return id;
  };
};

var clearer = function(_clearer, array) {
  return function(id) {
    if (this[array]) {
      var index = this[array].indexOf(id);
      if (index !== -1) {
        this[array].splice(index, 1);
      }
    }
    _clearer(id);
  };
};

var _timeouts = 'TimerMixin_timeouts';
var _clearTimeout = clearer(GLOBAL.clearTimeout, _timeouts);
var _setTimeout = setter(GLOBAL.setTimeout, _clearTimeout, _timeouts);

var _intervals = 'TimerMixin_intervals';
var _clearInterval = clearer(GLOBAL.clearInterval, _intervals);
var _setInterval = setter(GLOBAL.setInterval, function() {/* noop */}, _intervals);

var _immediates = 'TimerMixin_immediates';
var _clearImmediate = clearer(GLOBAL.clearImmediate, _immediates);
var _setImmediate = setter(GLOBAL.setImmediate, _clearImmediate, _immediates);

var _rafs = 'TimerMixin_rafs';
var _cancelAnimationFrame = clearer(GLOBAL.cancelAnimationFrame, _rafs);
var _requestAnimationFrame = setter(GLOBAL.requestAnimationFrame, _cancelAnimationFrame, _rafs);

var TimerExtension = {
  extensionName: 'TimerExtension',

  exports: {
    methods: [
      'setTimeout',
      'clearTimeout',
      'setInterval',
      'clearInterval',
      'setImmediate',
      'clearImmediate',
      'requestAnimationFrame',
      'cancelAnimationFrame',
    ],
  },

  componentWillUnmount: function() {
    this[_timeouts] && this[_timeouts].forEach(function(id) {
      GLOBAL.clearTimeout(id);
    });
    this[_timeouts] = null;
    this[_intervals] && this[_intervals].forEach(function(id) {
      GLOBAL.clearInterval(id);
    });
    this[_intervals] = null;
    this[_immediates] && this[_immediates].forEach(function(id) {
      GLOBAL.clearImmediate(id);
    });
    this[_immediates] = null;
    this[_rafs] && this[_rafs].forEach(function(id) {
      GLOBAL.cancelAnimationFrame(id);
    });
    this[_rafs] = null;
  },

  setTimeout: _setTimeout,
  clearTimeout: _clearTimeout,

  setInterval: _setInterval,
  clearInterval: _clearInterval,

  setImmediate: _setImmediate,
  clearImmediate: _clearImmediate,

  requestAnimationFrame: _requestAnimationFrame,
  cancelAnimationFrame: _cancelAnimationFrame,
};

export default Extension.create(TimerExtension);
