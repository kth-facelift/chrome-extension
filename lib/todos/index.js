const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
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
        ${ capitalize(moment(props.date).calendar(null, FORMATS)) }
      </strong> | ${ onlyif(course, () => html`<a href=${ course.href }>${ course.name }</a>`) }
    </article>
  `;
};

exports.task = function (props, state, send) {
  return html`
    <article class="List-content List-content--todo">
      <h4 class="List-title">${ lang.TODO }</h4>
      ${ props.title }
      <br />
      <strong>
        ${ capitalize(moment(props.date).calendar(null, FORMATS)) }
      </strong>
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
      </strong> | <a href=${ props.href }>${ lang.WEB_REGISTRATIONS }</a>
    </article>
  `;
};
