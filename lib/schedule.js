const html = require('yo-yo');
const moment = require('moment');
const { dom } = require('./utils');
const lang = require('./lang');

const TIME_FORMAT = 'ddd D MMM HH:mm';
const TIME_PATTERN = /(\w{3} \d{1,2} \w{3}) (\d{1,2}:\d{1,2})-(\d{1,2}:\d{1,2})/;

exports.create = function (send) {
  return function (state, prev) {
    return html`
      <ul class="list-group">
        ${ state.schema.map(event => html`
          <li class="list-group-item">
            <time>${ event.time }</time>
            <a href=${ event.href }>${ event.title }</a>
          </li>
        `)}
      </ul>
    `;
  };
};

exports.parse = function (source) {
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
    const location = meta.querySelector('.location-info a');
    const description = details.querySelector('.event_info');

    events.push({
      id: header.id,
      modified: modified && modified.href,
      starttime: moment(`${ time[1] } ${ time[2] }`, TIME_FORMAT).toDate(),
      endtime: moment(`${ time[1] } ${ time[3] }`, TIME_FORMAT).toDate(),
      href: link.href,
      title: link.innerText.trim(),
      type: meta.querySelector('.type').innerText.trim(),
      description: description && description.innerHTML,
      course: course && {
        href: course.href,
        name: course.innerText.trim()
      },
      location: location && {
        href: location.href,
        name: location.innerText.trim()
      }
    });
  }

  return events;
};
