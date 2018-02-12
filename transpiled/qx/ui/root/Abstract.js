"use strict";

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "load": true,
        "usage": "dynamic"
      },
      "qx.ui.core.Widget": {
        "load": true,
        "construct": true
      },
      "qx.ui.core.MChildrenHandling": {
        "load": true,
        "defer": "runtime"
      },
      "qx.ui.core.MBlocker": {
        "load": true
      },
      "qx.ui.window.MDesktop": {
        "load": true
      },
      "qx.ui.core.FocusHandler": {
        "construct": true
      },
      "qx.ui.core.queue.Visibility": {
        "construct": true
      },
      "qx.core.Environment": {
        "load": true,
        "usage": "dynamic"
      },
      "qx.bom.client.Engine": {
        "load": true
      },
      "qx.bom.Stylesheet": {},
      "qx.bom.element.Cursor": {},
      "qx.dom.Node": {},
      "qx.bom.client.Event": {},
      "qx.bom.Event": {}
    },
    "extends": "qx.ui.core.Widget",
    "include": ["qx.ui.core.MChildrenHandling", "qx.ui.core.MBlocker", "qx.ui.window.MDesktop"],
    "implement": [],
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "load": true,
          "className": "qx.bom.client.Engine"
        },
        "event.help": {
          "className": "qx.bom.client.Event"
        }
      }
    },
    "hasDefer": true
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);qx.Class.define("qx.ui.root.Abstract", {
    type: "abstract",
    extend: qx.ui.core.Widget,

    include: [qx.ui.core.MChildrenHandling, qx.ui.core.MBlocker, qx.ui.window.MDesktop],

    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct: function construct() {
      qx.ui.core.Widget.constructor.call(this);

      // Register as root for the focus handler
      qx.ui.core.FocusHandler.getInstance().addRoot(this);

      // Directly add to visibility queue
      qx.ui.core.queue.Visibility.add(this);

      this.initNativeHelp();

      this.addListener("keypress", this.__preventScrollWhenFocused, this);
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "root"
      },

      // overridden
      enabled: {
        refine: true,
        init: true
      },

      // overridden
      focusable: {
        refine: true,
        init: true
      },

      /**
       *  Sets the global cursor style
       *
       *  The name of the cursor to show when the mouse pointer is over the widget.
       *  This is any valid CSS2 cursor name defined by W3C.
       *
       *  The following values are possible:
       *  <ul><li>default</li>
       *  <li>crosshair</li>
       *  <li>pointer (hand is the ie name and will mapped to pointer in non-ie).</li>
       *  <li>move</li>
       *  <li>n-resize</li>
       *  <li>ne-resize</li>
       *  <li>e-resize</li>
       *  <li>se-resize</li>
       *  <li>s-resize</li>
       *  <li>sw-resize</li>
       *  <li>w-resize</li>
       *  <li>nw-resize</li>
       *  <li>text</li>
       *  <li>wait</li>
       *  <li>help </li>
       *  <li>url([file]) = self defined cursor, file should be an ANI- or CUR-type</li>
       *  </ul>
       *
       * Please note that in the current implementation this has no effect in IE.
       */
      globalCursor: {
        check: "String",
        nullable: true,
        themeable: true,
        apply: "_applyGlobalCursor",
        event: "changeGlobalCursor"
      },

      /**
       * Whether the native context menu should be globally enabled. Setting this
       * property to <code>true</code> will allow native context menus in all
       * child widgets of this root.
       */
      nativeContextMenu: {
        refine: true,
        init: false
      },

      /**
       * If the user presses F1 in IE by default the onhelp event is fired and
       * IE’s help window is opened. Setting this property to <code>false</code>
       * prevents this behavior.
       */
      nativeHelp: {
        check: "Boolean",
        init: false,
        apply: "_applyNativeHelp"
      }
    },

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {

      __globalCursorStyleSheet: null,

      // overridden
      isRootWidget: function isRootWidget() {
        return true;
      },

      /**
       * Get the widget's layout manager.
       *
       * @return {qx.ui.layout.Abstract} The widget's layout manager
       */
      getLayout: function getLayout() {
        return this._getLayout();
      },

      // property apply
      _applyGlobalCursor: qx.core.Environment.select("engine.name", {
        "mshtml": function mshtml(value, old) {
          // empty implementation
        },

        // This would be the optimal solution.
        // For performance reasons this is impractical in IE
        "default": function _default(value, old) {
          var Stylesheet = qx.bom.Stylesheet;

          var sheet = this.__globalCursorStyleSheet;
          if (!sheet) {
            this.__globalCursorStyleSheet = sheet = Stylesheet.createElement();
          }

          Stylesheet.removeAllRules(sheet);

          if (value) {
            Stylesheet.addRule(sheet, "*", qx.bom.element.Cursor.compile(value).replace(";", "") + " !important");
          }
        }
      }),

      // property apply
      _applyNativeContextMenu: function _applyNativeContextMenu(value, old) {
        if (value) {
          this.removeListener("contextmenu", this._onNativeContextMenu, this, true);
        } else {
          this.addListener("contextmenu", this._onNativeContextMenu, this, true);
        }
      },

      /**
       * Stops the <code>contextmenu</code> event from showing the native context menu
       *
       * @param e {qx.event.type.Mouse} The event object
       */
      _onNativeContextMenu: function _onNativeContextMenu(e) {
        if (e.getTarget().getNativeContextMenu()) {
          return;
        }
        e.preventDefault();
      },

      /**
      * Fix unexpected scrolling when pressing "Space" while a widget is focused.
      *
      * @param e {qx.event.type.KeySequence} The KeySequence event
      */
      __preventScrollWhenFocused: function __preventScrollWhenFocused(e) {
        // Require space pressed
        if (e.getKeyIdentifier() !== "Space") {
          return;
        }

        var target = e.getTarget();

        // Require focused. Allow scroll when container or root widget.
        var focusHandler = qx.ui.core.FocusHandler.getInstance();
        if (!focusHandler.isFocused(target)) {
          return;
        }

        // Require that widget does not accept text input
        var el = target.getContentElement();
        var nodeName = el.getNodeName();
        var domEl = el.getDomElement();
        if (nodeName === "input" || nodeName === "textarea" || domEl && domEl.contentEditable === "true") {
          return;
        }

        // do not prevent "space" key for natively focusable elements
        nodeName = qx.dom.Node.getName(e.getOriginalTarget());
        if (nodeName && ["input", "textarea", "select", "a"].indexOf(nodeName) > -1) {
          return;
        }

        // Ultimately, prevent default
        e.preventDefault();
      },

      // property apply
      _applyNativeHelp: function _applyNativeHelp(value, old) {
        if (qx.core.Environment.get("event.help")) {
          if (old === false) {
            qx.bom.Event.removeNativeListener(document, "help", function () {
              return false;
            });
          }

          if (value === false) {
            qx.bom.Event.addNativeListener(document, "help", function () {
              return false;
            });
          }
        }
      }
    },

    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct: function destruct() {
      this.__globalCursorStyleSheet = null;
    },

    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer: function defer(statics, members) {
      qx.ui.core.MChildrenHandling.remap(members);
    }
  });
  qx.ui.root.Abstract.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Abstract.js.map