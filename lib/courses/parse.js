const { dom } = require('../utils');
const lang = require('../lang');

const STATES = {
  [lang.ADMITTED]: /admitted\.\w+$/,
  [lang.REGISTERED]: /ffg\.\w+$/,
  [lang.PARTEXAM]: /partexam\.\w+$/,
  [lang.FINISHED]: /exam\.\w+$/
};

module.exports = function parse(source) {
  const root = dom(source);
  const items = root.querySelectorAll('li.course');

  return Array.prototype.map.call(items, item => {
    const link = item.querySelector('a.course');
    const img = link.querySelector('img');
    const name = link.innerText.trim();
    const props = {
      id: name.match(/\((\w+)\)/)[1],
      name: name,
      href: link.href,
      type: item.classList.contains('is_student') ? 'student' : 'teacher'
    };

    if (img) {
      for (let key of Object.keys(STATES)) {
        if (STATES[key].test(img.src)) {
          props.status = key;
          break;
        }
      }
    } else {
      props.status = lang.UNKNOWN;
    }

    if (link.classList.contains('studok_current')) {
      props.phase = 'current';
    } else if (link.classList.contains('studok_finished')) {
      props.phase = 'finished';
    } else {
      props.phase = 'other';
    }

    return props;
  });
};
