const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const tracker = require('../tracker');
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

module.exports = function (props, now, send) {
  return html`
    <article class="List-content List-content--notification">
      <h4 class="List-title">${ props.type || lang.NOTIFICATION }</h4>
      <a href=${ props.href } onclick=${ track }>${ props.title }</a>
      ${ !props.action ? null : html`
        <div>
          ${ capitalize(props.action) } <strong>${ props.actor }</strong> ${ moment(props.time).calendar(now, FORMATS) } ${ lang.IN } <em>${ props.context }</em>
        </div>
      ` }
      <div class="List-actions">
        <button class="List-action List-action--dismiss" onclick=${ ondismiss } title=${ lang.DISMISS }>✕</button>
      </div>
    </article>
  `;

  function track() {
    tracker.event('List', 'Link', 'Notification: Title');
  }

  function ondismiss(event) {
    send('notifications:dismiss', props.id);
    event.preventDefault();
  }
};
