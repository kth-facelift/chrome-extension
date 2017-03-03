const html = require('yo-yo');
const moment = require('moment');

let isTicking = false;

module.exports = function render(state, send) {
  const dates = state.schedule.concat([ state.events ]).sort((a, b) => {
    return new Date(a.starttime) > new Date(b.starttime) ? 1 : -1;
  });
  const index = dates.findIndex(date => {
    return new Date(date.starttime) >= new Date(state.now);
  });

  if (!dates.length || index === -1) {
    return null;
  }

  return html`
    <div class="Timetravel">
      <input type="range" class="Timetravel-slider" value=${ index } min=${ 0 } max=${ dates.length - 1 } step=${ 1 } oninput=${ oninput } />
      <span class="Timetravel-text">${ moment(dates[index].starttime).format('DD/MM/YYYY') }</span>
    </div>
  `;

  function oninput(event) {
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(() => {
        isTicking = false;
        send('timetravel', new Date(dates[+event.target.value].starttime));
      });
    }
  }
};
