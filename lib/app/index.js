const html = require('yo-yo');
const lang = require('../lang');
const courses = require('../courses');
const schedule = require('../schedule');
const events = require('../events');
const notifications = require('../notifications');

module.exports = function render(state, prev, send) {
  return html`
    <div>
      <details>
        <summary>${ lang.SCHEDULE }</summary>
        ${ state.schedule.map(schedule) }
      </details>

      <details>
        <summary>${ lang.KTHEVENTS }</summary>
        ${ state.events.map(events) }
      </details>

      ${ Object
          .keys(state.courses.student)
          .filter(key => state.courses.student[key].length)
          .map(key => {
            return html`
              <details>
                <summary>${ lang.COURSES }: ${ key }</summary>
                ${ state.courses.student[key].map(courses) }
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
                ${ state.courses.teacher[key].map(courses) }
              </details>
            `;
          })
      }

      <details>
        <summary>${ lang.NOTIFICATIONS }</summary>
        ${ state.notifications.map(notifications) }
      </details>
    </div>
  `;
};
