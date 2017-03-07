const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const tracker = require('../tracker');
const { onlyif, capitalize } = require('../utils');

const time = str => function () {
  return this.format('HHmm') === '0000' ? str : `${ str } [${ lang.AT_TIME }] HH:mm`;
};
const FORMATS = {
  sameDay: time(`[${ lang.SAME_DAY }]`),
  nextDay: time(`[${ lang.NEXT_DAY }]`),
  nextWeek: time('dddd'),
  lastDay: time(`[${ lang.LAST_DAY }]`),
  lastWeek: time(`[${ lang.LAST_OTHER }] dddd`),
  sameElse: function () {
    switch (lang.current) {
      case 'sv': return time('D MMM').call(this);
      case 'en':
      default: return time('MMM Do').call(this);
    }
  }
};

exports.assignment = function (props, state, send) {
  const course = state.courses.find(course => course.id === props.course);

  return html`
    <article class="List-content List-content--todo">
      <h4 class="List-title">${ lang.ASSIGNMENT }</h4>
      ${ props.title }
      <br />
      <strong>
        ${ capitalize(moment(props.date).calendar(state.now, FORMATS)) }
      </strong> | ${ onlyif(course, () => html`<a href=${ course.href } onclick=${ onclick }>${ course.name }</a>`) }
      <button class="List-dismiss" onclick=${ dismiss(props.id, send) } title=${ lang.DISMISS }>✕</button>
    </article>
  `;

  function onclick() {
    tracker.event('List', 'Link', 'Todo: Course');
  }
};

exports.task = function (props, state, send) {
  return html`
    <article class="List-content List-content--todo">
      <h4 class="List-title">${ lang.TODO }</h4>
      ${ props.title }
      <br />
      <strong>
        ${ capitalize(moment(props.date).calendar(state.now, FORMATS)) }
      </strong>
      <button class="List-dismiss" onclick=${ dismiss(props.id, send) } title=${ lang.DISMISS }>✕</button>
    </article>
  `;
};

exports.registration = function (props, state, send) {
  return html`
    <article class="List-content List-content--todo">
      <h4 class="List-title">${ lang.REGISTRATION }</h4>
      ${ lang.REGISTRATIONS_UPCOMING }
      <br />
      <strong>
        ${ capitalize(moment(props.date).calendar(state.now, FORMATS)) }
      </strong> | <a href=${ props.href } onclick=${ onclick }>${ lang.WEB_REGISTRATIONS }</a>
      <button class="List-dismiss" onclick=${ dismiss(props.id, send) } title=${ lang.DISMISS }>✕</button>
    </article>
  `;

  function onclick() {
    tracker.event('List', 'Link', 'Todo: Registration');
  }
};

function dismiss(id, send) {
  return event => {
    send('todo:done', id);
    event.preventDefault();
  };
}
