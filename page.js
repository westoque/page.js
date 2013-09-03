;(function(global) {

  var slice = Array.prototype.slice,
      document = global.document;

  // Internal: Initializes a 'Page' object.
  // Browser environments does not need to call this constructor
  // since a 'page' object will be exported in the global namespace.
  var Page = function() {
    this.initializers = {};
  };

  // Public: registers a function under the given scope to be executed
  // when the a scope is called.
  // These functions will be called with the current scope as its only
  // argument, and returning 'false' from any function will stop the
  // execution and the next registered functions will not be called.
  //
  // Examples
  //
  // # scope will be 'home'.
  // page.at('home', function(scope) { });
  //
  // # This second function will be called.
  // page.at('home', function() { return false; });
  // page.at('home', function() { });
  //
  // Returns nothing.
  Page.prototype.at = function(scope, fn) {
    this.initializers[scope] = this.initializers[scope] || [];
    this.initializers[scope].push(fn);
  };

  // Public: recognizes the current scope and execute all the registered
  // functions. If there is any functions registered under the ':before'
  // and ':after' scopes they will always be executed around the current
  // scope functions.
  //
  // Examples
  //
  // page.recognize();
  //
  // Returns nothing.
  Page.prototype.recognize = function() {
    var scope = this._detect(),
        chain = this._buildChain(scope);

    this._executeChain(chain, scope);
  };

  // Internal: detects the current scope through the 'data-page'
  // attribute on the 'body' tag.
  //
  // Returns a String.
  Page.prototype._detect = function() {
    var body = document.getElementsByTagName('body')[0];

    return body && body.getAttribute('data-page');
  };

  // Internal: builds a collection of functions to be called for the given
  // scope. The functions under the ':before' and ':after' scopes will be
  // inserted before and after the scope functions.
  //
  // Returns an Array.
  Page.prototype._buildChain = function(scope) {
    var before  = this.initializers[':before'] || [],
        current = this.initializers[scope] || [],
        after   = this.initializers[':after'] || [];

    return before.concat(current).concat(after);
  };

  // Internal: executes the chain of given functions using the
  // scope as the only argument. If the
  //
  // Returns nothing.
  Page.prototype._executeChain = function(chain, scope) {
    var result;
    for (var index = 0, len = chain.length; index < len; index++) {
      result = chain[index](scope);
      if(result === false) {
        return;
      }
    };
  };

  // Export the page object for Node.JS
  if (typeof module !== 'undefined') {
    module.exports = Page;
  } else {
    global.page = new Page;
  }
})(this);
