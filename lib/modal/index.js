const html = require('yo-yo');

let modal;

exports.render = function (content) {
  const markup = html`
    <div class="Modal">
      <div class="Modal-window">
        ${ content }
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
};

exports.close = function () {
  if (!modal) { return; }

  modal.addEventListener('transitionend', function ontransitionend() {
    modal.removeEventListener('transitionend', ontransitionend);
    modal.classList.remove('is-disappearing');
    modal.parentElement.removeChild(modal);
  });
  modal.classList.add('is-disappearing');
};
