const html = require('yo-yo');
const sendAction = require('send-action');
const { jsonp, scrape } = require('./lib/utils');
const app = require('./lib/app');

const INITIAL_STATE = {
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
  showTodo: true,
  showNotifications: true
};

/**
 * Read previously stored state from local storage
 */

let storedState = localStorage.getItem('kth-facelift-state');
if (storedState) {
  try {
    storedState = JSON.parse(storedState);
  } catch (err) {
    storedState = null;
  }
}

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

      // Mark notification as read
      case 'notifications:dismiss': return clone(state, {
        notifications: state.notifications.map(props => {
          if (props.id === data) {
            return clone(props, { status: 'read' });
          }
          return props;
        })
      });

      // Filter what is shown in list
      case 'filter:schedule': return clone(state, { showSchedule: data });
      case 'filter:events': return clone(state, { showEvents: data });
      case 'filter:notifications': return clone(state, { showNotifications: data });
      case 'filter:todo': return clone(state, { showTodo: data });

      // Allow modifying the current time
      case 'timetravel': return Object.assign(state, { now: data });

      // Action is not acocunted for, just forward current state
      default: return clone(state);
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

  state: storedState ? clone(INITIAL_STATE, storedState) : INITIAL_STATE
});

/**
 * Scrape and parse a bunch of resources on kth.se unless in development
 */

if (!storedState || process.env.NODE_ENV !== 'development') {
  jsonp('https://www.kth.se/social/home/personal-menu/courses/')
    .then(require('./lib/courses/parse'))
    .then(props => send('init', { courses: props }));

  scrape('https://www.kth.se/social/home/calendar/')
    .then(require('./lib/schedule/parse'))
    .then(props => send('init', { schedule: props }));

  scrape('https://www.kth.se/social/notifications/notice_list/')
    .then(require('./lib/notifications/parse'))
    .then(props => {
      const { notifications: prev } = send.state();
      const notifications = props.map(item => {
        // Lookup duplicte in existing state
        const existing = prev.find(prevItem => prevItem.id === item.id);

        if (existing) {
          // Persist status from old state to the new one
          return clone(item, { status: existing.status });
        }

        return item;
      });

      send('init', { notifications });
    });

  scrape('https://www.kth.se/aktuellt/kalender?date=2017-02-19&length=90')
    .then(require('./lib/events/parse'))
    .then(props => send('init', { events: props }));
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
  return Object.assign({}, ...args, { now: Date.now() });
}
