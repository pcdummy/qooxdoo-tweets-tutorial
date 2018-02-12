"use strict";

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "load": true,
        "usage": "dynamic"
      },
      "qx.event.type.Pointer": {
        "load": true
      }
    },
    "extends": "qx.event.type.Pointer",
    "include": [],
    "implement": [],
    "hasDefer": null
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);qx.Class.define("qx.event.type.Track", {
    extend: qx.event.type.Pointer,

    members: {
      // overridden
      _cloneNativeEvent: function _cloneNativeEvent(nativeEvent, clone) {
        var clone = qx.event.type.Track.prototype._cloneNativeEvent.base.call(this, nativeEvent, clone);

        clone.delta = nativeEvent.delta;

        return clone;
      },

      /**
       * Returns a map with the calculated delta coordinates and axis,
       * relative to the position on <code>trackstart</code> event.
       *
       * @return {Map} a map with contains the delta as <code>x</code> and
       * <code>y</code> and the movement axis as <code>axis</code>.
       */
      getDelta: function getDelta() {
        return this._native.delta;
      }
    }
  });
  qx.event.type.Track.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Track.js.map