const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const tracker = require('../tracker');

module.exports = function (props) {
  return html`
    <article class="List-content List-content--event">
      <h4 class="List-title">${ props.type }</h4>
      <a href=${ props.href } onclick=${ onclick}>${ props.title }</a>
      <br />
      <strong>${ time(props) }</strong>
      ${ props.subject }
    </article>
  `;
};

function onclick() {
  tracker.event('List', 'Link', 'Event: Title');
}

function time(props) {
  const starttime = moment(props.starttime);
  const endtime = moment(props.endtime);
  const length = endtime.diff(starttime);
  const isMultiDay = endtime.diff(starttime, 'days') >= 1;
  const format = isMultiDay ? 'DD MMM YYYY' : 'HH:mm';
  const divider = isMultiDay ? ` ${ lang.TO } ` : '-';

  const content = [ starttime.format(format) ];

  if (length) {
    content.push(divider, endtime.format(format));
  }

  return html`
    <time datetime=${ starttime.format('YYYY-MM-DD[T]HH:mm') }>
      ${ content}
    </time>
  `;
}
