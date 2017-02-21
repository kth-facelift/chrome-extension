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

      ${ Object
          .keys(state.courses.student)
          .filter(key => state.courses.student[key].length)
          .map(key => {
            return html`
              <details>
                <summary>${ lang.COURSES }: ${ key }</summary>
                <pre>${ JSON.stringify(state.courses.student[key], null, 2) }</pre>
              </details>
            `;
          })
      }

      ${ Object
          .keys(state.courses.teacher)
          .filter(key => state.courses.teacher[key].length)
          .map(key => {
            return html`
              <details>
                <summary>${ lang.COURSES }: ${ key }</summary>
                <pre>${ JSON.stringify(state.courses.teacher[key], null, 2) }</pre>
              </details>
            `;
          })
      }

      <details>
        <summary>${ lang.NOTIFICATIONS }</summary>
        <pre>${ JSON.stringify(state.notifications, null, 2) }</pre>
      </details>
    </div>
  `;
};
