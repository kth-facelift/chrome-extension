const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const tracker = require('../tracker');
const match = require('../search/match');
const { add, capitalize, debounce } = require('../utils');

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
    const searchReg = state.search && new RegExp(state.search, 'i');
    const days = [{
      date: moment(state.now).startOf('date').toDate(),
      items: []
    }];
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

    if (showTodos) {
      dates.push(...state.todos
        .filter(todo => todo.status !== 'done')
        .map(add('render', renderTodo))
        .map(add('_type', 'todo'))
      );
    }

    const placeholders = [];
    dates
      .filter(item => {
        const start = new Date(item.starttime || item.date);
        const today = moment(state.now).startOf('day');
        return start >= today;
      })
      .filter(date => !searchReg || match(date, searchReg))
      .sort((a, b) => {
        const current = new Date(a.starttime || a.date);
        const next = new Date(b.starttime || b.date);
        return current < next ? -1 : 1;
      })
      .forEach(item => {
        const prev = days[days.length - 1];
        const date = prev && moment(prev.date);
        const since = prev ? Math.abs(date.diff(item.starttime || item.date, 'days')) : 0;

        for (let i = 0; i < since; i += 1) {
          date.add(1, 'days');
          days.push({ date: date.toDate(), items: [ placeholders.shift() ] });
        }

        days[days.length - 1].items.push(item);

        if (item.starttime) {
          const duration = moment(item.endtime).diff(item.starttime, 'days');

          if (duration) {
            for (let i = 0; i < duration; i += 1) {
              placeholders.push({
                _type: 'placeholder',
                date: moment(item.starttime).startOf('day').add(i + 1, 'days')
              });
            }
          }
        }
      });

    days.forEach(day => {
      day.items = day.items.filter(Boolean).sort((a, b) => {
        if (!a.starttime) { return -1; }
        if (!b.starttime) { return 1; }
        return new Date(a.starttime) < new Date(b.starttime) ? -1 : 1;
      });
    });

    return html`
      <section class="Banner" onscroll=${ debounce(onscroll) } onmouseleave=${ ondragend } onselectstart=${ event => event.preventDefault() } onmousedown=${ ondragstart } onmousemove=${ ondrag }>
        <ol class="Banner-days" style="width: ${ days.length * DAY_WIDTH }px;">
          ${ days.map(day => html`
            <li class="Banner-day" style="width: ${ DAY_WIDTH }px;">
              <h4 class="Banner-header">${ moment(day.date).calendar(state.now, FORMATS) }</h4>
              <ol class="Banner-events">
                ${ day.items.map(item => {
                  let popup;
                  let starttime = item.starttime ? moment(item.starttime) : moment(item.date).startOf('day').add(8, 'hours');
                  let endtime = item.endtime ? moment(item.endtime) : moment(item.date).endOf('day').subtract(3, 'hours');
                  const daystart = starttime.clone().startOf('day').add(8, 'hours');
                  const dayend = endtime.clone().endOf('day').subtract(3, 'hours');

                  if (starttime < daystart) {
                    starttime = daystart;
                  }

                  if (endtime > dayend) {
                    endtime = dayend;
                  }

                  let duration = endtime.diff(starttime, 'hours') || 1;
                  let offset = starttime.diff(daystart, 'hours');

                  if (duration > 12) {
                    duration -= endtime.diff(starttime, 'days') * 11;
                  }

                  if (offset < 0) {
                    offset = 0;
                  }

                  const element = html`
                    <li id=${ item.id }
                      class="Banner-event Banner-event--${ item._type }"
                      onmouseleave=${ onleave }
                      onmouseenter=${ onenter }
                      onclick=${ item.href ? onclick : null }
                      style="width: ${ (DAY_WIDTH / 12) * duration }px; left: ${ (DAY_WIDTH / 12) * offset }px;">
                    </li>
                  `;

                  function onclick() {
                    tracker.event('Schedule', 'Link', item._type);
                    window.location = item.href;
                  }

                  function onenter(event) {
                    const { currentTarget: target } = event;
                    const offset = target.offsetHeight + target.offsetTop;

                    popup = popup || item.render();

                    if (offset >= element.parentElement.offsetHeight / 2) {
                      popup.classList.add('Banner-popup--ontop');
                    } else {
                      popup.classList.remove('Banner-popup--ontop');
                    }

                    target.appendChild(popup);

                    tracker.event('Schedule', 'Inspect', capitalize(item._type));
                  }

                  function onleave() {
                    if (!popup) { return; }
                    popup.addEventListener('animationend', function onanimationend() {
                      popup.removeEventListener('animationend', onanimationend);
                      popup.classList.remove('is-disappearing');
                      if (popup.parentElement) {
                        popup.parentElement.removeChild(popup);
                      }
                    });
                    popup.classList.add('is-disappearing');
                  }

                  return element;
                }) }
              </ol>
            </li>
          `) }
        </ol>
      </section>
    `;
  };

  function onscroll() {
    tracker.event('Schedule', 'Pan');
  }

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
};

function renderSchedule() {
  const onclick = () => tracker.event('Schedule', 'Link', this.category);
  const parent = this.course || this.group;

  return html`
    <div class="Banner-popup">
      <strong>
        <time datetime=${ JSON.stringify(this.starttime) }>
          ${ moment(this.starttime).format('HH:mm') }-${ moment(this.endtime).format('HH:mm') }
        </time>
      </strong>
      <a href=${ this.href } class="Banner-link" onclick=${ onclick }>${ this.title }</a>
      <br />
      <em>
        <a href=${ parent.href } class="Banner-link" onclick=${ onclick }>${ parent.name }</a>
      </em>
    </div>
  `;
}

function renderEvent() {
  const onclick = () => tracker.event('Schedule', 'Link', 'Event');

  return html`
    <div class="Banner-popup">
      <strong>
        <time datetime=${ JSON.stringify(this.starttime) }>
          ${ moment(this.starttime).format('HH:mm') }-${ moment(this.endtime).format('HH:mm') }
        </time>
      </strong>
      <a href=${ this.href } class="Banner-link" onclick=${ onclick }>${ this.title }</a>
      <br />
      <em>${ this.subject }</em>
    </div>
  `;
}

function renderTodo() {
  return html`
    <div class="Banner-popup">
      ${ this.title }
    </div>
  `;
}
