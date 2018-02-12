"use strict";

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "load": true,
        "usage": "dynamic"
      },
      "qx.ui.virtual.layer.Abstract": {
        "load": true,
        "construct": true
      },
      "qx.theme.manager.Color": {},
      "qx.theme.manager.Decoration": {}
    },
    "extends": "qx.ui.virtual.layer.Abstract",
    "include": [],
    "implement": [],
    "hasDefer": null
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);qx.Class.define("qx.ui.virtual.layer.AbstractBackground", {
    extend: qx.ui.virtual.layer.Abstract,

    /*
     *****************************************************************************
        CONSTRUCTOR
     *****************************************************************************
     */

    /**
     * @param colorEven {Color?null} color for even indexes
     * @param colorOdd {Color?null} color for odd indexes
     */
    construct: function construct(colorEven, colorOdd) {
      qx.ui.virtual.layer.Abstract.constructor.call(this);

      if (colorEven) {
        this.setColorEven(colorEven);
      }

      if (colorOdd) {
        this.setColorOdd(colorOdd);
      }

      this.__customColors = {};
      this.__decorators = {};
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** color for event indexes */
      colorEven: {
        nullable: true,
        check: "Color",
        apply: "_applyColorEven",
        themeable: true
      },

      /** color for odd indexes */
      colorOdd: {
        nullable: true,
        check: "Color",
        apply: "_applyColorOdd",
        themeable: true
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __colorEven: null,
      __colorOdd: null,
      __customColors: null,
      __decorators: null,

      /*
      ---------------------------------------------------------------------------
        COLOR HANDLING
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the color for the given index
       *
       * @param index {Integer} Index to set the color for
       * @param color {Color|null} the color to set. A value of <code>null</code>
       *    will reset the color.
       */
      setColor: function setColor(index, color) {
        if (color) {
          this.__customColors[index] = qx.theme.manager.Color.getInstance().resolve(color);
        } else {
          delete this.__customColors[index];
        }
      },

      /**
       * Clear all colors set using {@link #setColor}.
       */
      clearCustomColors: function clearCustomColors() {
        this.__customColors = {};
        this.updateLayerData();
      },

      /**
       * Get the color at the given index
       *
       * @param index {Integer} The index to get the color for.
       * @return {Color} The color at the given index
       */
      getColor: function getColor(index) {
        var customColor = this.__customColors[index];
        if (customColor) {
          return customColor;
        } else {
          return index % 2 == 0 ? this.__colorEven : this.__colorOdd;
        }
      },

      // property apply
      _applyColorEven: function _applyColorEven(value, old) {
        if (value) {
          this.__colorEven = qx.theme.manager.Color.getInstance().resolve(value);
        } else {
          this.__colorEven = null;
        }
        this.updateLayerData();
      },

      // property apply
      _applyColorOdd: function _applyColorOdd(value, old) {
        if (value) {
          this.__colorOdd = qx.theme.manager.Color.getInstance().resolve(value);
        } else {
          this.__colorOdd = null;
        }
        this.updateLayerData();
      },

      /**
       * Sets the decorator for the given index
       *
       * @param index {Integer} Index to set the color for
       * @param decorator {qx.ui.decoration.IDecorator|null} the decorator to set. A value of
       *    <code>null</code> will reset the decorator.
       */
      setBackground: function setBackground(index, decorator) {
        if (decorator) {
          this.__decorators[index] = qx.theme.manager.Decoration.getInstance().resolve(decorator);
        } else {
          delete this.__decorators[index];
        }
        this.updateLayerData();
      },

      /**
       * Get the decorator at the given index
       *
       * @param index {Integer} The index to get the decorator for.
       * @return {qx.ui.decoration.IDecorator} The decorator at the given index
       */
      getBackground: function getBackground(index) {
        return this.__decorators[index];
      }
    },

    /*
     *****************************************************************************
        DESTRUCT
     *****************************************************************************
     */

    destruct: function destruct() {
      this.__customColors = this.__decorators = null;
    }
  });
  qx.ui.virtual.layer.AbstractBackground.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=AbstractBackground.js.map