const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const modal = require('../modal');
const tracker = require('../tracker');
const { onlyif, capitalize, id } = require('../utils');

module.exports = function (state, prev, send) {
  return html`
    <form novalidate autocapitalize="off" autocomplete="off" class="Search" onsubmit=${ onsubmit }>
      <input type="text" class="Search-input" value=${ state.search.toString() } placeholder=${ lang.SEARCH_OR_ADD } oninput=${ oninput } />
      ${ onlyif(state.search, html`
        <button class="Search-add">${ lang.ADD_TODO }</button>
      `) }
    </form>
  `;

  function onsubmit(event) {
    modal.render(html`
      <form onsubmit=${ onadd } class="Form">

        <label class="Form-label">
          ${ lang.TITLE }
          <input class="Form-input" type="text" name="title" value=${ capitalize(state.search) } required />
        </label>

        <label class="Form-label">
          ${ lang.DUE_DATE }
          <input class="Form-input" type="date" onchange=${ onchange } required min=${ moment(state.now).format('YYYY-MM-DD') } name="date" />
        </label>

        <fieldset>
          <legend class="Form-legend">${ lang.PRIORITY }</legend>
          <div class="Form-optgroup">
            <label class="Form-label">
              <input class="Form-checkbox" type="radio" value="0" name="priority" checked onchange=${ onchange } />
              <span class="Form-option">${ lang.NO_PRIORITY }</span>
            </label>
            <label class="Form-label">
              <input class="Form-checkbox" type="radio" value="1" name="priority" onchange=${ onchange } />
              <span class="Form-option">${ lang.LOW_PRIORITY }</span>
            </label>
            <label class="Form-label">
              <input class="Form-checkbox" type="radio" value="2" name="priority" onchange=${ onchange } />
              <span class="Form-option">${ lang.MEDIUM_PRIORITY }</span>
            </label>
            <label class="Form-label">
              <input class="Form-checkbox" type="radio" value="3" name="priority" onchange=${ onchange } />
              <span class="Form-option">${ lang.HIGH_PRIORITY }</span>
            </label>
          </div>
        </fieldset>

        <button type="submit" class="Button">${ lang.ADD_TODO }</button>
        <button type="button" class="Button Button--secondary" onclick=${ onclose } formnovalidate>${ lang.CANCEL }</button>
      </form>
    `);

    // Empty search field
    event.target.children[0].value = '';

    // Track user creating a todo
    tracker.event('Todos', 'Create', `Title: ${ state.search }`);

    event.preventDefault();

    function onchange(event) {
      tracker.event('Todos', 'Configure', `${ event.target.name }: ${ event.target.value }`);
    }

    function onclose() {
      tracker.event('Todos', 'Create', 'Cancel');
      send('search:find', '');
      modal.close();
    }
  }

  function onadd(event) {
    const data = new FormData(event.target);
    const props = {
      id: id(),
      status: 'pending',
      type: 'task',
      match: [ 'title', 'type' ]
    };

    for (var [key, value] of data.entries()) {
      switch (key) {
        case 'date':
          props.date = moment(value).startOf('date').toDate();
          break;
        case 'priority':
          props.priority = +value;
          break;
        default:
          props[key] = value;
      }
    }

    send('todo:add', props);

    modal.close();

    event.preventDefault();
  }

  function oninput(event) {
    send('search:find', event.target.value);
  }
};
