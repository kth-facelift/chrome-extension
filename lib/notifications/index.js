const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const { capitalize } = require('../utils');

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

module.exports = function (props, send) {
  return html`
    <article>
      <h4>${ props.type || lang.NOTIFICATION }</h4>
      <a href=${ props.href }>${ props.title }</a>
      ${ !props.action ? null : html`
        <div>
          ${ capitalize(props.action) } <strong>${ props.actor }</strong> ${ moment(props.time).calendar(null, FORMATS) } ${ lang.IN } <em>${ props.context }</em>
        </div>
      ` }
      <button onclick=${ onclick } title=${ lang.DISMISS }>
        ${ lang.DISMISS }
      </button>
    </article>
  `;

  function onclick(event) {
    send('notifications:dismiss', props.id);
    event.preventDefault();
  }
};
