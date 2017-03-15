const moment = require('moment');
const { dom } = require('../utils');

const TIME_FORMAT = 'ddd D MMM HH:mm';
const TIME_PATTERN = /(\w+ \d+ \w+) (\d{1,2}:\d{1,2})-(\d{1,2}:\d{1,2})/;

module.exports = function (source) {
  const markup = dom(source);
  const headers = markup.querySelectorAll('.event_head');
  const data = markup.querySelectorAll('.event_details');
  const events = [];

  for (let i = 0; i < data.length; i += 1) {
    const header = headers[i];
    const details = data[i];
    const modified = header.querySelector('a.recently-modified');
    const time = header.querySelector('.time').innerText.trim().match(TIME_PATTERN);
    const link = header.querySelector('.title-link');
    const meta = details.querySelector('.type_and_place');
    const course = meta.querySelector('.course');
    const group = meta.querySelector('.organic_group');
    const location = meta.querySelector('.location-info');
    const type = meta.querySelector('.type');
    const description = details.querySelector('.event_info');
    const heading = details.querySelector('.list-heading');

    const event = {
      id: header.id,
      modified: modified && modified.href,
      starttime: moment(`${ time[1] } ${ time[2] }`, TIME_FORMAT).toDate(),
      endtime: moment(`${ time[1] } ${ time[3] }`, TIME_FORMAT).toDate(),
      href: link.href,
      title: link.innerText.trim(),
      category: meta.querySelector('.type_name').innerText.trim(),
      match: [ 'title', 'type', 'course.name', 'group.name', 'description', 'teacher' ]
    };

    if (type) {
      event.type = type.innerText.trim();
    }

    if (description) {
      event.description = description.innerHTML;
    }

    if (location) {
      const link = location.querySelector('a');
      event.location = {};

      if (link) {
        event.location.href = link.href;
        event.location.name = link.innerText.trim();
      } else {
        const heading = location.querySelector('.list-heading');
        event.location.name = heading.nextSibling.nodeValue.trim();
      }
    }

    if (course) {
      event.course = {
        href: course.href,
        name: course.innerText.trim()
      };
    }

    if (group) {
      event.group = {
        href: group.href,
        name: group.innerText.trim()
      };
    }

    if (heading && /teacher/i.test(heading.innerText)) {
      event.teacher = heading.nextSibling.nodeValue.trim();
    }

    events.push(event);
  }

  return events;
};
