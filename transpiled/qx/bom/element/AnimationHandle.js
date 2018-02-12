"use strict";

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "load": true,
        "usage": "dynamic"
      },
      "qx.event.Emitter": {
        "load": true
      },
      "qx.core.Environment": {
        "construct": true
      },
      "qx.bom.client.CssAnimation": {
        "construct": true
      }
    },
    "extends": "qx.event.Emitter",
    "include": [],
    "implement": [],
    "environment": {
      "provided": [],
      "required": {
        "css.animation": {
          "construct": true,
          "className": "qx.bom.client.CssAnimation"
        }
      }
    },
    "hasDefer": null
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);qx.Bootstrap.define("qx.bom.element.AnimationHandle", {
    extend: qx.event.Emitter,

    construct: function construct() {
      var css = qx.core.Environment.get("css.animation");
      this.__playState = css && css["play-state"];
      this.__playing = true;
      this.addListenerOnce("end", this.__setEnded, this);
    },

    events: {
      /** Fired when the animation started via {@link qx.bom.element.Animation}. */
      "start": "Element",

      /**
       * Fired when the animation started via {@link qx.bom.element.Animation} has
       * ended.
       */
      "end": "Element",

      /** Fired on every iteration of the animation. */
      "iteration": "Element"
    },

    members: {
      __playState: null,
      __playing: false,
      __ended: false,

      /**
       * Accessor of the playing state.
       * @return {Boolean} <code>true</code>, if the animations is playing.
       */
      isPlaying: function isPlaying() {
        return this.__playing;
      },

      /**
       * Accessor of the ended state.
       * @return {Boolean} <code>true</code>, if the animations has ended.
       */
      isEnded: function isEnded() {
        return this.__ended;
      },

      /**
       * Accessor of the paused state.
       * @return {Boolean} <code>true</code>, if the animations is paused.
       */
      isPaused: function isPaused() {
        return this.el.style[this.__playState] == "paused";
      },

      /**
       * Pauses the animation, if running. If not running, it will be ignored.
       */
      pause: function pause() {
        if (this.el) {
          this.el.style[this.__playState] = "paused";
          this.el.$$animation.__playing = false;
          // in case the animation is based on JS
          if (this.animationId && qx.bom.element.AnimationJs) {
            qx.bom.element.AnimationJs.pause(this);
          }
        }
      },

      /**
       * Resumes an animation. This does not start the animation once it has ended.
       * In this case you need to start a new Animation.
       */
      play: function play() {
        if (this.el) {
          this.el.style[this.__playState] = "running";
          this.el.$$animation.__playing = true;
          // in case the animation is based on JS
          if (this.i != undefined && qx.bom.element.AnimationJs) {
            qx.bom.element.AnimationJs.play(this);
          }
        }
      },

      /**
       * Stops the animation if running.
       */
      stop: function stop() {
        if (this.el && qx.core.Environment.get("css.animation") && !this.jsAnimation) {
          this.el.style[this.__playState] = "";
          this.el.style[qx.core.Environment.get("css.animation").name] = "";
          this.el.$$animation.__playing = false;
          this.el.$$animation.__ended = true;
        }
        // in case the animation is based on JS
        else if (this.jsAnimation) {
            this.stopped = true;
            qx.bom.element.AnimationJs.stop(this);
          }
      },

      /**
       * Set the animation state to ended
       */
      __setEnded: function __setEnded() {
        this.__playing = false;
        this.__ended = true;
      }
    }
  });
  qx.bom.element.AnimationHandle.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=AnimationHandle.js.map