const html = require('yo-yo');

let isTicking = false;

module.exports = function render(state, send) {
  const dates = state.schedule.concat([ state.events ]).sort((a, b) => {
    return new Date(a.starttime) > new Date(b.starttime) ? 1 : -1;
  });
  const index = dates.findIndex(date => {
    return new Date(date.starttime) >= new Date(state.now);
  });

  return html`
    <div class="Timetravel">
      <input type="range" class="Timetravel-slider" value=${ index } min=${ 0 } max=${ dates.length - 1 } step=${ 1 } oninput=${ oninput } />
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
