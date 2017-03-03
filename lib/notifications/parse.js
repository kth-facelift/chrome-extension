const moment = require('moment');
const { dom } = require('../utils');

const DATE_FORMAT = 'DD MM YYYY HH:mm';
const DATE_REGEXP = /(\d{2} \d{2} \d{4} \d{2}:\d{2}) \d+ \d+/;
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
    const id = item.querySelector('[notice-time]').getAttribute('notice-time');
    const img = item.querySelector('.icon-record-outline, .icon-record');

    const notification = {
      // TODO: Handle links to /student/minasidor/ (i.e. new results availible)
      href: link.href,
      id: id,
      time: moment(id.match(DATE_REGEXP)[1], DATE_FORMAT).toDate(),
      match: [ 'title', 'type', 'actor' ]
    };

    if (img) {
      if (img.classList.contains('orange')) {
        notification.status = 'new';
      } else if (img.classList.contains('blue')) {
        if (img.classList.contains('icon-record-outline')) {
          notification.status = 'read';
        } else {
          notification.status = 'unread';
        }
      }
    }

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
