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
  const student = { current: [], finished: [], other: [] };
  const teacher = { current: [], finished: [], other: [] };

  for (let item of root.querySelectorAll('li.course')) {
    const link = item.querySelector('a.course');
    const type = item.classList.contains('is_student') ? student : teacher;
    const img = link.querySelector('img');
    const props = {
      name: link.innerText.trim(),
      href: link.href
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
      type.current.push(props);
    } else if (link.classList.contains('studok_finished')) {
      type.finished.push(props);
    } else {
      type.other.push(props);
    }
  }

  return { student, teacher };
};
