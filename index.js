const html = require('yo-yo');
const sendAction = require('send-action');
const jsonp = require('./lib/jsonp');
const courses = require('./lib/courses');

const profile = document.querySelector('#ProfilePage');

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
    courses: {
      student: { current: [], finished: [], other: [] },
      teacher: { current: [], finished: [], other: [] }
    }
  }
});

jsonp('https://www.kth.se/social/home/personal-menu/courses/')
  .then(courses.parse)
  .then(props => send('init', { courses: props }));

const renderCourses = courses.create(send);

const tree = render(send.state(), send.state());
profile.parentNode.insertBefore(tree, profile);
profile.parentNode.removeChild(profile);

function render(state, prev) {
  return html`
    <div class="row">
      <div class="col-md-12">
        <h1>Carl & the Sound Guys rule!</h1>
        ${ renderCourses(state, prev) }
      </div>
    </div>
  `;
}
