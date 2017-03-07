(function () {
  'use strict';

  const NAMESPACE = 'chronicle';
  const ANALYTICS_ID = 'UA-12370753-3';
  const ANALYTICS_CDN = 'https://www.google-analytics.com/analytics_debug.js';

  let isInitialized = false;
  const queue = [];

  chrome.runtime.onMessage.addListener((request, sender, callback) => {
    if (request.type === 'tracker:create') {
      if (!isInitialized) {
        const script = document.createElement('script');
        script.async = true;
        script.src = ANALYTICS_CDN;
        script.onload = onload;
        script.onerror = onerror;

        document.body.appendChild(script);
      } else {
        onload();
      }
    } else if (!isInitialized) {
      queue.push(() => onrequest(request, sender, callback));
    } else {
      onrequest(request, sender, callback);
    }

    function onrequest(request, sender, callback) {
      const match = request.type.match(/^tracker:(\w+)/);

      if (match) {
        if (match[1] === 'create') {
          if (!isInitialized) {
            const script = document.createElement('script');
            script.async = true;
            script.src = ANALYTICS_CDN;
            script.onload = onload;
            script.onerror = onerror;

            document.body.appendChild(script);

            isInitialized = true;
          } else {
            onload();
          }
        } else {
          if (match[1] === 'send') {
            send(...request.args, callback);
          }
          if (match[1] === 'event') {
            event(...request.args, callback);
          }
          if (match[1] === 'set') {
            set(...request.args, callback);
          }
        }
      }

      function send(...args) {
        ga(`${ NAMESPACE }.send`, ...args);
      }

      function event(category, action, label) {
        const fields = typeof category === 'object' ? category : {
          eventCategory: category,
          eventAction: action,
          eventLabel: label
        };

        fields.transport = 'beacon';

        send('event', fields);
      }

      function set(prop, value) {
        ga(`${ NAMESPACE }.set`, prop, value);
      }

    }

    function onerror(err) {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'tracker:error',
        err: err.message
      });
    }

    function onload() {
      if (!ga.getByName(NAMESPACE)) {
        ga('create', ANALYTICS_ID, 'none', NAMESPACE, { userId: request.user });
        ga(`${ NAMESPACE }.set`, 'checkProtocolTask', function noop() { /* noop */ });
      }

      ga(`${ NAMESPACE }.send`, 'pageview');

      if (queue.length) {
        let fn;
        while ((fn = queue.pop())) {
          fn();
        }
      }

      isInitialized = true;
    }
  });
}());
