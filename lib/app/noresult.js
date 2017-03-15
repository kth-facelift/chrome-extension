const html = require('yo-yo');
const lang = require('../lang');
const modal = require('../modal');
const todo = require('../todos/edit');
const { capitalize } = require('../utils');
const tracker = require('../tracker');

module.exports = function noresult(state, prev, send) {
  return html`
    <p class="App-message">
      ${ lang.CANT_FIND_IT } ${ lang.WHY_NOT } <button class="Button Button--link" onclick=${ onclick }>${ lang.ADD_TO_LIST }?</button>
    </p>
  `;

  function onclick(event) {
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
      modal.close();
    }
  }

  function onsave(props) {
    send('todo:add', props);
    modal.close();
  }
};
