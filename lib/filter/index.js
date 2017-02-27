const html = require('yo-yo');
const lang = require('../lang');
const { checkmark } = require('../icons');
const { onlyif } = require('../utils');

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
          <span class="Filter-label Filter-label--schedule">
            ${ onlyif(showSchedule, html`<span class="Filter-checkmark">${ checkmark(12) }</span>`) }
            ${ lang.SCHEDULE }
          </span>
        </label>
        <label class="Filter-toggle">
          <input class="Filter-input" type="checkbox" name="todo" checked=${ state.showTodos } onchange=${ onchange } />
          <span class="Filter-label Filter-label--todo">
            ${ onlyif(state.showTodos, html`<span class="Filter-checkmark">${ checkmark(12) }</span>`) }
            ${ lang.TODO }
          </span>
        </label>
        <label class="Filter-toggle">
          <input class="Filter-input" type="checkbox" name="notifications" checked=${ showNotifications } onchange=${ onchange } />
          <span class="Filter-label Filter-label--notifications">
            ${ onlyif(showNotifications, html`<span class="Filter-checkmark">${ checkmark(12) }</span>`) }
            ${ lang.NOTIFICATIONS }
          </span>
        </label>
        <label class="Filter-toggle">
          <input class="Filter-input" type="checkbox" name="events" checked=${ showEvents } onchange=${ onchange } />
          <span class="Filter-label Filter-label--events">
            ${ onlyif(showEvents, html`<span class="Filter-checkmark">${ checkmark(12) }</span>`) }
            ${ lang.KTHEVENTS }
          </span>
        </label>
      </div>
    </fieldset>
  `;
};
