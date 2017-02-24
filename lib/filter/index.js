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
      <div class="Filter">
        <span class="Filter-legend">${ lang.SHOWING }</span>
        <label class="Filter-toggle">
          <input class="Filter-input" type="checkbox" name="schedule" checked=${ showSchedule } onchange=${ onchange } />
          <span class="Filter-label Filter-label--schedule">${ lang.SCHEDULE }</span>
        </label>
        <label class="Filter-toggle">
          <input class="Filter-input" type="checkbox" name="todo" checked=${ state.showTodos } onchange=${ onchange } />
          <span class="Filter-label Filter-label--todo">${ lang.TODO }</span>
        </label>
        <label class="Filter-toggle">
          <input class="Filter-input" type="checkbox" name="notifications" checked=${ showNotifications } onchange=${ onchange } />
          <span class="Filter-label Filter-label--notifications">${ lang.NOTIFICATIONS }</span>
        </label>
        <label class="Filter-toggle">
          <input class="Filter-input" type="checkbox" name="events" checked=${ showEvents } onchange=${ onchange } />
          <span class="Filter-label Filter-label--events">${ lang.KTHEVENTS }</span>
        </label>
      </div>
    </fieldset>
  `;
};
