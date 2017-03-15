const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const { id } = require('../utils');

module.exports = function edit(todo, options) {
  const { onsave, onchange, oncancel, heading } = options;

  return html`
    <form onsubmit=${ onsubmit } class="Form">
      <h2 class="Form-title">${ heading }</h2>

      <label class="Form-label">
        ${ lang.TITLE }
        <input class="Form-input" type="text" name="title" value=${ todo.title } required />
      </label>

      <label class="Form-label">
        ${ lang.DUE_DATE }
        <input class="Form-input" type="date" onchange=${ onchange || null } required value=${ moment(todo.date).format('YYYY-MM-DD') } name="date" />
      </label>

      <fieldset>
        <legend class="Form-legend">${ lang.PRIORITY }</legend>
        <div class="Form-optgroup">
          <label class="Form-label">
            <input class="Form-checkbox" type="radio" value="0" name="priority" checked=${ !todo.priority } onchange=${ onchange || null } />
            <span class="Form-option">${ lang.NO_PRIORITY }</span>
          </label>
          <label class="Form-label">
            <input class="Form-checkbox" type="radio" value="1" name="priority" checked=${ todo.priority === 1 } onchange=${ onchange || null } />
            <span class="Form-option">${ lang.LOW_PRIORITY }</span>
          </label>
          <label class="Form-label">
            <input class="Form-checkbox" type="radio" value="2" name="priority" checked=${ todo.priority === 2 } onchange=${ onchange || null } />
            <span class="Form-option">${ lang.MEDIUM_PRIORITY }</span>
          </label>
          <label class="Form-label">
            <input class="Form-checkbox" type="radio" value="3" name="priority" checked=${ todo.priority === 3 } onchange=${ onchange || null } />
            <span class="Form-option">${ lang.HIGH_PRIORITY }</span>
          </label>
        </div>
      </fieldset>

      <button type="submit" class="Button">${ lang.SAVE }</button>
      <button type="button" class="Button Button--secondary" onclick=${ oncancel || null } formnovalidate>${ lang.CANCEL }</button>
    </form>
  `;

  function onsubmit(event) {
    const data = new FormData(event.target);
    const props = {
      id: todo.id || id(),
      status: todo.status || 'pending',
      type: 'task',
      match: todo.match || [ 'title', 'type' ]
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

    if (onsave) {
      onsave(props);
    }

    event.preventDefault();
  }
};
