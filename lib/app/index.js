const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const schedule = require('../schedule');
const events = require('../events');
const notifications = require('../notifications');
const day = require('./day');
const dump = require('./dump');
const timetravel = require('../timetravel');
const { add, first, onlyif } = require('../utils');

const SAME_LIMIT = 2;

module.exports = function render(state, prev, send) {
  const { showSchedule, showEvents, showNotifications } = state;
  const showDays = showSchedule || showEvents;
  const dates = [];

  if (showSchedule) {
    // Create a render method for for schedule items
    const render = function () { return schedule(this); };

    // Add personal schedule events
    dates.push(...state.schedule.map(add('render', render)));
  }

  if (showEvents) {
    // Create a render method for for event items
    const render = function () { return events(this); };

    // Add public KTH events
    dates.push(...state.events.map(add('render', render)));
  }

  const days = {};
  dates
    // Only include dates that have not passed
    .filter(date => new Date(date.endtime) > new Date(state.now))
    // Sort dates in chronological order
    .sort((a, b) => new Date(a.starttime) > new Date(b.starttime) ? 1 : -1)
    // Group dates by day of occurance
    .forEach(date => {
      const key = moment(date.starttime).format('YYYY-MM-DD');
      const day = days[key] || [];

      day.push(date);
      days[key] = day;
    });

  const showAllNotifications = state.expanded.includes('notifications');
  const unreadNotifications = state.notifications
    .filter(({ status }) => status === 'new' || status === 'unread')
    .sort((a, b) => {
      const isNewer = a.status === 'new' && b.status !== 'new';
      const isRecent = a.time && (!b.time || new Date(a.time) < new Date(b.time));
      return isNewer || isRecent ? 1 : -1;
    });

  return html`
    <div>
      ${ onlyif(process.env.NODE_ENV === 'development', timetravel(state, send)) }
      <form>
        <fieldset>
          <label>
            <input type="checkbox" name="schedule" checked=${ showSchedule } onchange=${ filter(send) } />
            ${ lang.SCHEDULE }
          </label>
          <label>
            <input type="checkbox" name="todo" checked=${ state.showTodos } onchange=${ filter(send) } />
            ${ lang.TODO }
          </label>
          <label>
            <input type="checkbox" name="notifications" checked=${ showNotifications } onchange=${ filter(send) } />
            ${ lang.NOTIFICATIONS }
          </label>
          <label>
            <input type="checkbox" name="events" checked=${ showEvents } onchange=${ filter(send) } />
            ${ lang.KTHEVENTS }
          </label>
        </fieldset>
      </form>

      <ol>
        ${ onlyif(showNotifications, html`
          <li>
            <h3>${ lang.IMPORTANT }</h3>
            <ol>
              ${ unreadNotifications
                  .filter(first(showAllNotifications ? state.notifications.length : SAME_LIMIT))
                  .map((props, index, list) => {
                    const total = unreadNotifications.length;
                    let text;
                    if (showAllNotifications) {
                      text = lang.SHOW_LESS;
                    } else {
                      text = lang.n('SHOW_N_MORE', total - SAME_LIMIT);
                    }

                    return html`
                      <li>
                        ${ notifications(props, state.now, send) }
                        ${ onlyif(index === list.length - 1 && total > SAME_LIMIT, html`
                          <button onclick=${ toggleNotifications(send, !showAllNotifications) }>${ text }</button>
                        `) }
                      </li>
                    `;
                  })
              }
            </ol>
          </li>
        `) }

        ${ onlyif(showDays, Object.keys(days).filter(first(7)).map(key => day(key, days[key], state, send))) }
      </ol>

      ${ onlyif(process.env.NODE_ENV === 'development', dump(state)) }
    </div>
  `;
};

/**
 * Send filter action by deriving data from event target
 * @param  {Object} event Standard event object
 */

function filter(send) {
  return event => send(`filter:${event.target.name}`, event.target.checked);
}

function toggleNotifications(send, expand) {
  return () => send('expand:toggle', { id: 'notifications', expand });
}
