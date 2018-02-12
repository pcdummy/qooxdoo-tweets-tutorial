"use strict";

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "load": true,
        "usage": "dynamic"
      },
      "qx.io.request.AbstractRequest": {
        "load": true,
        "construct": true
      },
      "qx.lang.Type": {},
      "qx.bom.request.Xhr": {},
      "qx.util.Uri": {},
      "qx.util.Request": {},
      "qx.core.Environment": {},
      "qx.util.ResponseParser": {}
    },
    "extends": "qx.io.request.AbstractRequest",
    "include": [],
    "implement": [],
    "environment": {
      "provided": [],
      "required": {
        "qx.debug.io": {}
      }
    },
    "hasDefer": null
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);qx.Class.define("qx.io.request.Xhr", {
    extend: qx.io.request.AbstractRequest,

    /**
     * @param url {String?} The URL of the resource to request.
     * @param method {String?} The HTTP method.
     */
    construct: function construct(url, method) {
      if (method !== undefined) {
        this.setMethod(method);
      }

      qx.io.request.AbstractRequest.constructor.call(this, url);
      this._parser = this._createResponseParser();
    },

    // Only document events with transport specific details.
    // For a complete list of events, refer to AbstractRequest.

    events: {
      /**
       * Fired on every change of the transport’s readyState.
       *
       * See {@link qx.bom.request.Xhr} for available readyStates.
       */
      "readyStateChange": "qx.event.type.Event",

      /**
       * Fired when request completes without error and transport status
       * indicates success.
       *
       * Refer to {@link qx.util.Request#isSuccessful} for a list of HTTP
       * status considered successful.
       */
      "success": "qx.event.type.Event",

      /**
       * Fired when request completes without error.
       *
       * Every request not canceled or aborted completes. This means that
       * even requests receiving a response with erroneous HTTP status
       * fire a "load" event. If you are only interested in successful
       * responses, listen to the {@link #success} event instead.
       */
      "load": "qx.event.type.Event",

      /**
       * Fired when request completes without error but erroneous HTTP status.
       *
       * Refer to {@link qx.util.Request#isSuccessful} for a list of HTTP
       * status considered successful.
       */
      "statusError": "qx.event.type.Event"
    },

    properties: {
      /**
       * The HTTP method.
       */
      method: {
        init: "GET"
      },

      /**
       * Whether the request should be executed asynchronously.
       */
      async: {
        check: "Boolean",
        init: true
      },

      /**
       * The content type to accept. By default, every content type
       * is accepted.
       *
       * Note: Some backends send distinct representations of the same
       * resource depending on the content type accepted. For instance,
       * a backend may respond with either a JSON (the accept header
       * indicates so) or a HTML representation (the default, no accept
       * header given).
       */
      accept: {
        check: "String",
        nullable: true
      },

      /**
       * Whether to allow request to be answered from cache.
       *
       * Allowed values:
       *
       * * <code>true</code>: Allow caching (Default)
       * * <code>false</code>: Prohibit caching. Appends nocache parameter to URL.
       * * <code>String</code>: Any Cache-Control request directive
       *
       * If a string is given, it is inserted in the request's Cache-Control
       * header. A request’s Cache-Control header may contain a number of directives
       * controlling the behavior of any caches in between client and origin
       * server.
       *
       * * <code>"no-cache"</code>: Force caches to submit request in order to
       *   validate the freshness of the representation. Note that the requested
       *   resource may still be served from cache if the representation is
       *   considered fresh. Use this directive to ensure freshness but save
       *   bandwidth when possible.
       * * <code>"no-store"</code>: Do not keep a copy of the representation under
       *   any conditions.
       *
       * See <a href="http://www.mnot.net/cache_docs/#CACHE-CONTROL">
       * Caching tutorial</a> for an excellent introduction to Caching in general.
       * Refer to the corresponding section in the
       * <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9">
       * HTTP 1.1 specification</a> for more details and advanced directives.
       *
       * It is recommended to choose an appropriate Cache-Control directive rather
       * than prohibit caching using the nocache parameter.
       */
      cache: {
        check: function check(value) {
          return qx.lang.Type.isBoolean(value) || qx.lang.Type.isString(value);
        },
        init: true
      }
    },

    members: {

      /**
       * @type {Function} Parser.
       */
      _parser: null,

      /*
      ---------------------------------------------------------------------------
        CONFIGURE TRANSPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Create XHR transport.
       *
       * @return {qx.bom.request.Xhr} Transport.
       */
      _createTransport: function _createTransport() {
        return new qx.bom.request.Xhr();
      },

      /**
       * Get configured URL.
       *
       * Append request data to URL if HTTP method is GET. Append random
       * string to URL if required by value of {@link #cache}.
       *
       * @return {String} The configured URL.
       */
      _getConfiguredUrl: function _getConfiguredUrl() {
        var url = this.getUrl(),
            serializedData;

        if (this.getMethod() === "GET" && this.getRequestData()) {
          serializedData = this._serializeData(this.getRequestData());
          url = qx.util.Uri.appendParamsToUrl(url, serializedData);
        }

        if (this.getCache() === false) {
          // Make sure URL cannot be served from cache and new request is made
          url = qx.util.Uri.appendParamsToUrl(url, { nocache: new Date().valueOf() });
        }

        return url;
      },

      // overridden
      _getConfiguredRequestHeaders: function _getConfiguredRequestHeaders() {
        var headers = {},
            isAllowsBody = qx.util.Request.methodAllowsRequestBody(this.getMethod());

        // Follow convention to include X-Requested-With header when same origin
        if (!qx.util.Request.isCrossDomain(this.getUrl())) {
          headers["X-Requested-With"] = "XMLHttpRequest";
        }

        // Include Cache-Control header if configured
        if (qx.lang.Type.isString(this.getCache())) {
          headers["Cache-Control"] = this.getCache();
        }

        // By default, set content-type urlencoded for requests with body
        if (this.getRequestData() !== "null" && isAllowsBody) {
          headers["Content-Type"] = "application/x-www-form-urlencoded";
        }

        // What representations to accept
        if (this.getAccept()) {
          if (qx.core.Environment.get("qx.debug.io")) {
            this.debug("Accepting: '" + this.getAccept() + "'");
          }
          headers["Accept"] = this.getAccept();
        }

        return headers;
      },

      // overridden
      _getMethod: function _getMethod() {
        return this.getMethod();
      },

      // overridden
      _isAsync: function _isAsync() {
        return this.isAsync();
      },

      /*
      ---------------------------------------------------------------------------
        PARSING
      ---------------------------------------------------------------------------
      */

      /**
       * Create response parser.
       *
       * @return {qx.util.ResponseParser} parser.
       */
      _createResponseParser: function _createResponseParser() {
        return new qx.util.ResponseParser();
      },

      /**
       * Returns response parsed with parser determined by content type.
       *
       * @return {String|Object} The parsed response of the request.
       */
      _getParsedResponse: function _getParsedResponse() {
        var response = this._transport.responseText,
            contentType = this.getResponseContentType() || "";

        return this._parser.parse(response, contentType);
      },

      /**
       * Set parser used to parse response once request has
       * completed successfully.
       *
       * @see qx.util.ResponseParser#setParser
       *
       * @param parser {String|Function}
       * @return {Function} The parser function
       */
      setParser: function setParser(parser) {
        return this._parser.setParser(parser);
      }
    }
  });
  qx.io.request.Xhr.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Xhr.js.map