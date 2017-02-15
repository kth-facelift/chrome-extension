const html = require('yo-yo');
const sendAction = require('send-action');
const { jsonp, scrape } = require('./lib/utils');
const courses = require('./lib/courses');
const schedule = require('./lib/schedule');
const notifications = require('./lib/notifications');

const parent = document.querySelector('#primaryBlocks');

const send = sendAction({
  onAction(state, action, data) {
    switch (action) {
      case 'init': return Object.assign({}, state, data);
      default: return state;
    }
  },
  onChange(state, prev) {
    html.update(tree, render(state, prev));
  },
  state: {
    schedule: [],
    notifications: [],
    courses: {
      student: { current: [], finished: [], other: [] },
      teacher: { current: [], finished: [], other: [] }
    }
  }
});

jsonp('https://www.kth.se/social/home/personal-menu/courses/')
  .then(courses.parse)
  .then(props => send('init', { courses: props }));

scrape('https://www.kth.se/social/home/calendar/')
  .then(schedule.parse)
  .then(props => send('init', { schedule: props }));

jsonp('https://www.kth.se/social/home/personal-menu/notifications/')
  .then(notifications.parse)
  .then(props => send('init', { notifications: props }));


// const renderCourses = courses.create(send);
// const renderSchema = schema.create(send);

const tree = render(send.state(), send.state());

parent.insertBefore(tree, parent.firstChild);

function render(state, prev) {
  return html`
    <div class="row">
      <div class="col-md-12">
        <pre>${ JSON.stringify(state, null, 2) }</pre>
      </div>
    </div>
  `;
}
