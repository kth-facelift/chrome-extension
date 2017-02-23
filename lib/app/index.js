const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const schedule = require('../schedule');
const events = require('../events');
const notifications = require('../notifications');
const todos = require('../todos');
const day = require('./day');
const dump = require('./dump');
const filter = require('./filter');
const timetravel = require('../timetravel');
const { add, first, onlyif } = require('../utils');

const SAME_LIMIT = 2;
const URGENCY = [ 0, 5, 10, 20 ];

module.exports = function render(state, prev, send) {
  const { showSchedule, showEvents, showNotifications, showTodos } = state;
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

  const days = [];
  dates
    // Only include dates that have not passed
    .filter(date => new Date(date.endtime) > new Date(state.now))
    // Sort dates in chronological order
    .sort((a, b) => new Date(a.starttime) > new Date(b.starttime) ? 1 : -1)
    // Group dates by day of occurance
    .forEach(item => {
      const date = moment(item.starttime).startOf('date').toDate();
      const index = days.findIndex(day => moment(day.date).isSame(date));

      if (index !== -1) {
        days[index].items.push(item);
      } else {
        days.push({ date, items: [ item ] });
      }
    });

  // Check whether notifications have been expanded
  const showAllNotifications = state.expanded.includes('notifications');

  // Sort out just the unread and new notifications, by date
  const unreadNotifications = state.notifications
    .filter(({ status }) => status === 'new' || status === 'unread')
    .sort((a, b) => {
      const isNewer = a.status === 'new' && b.status !== 'new';
      const isRecent = a.time && (!b.time || new Date(a.time) < new Date(b.time));
      return isNewer || isRecent ? 1 : -1;
    });


  const important = [];
  if (showTodos) {
    // Lookup the the first day's start time for figuring out priority
    const next = days.length && new Date(days[0].items[0].starttime);
    state.todos
      // Only include todo items that are not done
      .filter(todo => todo.status !== 'done')
      .forEach(todo => {
        let prio;

        // Create a utility render method for the item
        const render = function () { return todos[this.type](this, state, send); };

        // Check whether this is closer in time than first day's item
        let isImportant = !!(next && new Date(todo.date) < next);

        if (!isImportant) {
          // Apply number of days depending on priority
          prio = moment(todo.date).subtract(URGENCY[todo.priority], 'days');

          // Now compare again with first day's item
          isImportant = !!(next && prio < next);
        }

        if (isImportant) {
          // Add to list o important items if more urgent than the first day
          important.push(Object.assign({ render }, todo));
        } else {
          // Create a date for this todo
          const date = prio.startOf('date');

          // Lookup the day in list of days
          let day = days.find(day => moment(day.date).isSame(date));

          if (!day && next && next < state.now && date < state.now) {
            // If both this date and the first day's item have already past
            // add this to the first day
            day = days[0];
          }

          if (day) {
            // Figure out position for this in list of given day's items
            const position = day.items.findIndex(item => {
              return new Date(item.starttime) >= prio;
            });

            // Add this in place
            day.items.splice(position, 0, Object.assign({ render }, todo));
          } else {
            // Find the day following this
            const index = days.findIndex(day => day.date > date);

            // Determine position in list before the enxt day
            const position = index < 1 ? 0 : index - 1;

            // Add this in place
            days.splice(position, 0, {
              date,
              items: [ Object.assign({ render }, todo) ]
            });
          }
        }
      });
  }

  return html`
    <div class="App">
      ${ onlyif(process.env.NODE_ENV === 'development', timetravel(state, send)) }
      <form>
        ${ filter(state, prev, send) }
      </form>

      <ol>
        ${ onlyif(showNotifications, html`
          <li>
            <h3>${ lang.IMPORTANT }</h3>
            <ol>
              ${ unreadNotifications
                  // Filter out the notifications that are to be shown
                  .filter(first(showAllNotifications ? state.notifications.length : SAME_LIMIT))
                  // Render them all and add an expand button to the last one
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
              ${ important.map(item => html`
                <li>
                  ${ item.render() }
                </li>
              `) }
            </ol>
          </li>
        `) }

        ${ onlyif(showDays, days.filter(first(7)).map(props => day(props, state, send))) }
      </ol>

      ${ onlyif(process.env.NODE_ENV === 'development', dump(state)) }
    </div>
  `;
};

/**
 * Create an action dispatcher that toggles notification visibility
 * @param  {function} send   Action receiver
 * @param  {Boolean}  expand Whether notifications sohuld be expanded or not
 * @return {Function}
 */

function toggleNotifications(send, expand) {
  return () => send('expand:toggle', { id: 'notifications', expand });
}
