const html = require('yo-yo');
const lang = require('../lang');

module.exports = function (state, prev, send) {
  return html`
    <form novalidate autocapitalize="off" autocomplete="off" class="Search">
      <input type="text" class="Search-input" value=${ state.search || '' } placeholder=${ lang.SEARCH_OR_ADD } oninput=${ oninput } />
    </form>
  `;

  function oninput(event) {
    send('search:find', event.target.value);
  }
};
