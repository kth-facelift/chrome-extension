const html = require('yo-yo');
const lang = require('../lang');
const notifications = require('../notifications');
const { first, onlyif } = require('../utils');

const SAME_LIMIT = 1;

module.exports = function unread(all, showAll, state, send) {
  // Action dispatcher that toggles notification visibility
  const onclick = () => send('expand:toggle', {
    id: 'notifications',
    expand: !showAll
  });

  return all
    .filter(first(showAll ? all.length : SAME_LIMIT))
    .map((props, index, list) => {
      const rest = all.length - SAME_LIMIT;
      const classList = ['List-item', 'List-item--expandable'];
      const text = showAll ? lang.SHOW_LESS : lang.n('SHOW_N_MORE', rest);

      if (showAll) {
        classList.push('is-expanded');
      }

      return html`
        <li class=${ classList.join(' ') }>
          ${ notifications(props, state.now, send) }
          ${ onlyif(index === list.length - 1 && all.length > SAME_LIMIT, html`
            <button class="List-expand" onclick=${ onclick }>${ text }</button>
          `) }
        </li>
      `;
    });
};
