const html = require('yo-yo');
const lang = require('../lang');
const modal = require('../modal');
const todo = require('../todos/edit');
const tracker = require('../tracker');
const { plus } = require('../icons');
const { onlyif, capitalize } = require('../utils');

module.exports = function (state, prev, send) {
  return html`
    <form novalidate autocapitalize="off" autocomplete="off" class="Search" onsubmit=${ onsubmit }>
      <input type="text" class="Search-input" value=${ state.search.toString() } placeholder=${ lang.SEARCH_OR_ADD } oninput=${ oninput } />
      ${ onlyif(state.search, html`
        <button class="Search-add">
          ${ plus(10) } ${ lang.ADD_TODO }
        </button>
      `) }
    </form>
  `;

  function onsubmit(event) {
    const content = todo({
      title: capitalize(state.search),
      date: state.now
    }, { onsave, onchange, oncancel });

    modal.render(content, oncancel);

    // Empty search field
    event.target.children[0].value = '';

    // Track user creating a todo
    tracker.event('Todos', 'Create', `Title: ${ state.search }`);

    event.preventDefault();

    function onchange(event) {
      tracker.event('Todos', 'Configure', `${ event.target.name }: ${ event.target.value }`);
    }

    function oncancel() {
      tracker.event('Todos', 'Create', 'Cancel');
      send('search:find', '');
      modal.close();
    }
  }

  function onsave(props) {
    send('todo:add', props);
    modal.close();
  }

  function oninput(event) {
    send('search:find', event.target.value);
  }
};
