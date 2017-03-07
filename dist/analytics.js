const NAME_SPACE = 'chronicle';
const ANALYTICS_ID = 'UA-12370753-3';
const ANALYTICS_CDN = 'https://www.google-analytics.com/analytics.js';

chrome.runtime.onMessage.addListener(request => {
  if (request.type === 'tracker:create') {
    const script = document.createElement('script');
    script.async = true;
    script.src = ANALYTICS_CDN;
    script.onload = onload;
    script.onerror = onerror;

    document.body.appendChild(script);
  }
});

chrome.runtime.onMessage.addListener(request => {
  const match = request.type.match(/^tracker:(\w+)/);

  if (match) {
    if (match[1] === 'send') {
      send(...request.args);
    }
    if (match[1] === 'event') {
      event(...request.args);
    }
    if (match[1] === 'set') {
      set(...request.args);
    }
  }
});

function send(...args) {
  ga(`${ NAME_SPACE }.send`, ...args);
}

function event(category, action, label) {
  const fields = typeof category === 'object' ? category : {
    eventCategory: category,
    eventAction: action,
    eventLabel: label
  };

  send('event', fields);
}

function set(prop, value) {
  ga(`${ NAME_SPACE }.set`, prop, value);
}

function onerror(err) {
  sendMessage('tracker:error', { err: err.message });
}

function onload() {
  ga('create', ANALYTICS_ID, 'auto', NAME_SPACE);
  send('pageview');
  sendMessage('tracker:ready');
}

function sendMessage(type, body = {}) {
  chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, Object.assign({ type }, body));
  });
}
