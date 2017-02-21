const html = require('yo-yo');
const sendAction = require('send-action');
const { jsonp, scrape } = require('./lib/utils');
const app = require('./lib/app');

/**
 * Read previously stored state from local storage
 */

const storedState = localStorage.getItem('kth-facelift-state');

/**
 * Find root node where to inject application
 */

const root = document.querySelector('.bodyWrapper');

/**
 * Create application model
 */

const send = sendAction({

  /**
   * This is where the next state model is derived. Determined by action type
   * a new state object is created and returned. This is automatically called
   * whenever one calls send as such: `send('action', { data })`
   *
   * @param {Object}        state  Current state model
   * @param {String}        action Name of the action that is called
   * @param {Object|Array}  data   Action payload
   */

  onAction(state, action, data) {
    switch (action) {
      // Let `init` overwrite whatever may happen to be in the current state
      case 'init': return clone(state, data);

      // Toggle notifications
      case 'notifications:show': return clone(state, { showAllNotifications: data });

      // Filter what is shown in list
      case 'schedule:filter': return clone(state, { showSchedule: data });
      case 'events:filter': return clone(state, { showEvents: data });
      case 'notifications:filter': return clone(state, { showNotifications: data });

      // Action is not acocunted for, just forward current state
      default: return state;
    }
  },

  /**
   * Whenever a new state has been determined this gets called. We simply
   * rerender the entire DOM tree and then update the existing tree as needed
   *
   * @param {Object} state The new state as derived from `onACtion`
   * @param {Object} prev  The previous state model
   */

  onChange(state, prev) {
    html.update(tree, render(state, prev));

    // Store state in local storage for performance sake
    localStorage.setItem('kth-facelift-state', JSON.stringify(state));
  },

  /**
   * Initial state model used for first render
   * @type {Object}
   */

  state: storedState ? JSON.parse(storedState) : {
    events: [],
    schedule: [],
    notifications: [],
    courses: {
      student: { current: [], finished: [], other: [] },
      teacher: { current: [], finished: [], other: [] }
    },
    showAllNotifications: false,
    showSchedule: true,
    showEvents: true,
    showNotifications: true
  }
});

/**
 */

// jsonp('https://www.kth.se/social/home/personal-menu/courses/')
//   .then(require('./lib/courses/parse'))
//   .then(props => send('init', { courses: props }));
//
// scrape('https://www.kth.se/social/home/calendar/')
//   .then(require('./lib/schedule/parse'))
//   .then(props => send('init', { schedule: props }));
//
// scrape('https://www.kth.se/social/notifications/notice_list/')
//   .then(require('./lib/notifications/parse'))
//   .then(props => send('init', { notifications: props }));
//
// scrape('https://www.kth.se/aktuellt/kalender?date=2017-02-19&length=90')
//   .then(require('./lib/events/parse'))
//   .then(props => send('init', { events: props }));
if (!storedState || process.env.NODE_ENV === 'production') {
}

/**
 * Create initial DOM tree with initial state
 */

const tree = render(send.state(), send.state());

/**
 * Inject tree in document
 */

root.insertBefore(tree, root.firstChild);

function render(state, prev) {
  return app(state, prev, send);
}

function clone(...args) {
  return Object.assign({}, ...args);
}
