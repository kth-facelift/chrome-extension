const html = require('yo-yo');

/**
 * Prevent given function from running consecutively for given duration
 * @param  {Function} fn          Function to debounce
 * @param  {Number}   [delay=250] Number of milliseconds to wait
 * @return {Function}             Debounced function
 */

exports.debounce = function debounce(fn, delay = 250) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, ...args), delay);
  };
};

/**
 * Only return if condition is truthy
 * @param  {Boolean} condition An expression that can be trated as a Boolean
 * @param  {Mixed}   output    Any number of elements
 */

exports.onlyif = function onlyif(condition, ...values) {
  if (condition) {
    return values.length > 1 ? values[0] : values.map(value => {
      if (typeof value === 'function') {
        return value();
      }

      return value;
    });
  }
};

/**
 * Create an iterator that plucks the first X from an array
 * @param  {Number}   count Number of items to pluck
 * @return {Function}       Iterator
 */

exports.first = function first(count) {
  return (item, index) => index < count;
};

/**
 * Create an iterator that assigns given key and value to iteratee items
 * @param {String} key   Key to assign
 * @param {Any}    value Value to associate with key
 * @return {Function}    Iterator
 */

exports.add = function add(key, value) {
  return item => Object.assign({ [key]: value }, item);
};

/**
 * Capitalize first letter of string
 * @param  {String} str String that is to be captialized
 * @return {String}
 */

exports.capitalize = function (str) {
  return str[0].toUpperCase() + str.substr(1);
};

/**
 * Generate a random 15 character long id
 * @return {String}
 */

const id = exports.id = function () {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15);
};

/**
 * Convert an html string into a dom node
 * @param  {String}           html HTML source string
 * @return {Element|Elements}      An Element object or an array of Elements
 */

exports.dom = function dom(html) {
  const div = document.createElement('div');
  div.innerHTML = html;

  if (div.children.length > 1) {
    return div;
  }

  return div.children[0];
};

/**
 * Load any page under kth.se and returns it's raw HTML
 * @param  {String}  url URL (must be under kth.se)
 * @return {Promise}     Resolves to HTML document string
 */

exports.scrape = function (url) {
  return new Promise((resolve, reject) => {
    const iframe = html`
      <iframe src="${ url }#scrape=${ name }" width="0" height="0" onload=${ onload } onerror=${ reject }></iframe>
    `;

    document.body.appendChild(iframe);

    function onload() {
      iframe.contentWindow.onload = () => {
        resolve(iframe.contentDocument.documentElement.innerHTML);
        document.body.removeChild(iframe);
      };
    }
  });
};

/**
 * Proxy jsonp calls through parent context using the ugliest hack ever
 * @param  {String}  service URI for jsonp service
 * @return {Promise}         Resolves to response body
 */

exports.jsonp = function (service) {
  return new Promise((resolve, reject) => {
    const name = `jsonp_${ id() }`;

    /**
     * Set up an event listener on the shared document object that captures
     * the response body
     */

    document.addEventListener(name, function onCallback(event) {
      document.removeEventListener(name, onCallback);
      document.body.removeChild(script);
      document.body.removeChild(callback);
      resolve(event.detail.body);
    });

    /**
     * Inject an inline script that declares a jsonp callback function which
     * bounces the repsonse body to the content script through an event on the
     * shared document object
     */

    const callback = html`
      <script>
        window['${ name }'] = function (body) {
          delete window['${ name }'];
          document.dispatchEvent(new CustomEvent('${ name }', { detail: { body }}));
        }
      </script>
    `;
    document.body.appendChild(callback);

    /**
     * Inject the jsonp script tag and cross yer' fingers
     */

    const script = html`
      <script src="${ service }?callback=${ name }" onerror=${ reject }></script>
    `;
    document.body.appendChild(script);
  });
};
