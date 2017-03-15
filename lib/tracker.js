const moment = require('moment');
const { capitalize } = require('./utils');

let isSearching = false;

exports.send = send;
exports.event = event;
exports.set = set;

exports.create = user => chrome.runtime.sendMessage({
  type: 'tracker:create',
  user: user
});

exports.onAction = function track(state, action, data) {
  if (isSearching) {
    if (action !== 'search:find') {
      isSearching = false;
      event('Filter', 'Search', state.search);
    }
  } else if (action === 'search:find') {
    isSearching = true;
  }

  if (action === 'notifications:dismiss') {
    const props = state.notifications.find(props => props.id === data);
    event('Notifications', 'Dismiss', props.type || 'unknown');
  }

  if (/^filter/.test(action)) {
    event('Filter', `Toggle: ${ capitalize(action.split(':')[1]) }`, data ? 'On' : 'Off');
  }

  if (action === 'list:toggle' && data.expand) {
    event('List', 'Expand', data.id);
  }

  if (action === 'list:more') {
    event('List', 'Show more');
  }

  if (action === 'todo:done') {
    const props = state.todos.find(props => props.id === data);
    event('Todos', 'Dismiss', props.type);
  }

  if (action === 'todo:add') {
    event('Todos', 'Add', data.title);
  }

  if (action === 'todo:update') {
    const old = state.todos.find(todo => todo.id === data.id);
    const diff = Object.keys(data).filter(key => {
      if (key === 'date') {
        return !moment(data[key]).isSame(old[key]);
      }

      return data[key] !== old[key];
    });

    if (diff.length) {
      event('Todos', 'Update', diff.join(', '));
    }
  }
};

function send(...args) {
  chrome.runtime.sendMessage({ type: 'tracker:send', args });
}

function event(...args) {
  chrome.runtime.sendMessage({ type: 'tracker:event', args });
}

function set(...args) {
  chrome.runtime.sendMessage({ type: 'tracker:set', args });
}
