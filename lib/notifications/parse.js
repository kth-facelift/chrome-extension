const moment = require('moment');
const { dom } = require('../utils');

const DATE_FORMAT = 'D MMMM YYYY at HH:mm';
const CLASS_TO_PROP =  {
  'context-name': 'context',
  'content-type': 'type',
  'notification-action': 'action',
  'actor': 'actor'
};

module.exports = function (source) {
  const markup = dom(source);
  const items = markup.querySelectorAll('.notice-list li:not(.section-title)');

  return Array.prototype.map.call(items, item => {
    const link = item.querySelector('.notice-info a');
    const time = item.querySelector('.time');

    const notification = {
      // TODO: Handle links to /student/minasidor/ (i.e. new results availible)
      href: link.href,
      id: item.querySelector('[notice-time]').getAttribute('notice-time'),
      time: moment(time.innerText.trim(), DATE_FORMAT).toDate()
    };

    /**
     * Parse link content that can either be nested spans with data or just text
     */

    for (let node of link.childNodes) {
      if (node.nodeType === 3) {
        const value = node.nodeValue.trim();

        if (value) {
          // Unwrap quoted title
          notification.title = value.replace(/^"([\s\S]+)"$/, '$1');
        }
      } else if (CLASS_TO_PROP.hasOwnProperty(node.className)) {
        notification[CLASS_TO_PROP[node.className]] = node.innerText;
      }
    }

    return notification;
  });
};
