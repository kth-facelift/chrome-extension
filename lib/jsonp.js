const html = require('yo-yo');

/**
 * Proxy jsonp calls through parent context using the ugliest hack ever
 * @param  {String}  service URI for jsonp service
 * @return {Promise}         Resolves to response body
 */

module.exports = function jsonp(service) {
  return new Promise((resolve, reject) => {
    const event = `callback_${ id() }`;

    /**
     * Set up an event listener on the shared document object that captures
     * the response body
     */

    document.addEventListener(event, function onCallback(event) {
      document.removeEventListener(event, onCallback);
      resolve(event.detail.body);
    });

    /**
     * Inject an inline script that declares a jsonp callback function which
     * bounces the repsonse body to the content script through an event on the
     * shared document object
     */

    document.body.appendChild(html`
      <script>
        window['${ event }'] = function (body) {
          delete window['${ event }'];
          document.dispatchEvent(new CustomEvent('${ event }', { detail: { body }}));
        }
      </script>
    `);

    /**
     * Inject the jsonp script tag and cross yer' fingers
     */

    document.body.appendChild(html`
      <script src="${ service }?callback=${ event }" onerror=${ reject }></script>
    `);
  });
};

/**
 * Generate a random 15 character long id
 */

function id () {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15);
}
