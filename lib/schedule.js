const html = require('yo-yo');
const { fromString } = require('./dom');
const lang = require('./lang');

exports.create = function (send) {
  return function (state, prev) {
    return html`
      <ul class="list-group">
        ${ state.schema.map(event => html`
          <li class="list-group-item">
            <time>${ event.time }</time>
            <a href=${ event.href }>${ event.title }</a>
          </li>
        `)}
      </ul>
    `;
  };
};

exports.parse = function (source) {
  const markup = fromString(source);
  const days = Array.prototype.slice.call(markup.children, 0, 2);
  const result = [];

  for (let day of days) {
    const events = day.querySelectorAll('.upcoming-events li');

    Array.prototype.forEach.call(events, event => {
      const location = event.querySelector('.location a');
      const type = event.querySelector('.type_name').innerText.trim().toLowerCase();

      result.push({
        isModified: !!event.querySelector('a.recently_modified'),
        type: type,
        details: getDetails(type, event.querySelector('.context')),
        time: event.querySelector('.time').innerText.trim(),
        href: event.querySelector('.contentlink').href,
        title: event.querySelector('.title').innerText.trim(),
        location: location && {
          name: location.innerText.trim(),
          href: location.href
        }
      });
    });
  }

  return result;
};

function getDetails(type, context) {
  switch (type) {
    case 'course': return {
      href: context.href,
      title: context.innerText.trim()
    };
    default: return null;
  }
}
