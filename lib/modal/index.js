const html = require('yo-yo');
const lang = require('../lang');

let modal;

window.addEventListener('keydown', event => {
  if (event.code === 'Escape') {
    close();
  }
});

exports.render = render;
exports.close = close;

function render(content, onclose) {
  const markup = html`
    <div class="Modal">
      <div class="Modal-window">
        ${ content }
        <button class="Modal-dismiss" onclick=${ onclose || close } title=${ lang.DISMISS }>✕</button>
      </div>
    </div>
  `;

  if (modal) {
    html.update(modal, markup);
  } else {
    modal = markup;
  }

  if (!modal.parentElement) {
    document.body.appendChild(modal);
  }
}

function close() {
  if (!modal) { return; }

  modal.addEventListener('transitionend', function ontransitionend() {
    modal.removeEventListener('transitionend', ontransitionend);
    modal.classList.remove('is-disappearing');
    modal.parentElement.removeChild(modal);
  });
  modal.classList.add('is-disappearing');
}
