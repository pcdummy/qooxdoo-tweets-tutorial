"use strict";

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "load": true,
        "usage": "dynamic"
      },
      "qx.ui.core.selection.Abstract": {
        "load": true,
        "construct": true
      },
      "qx.core.Environment": {
        "construct": true
      },
      "qx.ui.virtual.core.Pane": {
        "construct": true
      },
      "qx.bom.element.Location": {}
    },
    "extends": "qx.ui.core.selection.Abstract",
    "include": [],
    "implement": [],
    "environment": {
      "provided": [],
      "required": {
        "qx.debug": {
          "construct": true
        }
      }
    },
    "hasDefer": null
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);qx.Class.define("qx.ui.virtual.selection.Abstract", {
    extend: qx.ui.core.selection.Abstract,

    /*
     *****************************************************************************
        CONSTRUCTOR
     *****************************************************************************
     */

    /**
     * @param pane {qx.ui.virtual.core.Pane} The virtual pane on which the
     *    selectable item are rendered
     * @param selectionDelegate {ISelectionDelegate?null} An optional delegate,
     *    which can be used to customize the behavior of the selection manager
     *    without sub classing it.
     */
    construct: function construct(pane, selectionDelegate) {
      qx.ui.core.selection.Abstract.constructor.call(this);

      if (qx.core.Environment.get("qx.debug")) {
        this.assertInstance(pane, qx.ui.virtual.core.Pane);
      }

      this._pane = pane;
      this._delegate = selectionDelegate || {};
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      // Determines if automatically scrolling of selected item into view is active.
      _autoScrollIntoView: true,

      /*
      ---------------------------------------------------------------------------
        DELEGATE METHODS
      ---------------------------------------------------------------------------
      */

      // overridden
      _isSelectable: function _isSelectable(item) {
        return this._delegate.isItemSelectable ? this._delegate.isItemSelectable(item) : true;
      },

      // overridden
      _styleSelectable: function _styleSelectable(item, type, enabled) {
        if (this._delegate.styleSelectable) {
          this._delegate.styleSelectable(item, type, enabled);
        }
      },

      /*
      ---------------------------------------------------------------------------
        EVENTS
      ---------------------------------------------------------------------------
      */

      /**
       * Attach pointer events to the managed pane.
       */
      attachPointerEvents: function attachPointerEvents() {
        var paneElement = this._pane.getContentElement();
        paneElement.addListener("pointerdown", this.handlePointerDown, this);
        paneElement.addListener("tap", this.handleTap, this);
        paneElement.addListener("pointerover", this.handlePointerOver, this);
        paneElement.addListener("pointermove", this.handlePointerMove, this);
        paneElement.addListener("losecapture", this.handleLoseCapture, this);
      },

      /**
       * Detach pointer events from the managed pane.
       */
      detatchPointerEvents: function detatchPointerEvents() {
        var paneElement = this._pane.getContentElement();
        paneElement.removeListener("pointerdown", this.handlePointerDown, this);
        paneElement.removeListener("tap", this.handleTap, this);
        paneElement.removeListener("pointerover", this.handlePointerOver, this);
        paneElement.removeListener("pointermove", this.handlePointerMove, this);
        paneElement.removeListener("losecapture", this.handleLoseCapture, this);
      },

      /**
       * Attach key events to manipulate the selection using the keyboard. The
       * event target doesn't need to be the pane itself. It can be an widget,
       * which received key events. Usually the key event target is the
       * {@link qx.ui.virtual.core.Scroller}.
       *
       * @param target {qx.core.Object} the key event target.
       *
       */
      attachKeyEvents: function attachKeyEvents(target) {
        target.addListener("keypress", this.handleKeyPress, this);
      },

      /**
       * Detach key events.
       *
       * @param target {qx.core.Object} the key event target.
       */
      detachKeyEvents: function detachKeyEvents(target) {
        target.removeListener("keypress", this.handleKeyPress, this);
      },

      /**
       * Attach list events. The selection mode <code>one</code> need to know,
       * when selectable items are added or removed. If this mode is used the
       * <code>list</code> parameter must fire <code>addItem</code> and
       * <code>removeItem</code> events.
       *
       * @param list {qx.core.Object} the event target for <code>addItem</code> and
       *    <code>removeItem</code> events
       */
      attachListEvents: function attachListEvents(list) {
        list.addListener("addItem", this.handleAddItem, this);
        list.addListener("removeItem", this.handleRemoveItem, this);
      },

      /**
       * Detach list events.
       *
       * @param list {qx.core.Object} the event target for <code>addItem</code> and
       *    <code>removeItem</code> events
       */
      detachListEvents: function detachListEvents(list) {
        list.removeListener("addItem", this.handleAddItem, this);
        list.removeListener("removeItem", this.handleRemoveItem, this);
      },

      /*
      ---------------------------------------------------------------------------
        IMPLEMENT ABSTRACT METHODS
      ---------------------------------------------------------------------------
      */

      // overridden
      _capture: function _capture() {
        this._pane.capture();
      },

      // overridden
      _releaseCapture: function _releaseCapture() {
        this._pane.releaseCapture();
      },

      // overridden
      _getScroll: function _getScroll() {
        return {
          left: this._pane.getScrollX(),
          top: this._pane.getScrollY()
        };
      },

      // overridden
      _scrollBy: function _scrollBy(xoff, yoff) {
        this._pane.setScrollX(this._pane.getScrollX() + xoff);
        this._pane.setScrollY(this._pane.getScrollY() + yoff);
      },

      // overridden
      _getLocation: function _getLocation() {
        var elem = this._pane.getContentElement().getDomElement();
        return elem ? qx.bom.element.Location.get(elem) : null;
      },

      // overridden
      _getDimension: function _getDimension() {
        return this._pane.getInnerSize();
      }
    },

    /*
     *****************************************************************************
        DESTRUCT
     *****************************************************************************
     */

    destruct: function destruct() {
      this._pane = this._delegate = null;
    }
  });
  qx.ui.virtual.selection.Abstract.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Abstract.js.map