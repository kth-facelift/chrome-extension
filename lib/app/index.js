const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const courses = require('../courses');
const schedule = require('../schedule');
const events = require('../events');
const notifications = require('../notifications');
const dump = require('./dump');

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
  const { showAllNotifications } = state;

  // Combine and sort schedule and events by date
  const dates = state.schedule
    .map(add('render', schedule))
    .concat(state.events.map(add('render', events)))
    .sort((a, b) => new Date(a.starttime) > new Date(b.starttime) ? 1 : -1);

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
      <ol>
        ${ !important.length ? null : html`
          <li>
            <h3>${ lang.IMPORTANT }</h3>
            <ol>
              ${ important
                  .filter(first(showAllNotifications ? important.length : 3))
                  .map(props => html`<li>${ notifications(props) }</li>`)
              }
              ${ important.length <= 3 ? null : html`<li>${ toggleNotifications() }</li>` }
            </ol>
          </li>`
        }
        ${ Object.keys(days).filter(first(7)).map(day => html`
          <li>
            <h3><time>${ moment(day).calendar(null, FORMATS) }</time></h3>
            <ol>
              ${ days[day].map(props => html`<li>${ props.render(props) }</li>`) }
            </ol>
          </li>
        `) }
      </ol>

      ${ dump(state) }
    </div>
  `;

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

/**
 * Create an iterator that plucks the first X from an array
 * @param  {Number}   count Number of items to pluck
 * @return {Function}       Iterator
 */

function first(count) {
  return (item, index) => index < count;
}

/**
 * Create an iterator that assigns given key and value to iteratee items
 * @param {String} key   Key to assign
 * @param {Any}    value Value to associate with key
 * @return {Function}    Iterator
 */

function add(key, value) {
  return item => Object.assign({ [key]: value }, item);
}
