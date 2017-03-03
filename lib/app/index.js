const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const schedule = require('../schedule');
const events = require('../events');
const todos = require('../todos');
const day = require('./day');
const dump = require('./dump');
const unread = require('./unread');
const filter = require('../filter');
const search = require('../search');
const match = require('../search/match');
const timetravel = require('../timetravel');
const { exclamation } = require('../icons');
const { add, first, onlyif } = require('../utils');

const URGENCY = [ 0, 5, 10, 20 ];

module.exports = function render(state, prev, send) {
  const { showSchedule, showEvents, showNotifications, showTodos } = state;
  const searchReg = state.search && new RegExp(state.search, 'i');
  const dates = [];

  if (showSchedule) {
    // Create a render method for for schedule items
    const render = function () { return schedule(this, state, send); };

    // Add personal schedule events
    dates.push(...state.schedule.map(add('render', render)));
  }

  if (showEvents) {
    // Create a render method for for event items
    const render = function () { return events(this, state, send); };

    // Add public KTH events
    dates.push(...state.events.map(add('render', render)).map(add('expandable', true)));
  }

  const days = [];
  dates
    // Only include dates that have not passed
    .filter(date => new Date(date.endtime) > new Date(state.now))
    // Match against search term
    .filter(date => !searchReg || match(date, searchReg))
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
    // Match against search
    .filter(notification => !searchReg || match(notification, searchReg))
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
      // Match against search
      .filter(todo => !searchReg || match(todo, searchReg))
      .forEach(todo => {
        let prio;

        // Wrap up todo with some custom functinoality
        const props = Object.assign({
          // Don't allow todos to be exapndable
          expandable: false,
          // Create a utility render method for the todo
          render: function () { return todos[this.type](this, state, send); },
        }, todo);

        // Check whether todo is closer in time than first day's item
        let isImportant = !!(next && new Date(todo.date) < next);

        if (!isImportant) {
          // Apply number of days depending on priority
          prio = moment(todo.date).subtract(URGENCY[todo.priority], 'days');

          // Now compare again with first day's item
          isImportant = moment(state.now).isAfter(prio) || (next && prio < next);
        }

        if (isImportant) {
          // Add to list o important items if more urgent than the first day
          important.push(props);
        } else {
          // Create a date for todo based on calculated priority
          let date = prio.startOf('date').toDate();

          let day;
          if (next && next < state.now && date < state.now) {
            // If both this date and the first day's item have already past
            // add todo to the first day
            day = days[0];
          } else if (days.length) {
            // Lookup the same day or the following day
            let index = days.findIndex(day => new Date(day.date) >= date);

            // Fallback to the last day
            if (index === -1) {
              index = days.length - 1;
            }

            // If todo isn't prioratized, put it with other days, otherwise
            // look for a "todo day" at index and +/- 1 day of the index
            if (!todo.priority || days[index].isTodo) {
              day = days[index];
            } else {
              if (days.length > index + 1 && days[index + 1].isTodo) {
                day = days[index + 1];
              } else if (index > 0 && days[index - 1].isTodo) {
                day = days[index - 1];
              }
            }
          }

          if (day) {
            // Figure out index for todo in relation to other todos
            const index = day.items.findIndex(item => new Date(item.date) >= date);

            // Add this in place
            day.items.splice(index === -1 ? 0 : index, 0, props);
          } else {
            // Find the following day's index or fallback to first index
            const index = days.findIndex(day => new Date(day.date) >= date);

            // Create a new entry if there's nothing on the same date
            day = { date, items: [ props ] };

            // Decorate prioritised day
            if (todo.priority) {
              day.isTodo = true;
              day.title = lang.UPCOMING;
              day.icon = 'runner';
            }

            // Inject day in days before the next date
            days.splice(index === -1 ? 0 : index, 0, day);
          }
        }
      });
  }

  return html`
    <div class="App">
      ${ onlyif(process.env.NODE_ENV === 'development', timetravel(state, send)) }
      ${ search(state, prev, send) }
      ${ filter(state, prev, send) }

      <ol class="List">
        ${ onlyif((showNotifications && unreadNotifications.length) || important.length, html`
          <li class="List-section">
            <h3 class="List-heading">
              <span class="List-icon">${ exclamation() }</span> ${ lang.IMPORTANT }
            </h3>
            <ol class="List">
              ${ important.map(item => html`
                <li class="List-item">
                ${ item.render() }
                </li>
              `) }
              ${ onlyif(showNotifications, unread(unreadNotifications, showAllNotifications, state, send)) }
            </ol>
          </li>
        `) }

        ${ days.filter(first(7)).map(props => day(props, state, send)) }
      </ol>

      ${ onlyif(process.env.NODE_ENV === 'development', dump(state)) }

      <p>
        Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> and <a href="http://www.flaticon.com/authors/madebyoliver" title="Madebyoliver">Madebyoliver</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
      </p>
    </div>
  `;
};
