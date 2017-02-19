const html = require('yo-yo');

module.exports = function (props, prev, send) {
  return html`
    <pre>${ JSON.stringify(props, null, 2) }</pre>
  `;
};
