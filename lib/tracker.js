const { capitalize } = require('./utils');

module.exports = function () {
  const queue = [];
  let isInitialized = false;
  let isSearching = false;

  chrome.runtime.sendMessage({ type: 'tracker:create' });

  chrome.runtime.onMessage.addListener(request => {
    if (request.type === 'tracker:ready') {
      isInitialized = true;
      if (queue.length) {
        let fn;
        while ((fn = queue.pop())) {
          fn();
        }
      }
    }
  });

  function track(state, action, data) {
    if (!isInitialized) {
      queue.push(() => track(state, action, data));
      return;
    }

    if (isSearching) {
      const backspacing = data.length < state.search.length;
      const stopped = action !== 'search:find';

      if (backspacing || stopped) {
        isSearching = false;
        event('Filter', 'Search', state.search);
      }
    } else if (action === 'search:find') {
      isSearching = true;
    }

    if (action === 'notifications:dismiss') {
      const props = state.notifications.find(props => props.id === data.id);
      event('Notifications', 'Dismiss', props.type || 'unknown');
    }

    if (/^filter/.test(action)) {
      event('Filter', capitalize(action.split(':')[1]), data ? 'On' : 'Off');
    }

    if (action === 'expand:toggle' && data.expand) {
      event('List', 'Expand', data.id);
    }

    if (action === 'todo:done') {
      const props = state.todos.find(props => props.id === data);
      event('Todos', 'Dismiss', props.type);
    }

    if (action === 'todo:add') {
      event('Todos', 'Add', data.title);
    }
  }

  track.send = (...args) => {
    if (!isInitialized) {
      queue.push(() => send(...args));
    } else {
      send(...args);
    }
  };
  track.set = (...args) => {
    if (!isInitialized) {
      queue.push(() => set(...args));
    } else {
      set(...args);
    }
  };

  return track;
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
