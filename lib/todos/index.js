const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const { onlyif, capitalize } = require('../utils');

const FORMATS = {
  sameDay: `[${ lang.SAME_DAY } ${ lang.AT_TIME }] HH:mm`,
  nextDay: `[${ lang.NEXT_DAY } ${ lang.AT_TIME }] HH:mm`,
  nextWeek: `dddd [${ lang.AT_TIME }] HH:mm`,
  lastDay: `[${ lang.LAST_DAY } ${ lang.AT_TIME }] HH:mm`,
  lastWeek: `[${ lang.LAST_OTHER }] dddd [${ lang.AT_TIME }] HH:mm`,
  sameElse: () => {
    switch (lang.current) {
      case 'sv': return `[${ lang.ON_DATE }] D MMM [${ lang.AT_TIME }] HH:mm`;
      case 'en':
      default: return `[${ lang.ON_DATE }] MMM Do [${ lang.AT_TIME }] HH:mm`;
    }
  }
};

exports.assignment = function (props, state, send) {
  const course = state.courses.find(course => course.id === props.course);

  return html`
    <article>
      <h4>${ lang.ASSIGNMENT }</h4>
      ${ props.title }
      <br />
      <strong>
        ${ capitalize(moment(props.date).calendar(null, FORMATS)) }
      </strong> | ${ onlyif(course, () => html`<a href=${ course.href }>${ course.name }</a>`) }
    </article>
  `;
};

exports.registration = function (props, state, send) {
  return html`
    <article>
      <h4>${ lang.REGISTRATION }</h4>
      ${ lang.REGISTRATIONS_UPCOMING }
      <br />
      <strong>
        ${ capitalize(moment(props.date).calendar(state.now, FORMATS)) }
      </strong> | <a href=${ props.href }>${ lang.WEB_REGISTRATIONS }</a>
    </article>
  `;
};
