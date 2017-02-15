const html = require('yo-yo');
const moment = require('moment');
const { dom } = require('./utils');
const lang = require('./lang');

const DATE_FORMAT = 'D MMMM YYYY at HH:mm';

exports.parse = function (source) {
  const markup = dom(source);
  const items = markup.querySelectorAll('.latest-notifications li');

  return Array.prototype.map.call(items, item => {
    const link = item.querySelector('.notice-info a');

    return {
      href: link.href,
      title: link.innerText.trim(),
      type: getType(item.querySelector('.notice-marker')),
      time: moment(item.querySelector('.time').innerText.trim(), DATE_FORMAT)
    };
  });
};

function getType(element) {
  if (element.classList.contains('icon-record')) {
    return 'record';
  }

  return 'general';
}
