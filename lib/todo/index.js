const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const { onlyif } = require('../utils');

exports.assignment = function (props, state, send) {
  const course = state.courses.find(course => course.id === props.course);
  const isSoon = moment(props.date).diff(state.now, 'days') < 5;
  const format = isSoon ? `dddd [${ lang.AT_TIME }] HH:mm` : 'DD MMM YYYY';

  return html`
    <article>
      <h4>${ props.type }</h4>
      ${ moment(props.date).format(format) } |
      ${ onlyif(course, html`<a href=${ course.href }>${ course.href }</a>`, ' | ') }
      ${ props.title }
    </article>
  `;
};
