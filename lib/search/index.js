const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const modal = require('../modal');
const { onlyif, capitalize, id } = require('../utils');

module.exports = function (state, prev, send) {
  return html`
    <form novalidate autocapitalize="off" autocomplete="off" class="Search" onsubmit=${ onsubmit }>
      <input type="text" class="Search-input" value=${ state.search || '' } placeholder=${ lang.SEARCH_OR_ADD } oninput=${ oninput } />
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
          <input class="Form-input" type="date" required min=${ moment(state.now).format('YYYY-MM-DD') } name="date" />
        </label>

        <fieldset>
          <legend class="Form-label">${ lang.PRIORITY }</legend>
          <label class="Form-label">
            <input type="radio" value="0" name="priority" checked />
            ${ lang.NO_PRIORITY }
          </label>
          <label class="Form-label">
            <input type="radio" value="1" name="priority" />
            ${ lang.LOW_PRIORITY }
          </label>
          <label class="Form-label">
            <input type="radio" value="2" name="priority" />
            ${ lang.MEDIUM_PRIORITY }
          </label>
          <label class="Form-label">
            <input type="radio" value="3" name="priority" />
            ${ lang.HIGH_PRIORITY }
          </label>
        </fieldset>

        <button type="submit" class="Form-button">${ lang.ADD_TODO }</button>
        <button type="button" class="Form-button Form-button--cancel" onclick=${ () => modal.close() } formnovalidate>${ lang.CANCEL }</button>
      </form>
    `);

    event.preventDefault();
  }

  function onadd(event) {
    const data = new FormData(event.target);
    const props = {
      id: id(),
      state: 'pending',
      type: 'task',
      match: [ 'title', 'type' ]
    };

    for (var [key, value] of data.entries()) {
      switch (key) {
        case 'date':
          props.date = moment(props.date).endOf(props.date).toDate();
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
