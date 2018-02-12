"use strict";

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "load": true,
        "usage": "dynamic"
      },
      "qx.event.type.Event": {
        "load": true
      }
    },
    "extends": "qx.event.type.Event",
    "include": [],
    "implement": [],
    "hasDefer": null
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);qx.Class.define("qx.event.type.Data", {
    extend: qx.event.type.Event,

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __data: null,
      __old: null,

      /**
       * Initializes an event object.
       *
       * @param data {var} The event's new data
       * @param old {var?null} The event's old data (optional)
       * @param cancelable {Boolean?false} Whether or not an event can have its default
       *     action prevented. The default action can either be the browser's
       *     default action of a native event (e.g. open the context menu on a
       *     right click) or the default action of a qooxdoo class (e.g. close
       *     the window widget). The default action can be prevented by calling
       *     {@link qx.event.type.Event#preventDefault}
       * @return {qx.event.type.Data} the initialized instance.
       */
      init: function init(data, old, cancelable) {
        qx.event.type.Data.prototype.init.base.call(this, false, cancelable);

        this.__data = data;
        this.__old = old;

        return this;
      },

      /**
       * Get a copy of this object
       *
       * @param embryo {qx.event.type.Data?null} Optional event class, which will
       *     be configured using the data of this event instance. The event must be
       *     an instance of this event class. If the data is <code>null</code>,
       *     a new pooled instance is created.
       * @return {qx.event.type.Data} a copy of this object
       */
      clone: function clone(embryo) {
        var clone = qx.event.type.Data.prototype.clone.base.call(this, embryo);

        clone.__data = this.__data;
        clone.__old = this.__old;

        return clone;
      },

      /**
       * The new data of the event sending this data event.
       * The return data type is the same as the event data type.
       *
       * @return {var} The new data of the event
       */
      getData: function getData() {
        return this.__data;
      },

      /**
       * The old data of the event sending this data event.
       * The return data type is the same as the event data type.
       *
       * @return {var} The old data of the event
       */
      getOldData: function getOldData() {
        return this.__old;
      }
    }
  });
  qx.event.type.Data.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Data.js.map