const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const schedule = require('../schedule');
const events = require('../events');
const notifications = require('../notifications');
const dump = require('./dump');
const { add, first } = require('../utils');

const FORMATS = {
  sameDay: `[${ lang.SAME_DAY }]`,
  nextDay: `[${ lang.NEXT_DAY }]`,
  nextWeek: 'dddd',
  lastDay: `[${ lang.ONGOING }]`,
  lastWeek: `[${ lang.ONGOING }]`,
  sameElse: () => {
    switch (lang.current) {
      case 'sv': return 'dddd D MMMM';
      case 'en':
      default: return 'dddd, MMMM Do';
    }
  }
};

module.exports = function render(state, prev, send) {
  const { showAllNotifications, showSchedule, showEvents, showNotifications } = state;
  const showDays = showSchedule || showEvents;
  const dates = [];


  if (showSchedule) {
    // Add personal schedule events
    dates.push(...state.schedule.map(add('render', schedule)));
  }

  if (showEvents) {
    // Add public KTH events
    dates.push(...state.events.map(add('render', events)));
  }

  // Sort dates in chronological order
  dates.sort((a, b) => new Date(a.starttime) > new Date(b.starttime) ? 1 : -1);

  // Group dates by day of occurance
  const days = {};
  for (let date of dates) {
    const key = moment(date.starttime).format('YYYY-MM-DD');
    const day = days[key] || [];

    day.push(date);

    if (!days.hasOwnProperty(key)) {
      days[key] = day;
    }
  }

  // Filter out notifications that are new or unread and sort them by date
  const important = state.notifications
    .filter(({ status }) => status === 'new' || status === 'unread')
    .sort((a, b) => {
      const isNewer = a.status === 'new' && b.status !== 'new';
      const isRecent = a.time && (!b.time || new Date(a.time) < new Date(b.time));
      return isNewer || isRecent ? 1 : -1;
    });

  return html`
    <div>
      <form>
        <fieldset>
          <label>
            <input type="checkbox" name="schedule" checked=${ showSchedule } onchange=${ filter } />
            ${ lang.SCHEDULE }
          </label>
          <label>
            <input type="checkbox" name="events" checked=${ showEvents } onchange=${ filter } />
            ${ lang.KTHEVENTS }
          </label>
          <label>
            <input type="checkbox" name="notifications" checked=${ showNotifications } onchange=${ filter } />
            ${ lang.NOTIFICATIONS }
          </label>
        </fieldset>
      </form>

      <ol>
        ${ onlyif(important.length && showNotifications, html`
          <li>
            <h3>${ lang.IMPORTANT }</h3>
            <ol>
              ${ important
                  .filter(first(showAllNotifications ? important.length : 3))
                  .map(props => html`<li>${ notifications(props, send) }</li>`)
              }
              ${ important.length <= 3 ? null : html`<li>${ toggleNotifications() }</li>` }
            </ol>
          </li>
        `) }

        ${ onlyif(showDays, Object.keys(days).filter(first(7)).map(day => html`
          <li>
            <h3><time>${ moment(day).calendar(null, FORMATS) }</time></h3>
            <ol>
              ${ days[day].map(props => html`<li>${ props.render(props) }</li>`) }
            </ol>
          </li>
        `)) }
      </ol>

      ${ onlyif(process.env.NODE_ENV === 'development', dump(state)) }
    </div>
  `;

  /**
   * Only render `block` if `condition` is truthy
   * @param  {Boolean} condition  Condition by which to determine output
   * @param  {Mixed}   block      Any content that `yo-yo` can handle
   * @return {Mixed}              `null` or `block` depending on `condition`
   */

  function onlyif(condition, block) {
    if (!condition) { return null; }
    return block;
  }

  /**
   * Send filter action by deriving data from event target
   * @param  {Object} event Standard event object
   */

  function filter(event) {
    send(`${event.target.name}:filter`, event.target.checked);
  }

  /**
   * Create a button that toggles how many notifications are shown
   * @return {Element} Button element
   */

  function toggleNotifications() {
    if (important.length <= 3) { return null; }

    const text = showAllNotifications ? lang.SHOW_LESS : lang.n('SHOW_N_NOTIFICATIONS', important.length - 3);
    const onclick = () => send('notifications:show', !showAllNotifications);

    return html`
      <button onclick=${ onclick }>${ text }</button>
    `;
  }
};
