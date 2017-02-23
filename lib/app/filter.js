const html = require('yo-yo');
const lang = require('../lang');

module.exports = function(state, prev, send) {
  const { showSchedule, showEvents, showNotifications } = state;

  // Send filter action by deriving data from event target
  const onchange = event => send(
    `filter:${event.target.name}`,
    event.target.checked
  );

  return html`
    <fieldset>
      <label>
        <input type="checkbox" name="schedule" checked=${ showSchedule } onchange=${ onchange } />
        ${ lang.SCHEDULE }
      </label>
      <label>
        <input type="checkbox" name="todo" checked=${ state.showTodos } onchange=${ onchange } />
        ${ lang.TODO }
      </label>
      <label>
        <input type="checkbox" name="notifications" checked=${ showNotifications } onchange=${ onchange } />
        ${ lang.NOTIFICATIONS }
      </label>
      <label>
        <input type="checkbox" name="events" checked=${ showEvents } onchange=${ onchange } />
        ${ lang.KTHEVENTS }
      </label>
    </fieldset>
  `;
};
