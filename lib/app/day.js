const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const { first, onlyif } = require('../utils');

const SAME_LIMIT = 1;
const FORMATS = {
  sameDay: `[${ lang.SAME_DAY }]`,
  nextDay: `[${ lang.NEXT_DAY }]`,
  nextWeek: 'dddd',
  lastDay: `[${ lang.ONGOING }]`,
  lastWeek: `[${ lang.ONGOING }]`,
  sameElse: () => {
    switch (lang.current) {
      case 'sv': return 'dddd D MMMM';
      case 'en':
      default: return 'dddd, MMMM Do';
    }
  }
};

module.exports = function (day, items, state, send) {
  let type;
  const groups = [];

  /**
   * Group consecutive events with of the same type
   */

  for (let item of items) {
    if (item.type === type) {
      groups[groups.length - 1].push(item);
    } else {
      groups.push([ item ]);
    }

    type = item.type;
  }

  return html`
    <li>
      <h3><time>${ moment(day).calendar(state.now, FORMATS) }</time></h3>
      <ol>
        ${ groups.map(group => {
          // Groups that are under the limit are all visible
          if (group.length <= SAME_LIMIT) {
            return group.map(props => html`
              <li>
                ${ props.render(props) }
              </li>
            `);
          }

          // Concatinate ids to create a unique gorup id
          const id = group.reduce((str, item) => str + item.id, '');

          // Check whether this group as already been expanded
          const isExpanded = state.expanded.includes(id);

          let text;
          if (isExpanded) {
            text = lang.SHOW_LESS;
          } else {
            text = lang.n('SHOW_N_MORE', group.length - SAME_LIMIT);
          }

          // Render group items and apply an expand button to the last one
          return group
            .filter(first(isExpanded ? group.length : SAME_LIMIT))
            .map((props, index, list) => {
              return html`
                <li>
                  ${ props.render(props) }
                  ${ onlyif(index === list.length - 1, html`
                    <button onclick=${ onclick(send, id, !isExpanded) }>${ text }</button>
                  `) }
                </li>
              `;
            });
        }) }
      </ol>
    </li>
  `;
};

function onclick(send, id, expand) {
  return () => send('expand:toggle', { id, expand });
}
