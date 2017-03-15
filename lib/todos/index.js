const html = require('yo-yo');
const moment = require('moment');
const edit = require('./edit');
const tracker = require('../tracker');
const modal = require('../modal');
const { pencil } = require('../icons');
const { onlyif, capitalize } = require('../utils');
const lang = require('../lang');

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
      <div class="List-controls">
      <div class="List-actions">
        <button class="List-action List-action--dismiss" onclick=${ dismiss(props.id, send) } title=${ lang.DISMISS }>✕</button>
      </div>
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
      <div class="List-actions">
        <button class="List-action List-action--dismiss" onclick=${ dismiss(props.id, send) } title=${ lang.DISMISS }>✕</button>
        <button class="List-action" onclick=${ editTask(props, send) }>${ pencil(14) }</button>
      </div>
    </article>
  `;
};

function editTask(task, send) {
  return () => {
    const content = edit(task, {
      onsave, onchange, oncancel, heading: lang.EDIT_TODO
    });
    modal.render(content, oncancel);

    tracker.event('Todos', 'Edit', `Title: ${ task.title }`);

    function onsave(props) {
      send('todo:update', props);
      modal.close();
    }

    function onchange(event) {
      tracker.event('Todos', 'Edit', `${ event.target.name }: ${ event.target.value }`);
    }

    function oncancel() {
      tracker.event('Todos', 'Edit', 'Cancel');
      modal.close();
    }
  };
}

exports.registration = function (props, state, send) {
  return html`
    <article class="List-content List-content--todo">
      <h4 class="List-title">${ lang.REGISTRATION }</h4>
      ${ lang.REGISTRATIONS_UPCOMING }
      <br />
      <strong>
        ${ capitalize(moment(props.date).calendar(state.now, FORMATS)) }
      </strong> | <a href=${ props.href } onclick=${ onclick }>${ lang.WEB_REGISTRATIONS }</a>
      <div class="List-actions">
        <button class="List-action List-action--dismiss" onclick=${ dismiss(props.id, send) } title=${ lang.DISMISS }>✕</button>
      </div>
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
