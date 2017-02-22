const html = require('yo-yo');
const lang = require('../lang');

module.exports = function render(state) {
  return html`
    <div>
      <details>
        <summary>${ lang.SCHEDULE }</summary>
        <pre>${ JSON.stringify(state.schedule, null, 2) }</pre>
      </details>

      <details>
        <summary>${ lang.KTHEVENTS }</summary>
        <pre>${ JSON.stringify(state.events, null, 2) }</pre>
      </details>

      <details>
        <summary>${ lang.COURSES }</summary>
        <pre>${ JSON.stringify(state.courses, null, 2) }</pre>
      </details>

      <details>
        <summary>${ lang.NOTIFICATIONS }</summary>
        <pre>${ JSON.stringify(state.notifications, null, 2) }</pre>
      </details>
    </div>
  `;
};
