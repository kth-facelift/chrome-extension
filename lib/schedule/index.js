const html = require('yo-yo');
const moment = require('moment');
const lang = require('../lang');
const { pin } = require('../icons');
const tracker = require('../tracker');
const { onlyif, dom } = require('../utils');

module.exports = function (props, state, send) {
  const { id, location } = props;
  const starttime = moment(props.starttime);
  const isExpanded = state.expanded.includes(id);
  const onclick = event => {
    if (!event.target.href) {
      send('list:toggle', { id, expand: !isExpanded });
    }
  };

  return html`
    <article class="List-content List-content--schedule">
      <h4 class="List-title">${ props.type || props.category }</h4>
      <a href=${ props.href } onclick=${ track('Title') }>${ props.title }</a>
      <br />
      <strong>
        <time datetime=${ starttime.format('YYYY-MM-DD[T]HH:mm') }>
          ${ starttime.format('HH:mm') }-${ moment(props.endtime).format('HH:mm') }
        </time>
      </strong>
      ${ onlyif(props.course, () => html`<a href=${ props.course.href } onclick=${ track('Course') }>${ props.course.name }</a>`)}
      ${ onlyif(props.group, () => html`<a href=${ props.group.href } onclick=${ track('Group') }>${ props.group.name }</a>`)}
      ${ props.teacher || null }
      ${ onlyif(location, pin(12)) }
      ${ onlyif(location, () => {
        if (location.href) {
          return html`<a href=${ location.href } onclick=${ track('Location') }>${ location.name }<a>`;
        }

        return location.name;
      }) }
      ${ onlyif(props.description, () => html`
        <div>
          ${ onlyif(isExpanded, () => dom(props.description)) }
          ${ onlyif(!isExpanded, html`<em class="List-meta">${ dom(props.description).innerText.substr(0, 50) }…</em>`) }
          <button class="List-toggle" onclick=${ onclick }>${ isExpanded ? lang.SHOW_LESS : lang.SHOW_MORE }</button>
        </div>
      `) }
    </article>
  `;

  function track(type) {
    return () => tracker.event('List', 'Link', `Schedule: ${ type }`);
  }
};
