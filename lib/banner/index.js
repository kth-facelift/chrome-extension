const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');

const FORMATS = {
  sameDay: `[${ lang.SAME_DAY }]`,
  nextDay: `[${ lang.NEXT_DAY }]`,
  nextWeek: 'dddd',
  lastDay: `[${ lang.ONGOING }]`,
  lastWeek: `[${ lang.ONGOING }]`,
  sameElse: function () {
    switch (lang.current) {
      case 'sv': return 'dddd D MMMM';
      case 'en':
      default: return 'dddd, MMMM Do';
    }
  }
};

module.exports = function (state, prev, send) {
  const days = [];
  state.schedule.forEach(item => {
    const prev = days[days.length - 1];
    const date = prev && moment(prev.date);
    const since = prev ? Math.abs(date.diff(item.starttime, 'days')) : 0;

    for (let i = 0; i < since; i += 1) {
      date.add(1, 'days');
      days.push({ date: date.toDate(), items: [] });
    }

    if (date && date.isSame(item.starttime, 'day')) {
      prev.items.push(item);
    } else {
      days.push({
        date: moment(item.starttime).startOf('date').toDate(),
        items: [ item ]
      });
    }
  });

  // ${ days.map(item => html`
  //   <li>
  //     <strong>
  //       ${ moment(item.starttime).format('HH:mm') }-${ moment(item.endtime).format('HH:mm') }
  //     </strong>
  //     <em>${ item.title }</em>
  //   </li>
  // `) }

  return html`
    <section class="Banner">
      <ol class="Banner-days" style="width: ${ days.length * 200 }px;">
        ${ days.map(day => html`
          <li class="Banner-day">
            <h4 class="Banner-header">${ moment(day.date).calendar(state.now, FORMATS) }</h4>
            <ol class="Banner-events">
              ${ day.items.map(item => html`
                <li class="Banner-event">
                  <strong>
                    ${ moment(item.starttime).format('HH:mm') }-${ moment(item.endtime).format('HH:mm') }
                  </strong>
                  <em>${ item.title }</em>
                </li>
              `) }
            </ol>
          </li>
        `) }
      </ol>
    </section>
  `;
};
