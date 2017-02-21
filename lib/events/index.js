const html = require('yo-yo');
const lang = require('../lang');

module.exports = function (props) {
  return html`
    <article>
      <h4>${ props.title }</h4>
      ${ context(props) }
    </article>
  `;
};

function context(props) {
  const parts = [];

  if (props.type) {
    parts.push(props.type);
  }

  if (props.subject) {
    parts.push(props.subject);
  }

  if (props.respondent) {
    parts.push(`${ lang.RESPONDENT }: ${ props.respondent }`);
  }

  return parts.reduce((list, item, index) => {
    return list.concat([ index > 0 ? ' | ' : '', item ]);
  }, []);
}
