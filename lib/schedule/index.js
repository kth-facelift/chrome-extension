const html = require('yo-yo');
const moment = require('moment');

module.exports = function (props) {
  const { location } = props;
  const starttime = moment(props.starttime);

  return html`
    <article>
      <h4>${ props.type }</h4>
      <a href=${ props.course.href }>${ props.course.name }</a>
      <br />
      <time datetime=${ starttime.format('YYYY-MM-DD[T]HH:mm') }>
        ${ starttime.format('HH:mm') }-${ moment(props.endtime).format('HH:mm') }
      </time>
      <a href=${ props.href }>${ props.title }</a>
      ${ location ? html`<a href=${ location.href }>${ location.name }<a>` : null }
    </article>
  `;
};
