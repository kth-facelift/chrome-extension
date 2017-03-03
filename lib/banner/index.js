const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const { add } = require('../utils');

const DAY_WIDTH = 300;
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

module.exports = function () {
  let dragstart = 0;
  let scrollstart = 0;
  let isDraging = false;

  document.addEventListener('mouseup', ondragend, false);
  document.addEventListener('mouseleave', ondragend, false);

  return function render(state, prev, send) {
    const { showSchedule, showEvents, showTodos } = state;
    const days = [];
    const dates = [];

    if (showSchedule) {
      dates.push(...state.schedule
        .map(add('render', renderSchedule))
        .map(add('_type', 'schedule'))
      );
    }

    if (showEvents) {
      dates.push(...state.events
        .map(add('render', renderEvent))
        .map(add('_type', 'event'))
      );
    }

    dates
      .filter(item => {
        const start = new Date(item.starttime || item.date);
        const today = moment(state.now).startOf('day');
        return start >= today;
      })
      .sort((a, b) => {
        const current = new Date(a.starttime || a.date);
        const next = new Date(b.starttime || b.date);
        return current < next ? -1 : 1;
      })
      .forEach(item => {
        const prev = days[days.length - 1];
        const date = prev && moment(prev.date);
        const since = prev ? Math.abs(date.diff(item.starttime, 'days')) : 0;

        for (let i = 0; i < since - 1; i += 1) {
          date.add(1, 'days');
          days.push({ date: date.toDate(), items: [] });
        }

        if (prev && date.isSame(prev.date, 'day')) {
          prev.items.push(item);
        } else {
          days.push({
            date: moment(item.starttime).startOf('date').toDate(),
            items: [ item ]
          });
        }
      });

    return html`
      <section class="Banner" mouseleave=${ ondragend } onselectstart=${ event => event.preventDefault() } onmousedown=${ ondragstart } onmousemove=${ ondrag }>
        <ol class="Banner-days" style="width: ${ days.length * DAY_WIDTH }px;">
          ${ days.map(day => html`
            <li class="Banner-day" style="width: ${ DAY_WIDTH }px;">
              <h4 class="Banner-header">${ moment(day.date).calendar(state.now, FORMATS) }</h4>
              <ol class="Banner-events">
                ${ day.items.map(item => {
                  const starttime = moment(item.starttime);
                  const endtime = moment(item.endtime);
                  const daystart = starttime.clone().startOf('day').add(8, 'hours');
                  const offset = starttime.diff(daystart, 'hours');
                  let duration = endtime.diff(starttime, 'hours') || 1;

                  if ((offset + duration) > 12) {
                    duration = 12 - offset;
                  }

                  return html`
                    <li class="Banner-event Banner-event--${ item._type }" onmouseleave=${ onleave } onmouseenter=${ onenter } style="width: ${ (DAY_WIDTH / 12) * duration }px; left: ${ (DAY_WIDTH / 12) * offset }px;">
                        ${ item.render() }
                    </li>
                  `;

                  function onleave() {
                    const { currentTarget: target } = event;
                    const from = target.offsetWidth;
                    const to = (DAY_WIDTH / 12) * duration;
                    target.style.width = `${ from }px`;
                    requestAnimationFrame(() => {
                      target.style.width = `${ to }px`;
                    });
                  }
                }) }
              </ol>
            </li>
          `) }
        </ol>
      </section>
    `;
  };

  function ondragend() {
    isDraging = false;
  }

  function ondragstart(event) {
    const { currentTarget: target } = event;

    dragstart = event.clientX;
    scrollstart = target.scrollLeft;
    isDraging = true;
  }

  function ondrag(event) {
    if (!isDraging) { return; }

    const { currentTarget: target } = event;
    const delta = dragstart - event.clientX;

    target.scrollLeft = scrollstart + delta;
  }

  function onenter(event) {
    const { currentTarget: target } = event;
    const from = target.offsetWidth;
    target.style.width = '';
    const to = target.offsetWidth;
    requestAnimationFrame(() => {
      target.style.width = `${ from }px`;
      requestAnimationFrame(() => {
        target.style.width = `${ to }px`;
      });
    });
  }
};

function renderSchedule() {
  return html`
    <div>
      <strong>
        ${ moment(this.starttime).format('HH:mm') }-${ moment(this.endtime).format('HH:mm') }
      </strong>
      <a href=${ this.href } class="Banner-link">${ this.title }</a>
      <br />
      <em><a href=${ this.course.href } class="Banner-link">${ this.course.name }</a></em>
    </div>
  `;
}

function renderEvent() {
  return html`
    <div>
      <strong>
        ${ moment(this.starttime).format('HH:mm') }-${ moment(this.endtime).format('HH:mm') }
      </strong>
      <a href=${ this.href } class="Banner-link">${ this.title }</a>
      <br />
      <em>${ this.subject }</em>
    </div>
  `;
}
