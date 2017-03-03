const moment = require('moment');
const { dom } = require('../utils');

module.exports = function (source) {
  const markup = dom(source);
  const items = markup.querySelectorAll('.event');

  return Array.prototype.map.call(items, item => {
    const micro = item.nextElementSibling;
    const link = item.querySelector('h3 a');
    const subject = item.querySelector('.subjectArea');
    const location = item.querySelector('.location span');
    const lecturer = item.querySelector('.lecturer span');
    const respondent = item.querySelector('.respondent span');

    const event = {
      id: link.href.match(/aktuellt\/kalender\/([^?]+)/)[1],
      starttime: moment(micro.querySelector('.dtstart').innerText.trim()).toDate(),
      endtime: moment(micro.querySelector('.dtend').innerText.trim()).toDate(),
      type: item.querySelector('.eventType').innerText.trim(),
      title: link.innerText.trim(),
      href: link.href.split('?')[0],
      match: [ 'title', 'type', 'subject', 'respondent', 'lecturer' ]
    };

    if (subject) {
      event.subject = subject.innerText.trim();
    }

    if (location) {
      event.location = location.nextSibling.nodeValue.trim();
    }

    if (respondent) {
      event.respondent = respondent.nextSibling.nodeValue.trim();
    }

    if (lecturer) {
      event.lecturer = lecturer.nextSibling.nodeValue.trim();
    }

    return event;
  });
};
