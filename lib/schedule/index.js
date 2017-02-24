const html = require('yo-yo');
const moment = require('moment');

module.exports = function (props) {
  const { location } = props;
  const starttime = moment(props.starttime);

  return html`
    <article class="List-content List-content--schedule">
      <h4 class="List-title">${ props.type }</h4>
      <a href=${ props.course.href }>${ props.course.name }</a>
      <br />
      <strong>
        <time datetime=${ starttime.format('YYYY-MM-DD[T]HH:mm') }>
          ${ starttime.format('HH:mm') }-${ moment(props.endtime).format('HH:mm') }
        </time>
      </strong>
      <a href=${ props.href }>${ props.title }</a>
      ${ location ? html`<a href=${ location.href }>${ location.name }<a>` : null }
    </article>
  `;
};
