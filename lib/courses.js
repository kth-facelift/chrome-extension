const html = require('yo-yo');
const { fromString } = require('./dom');
const lang = require('./lang');

const STATES = {
  admitted: {
    reg: /admitted\.\w+$/,
    name: () => lang.ADMITTED
  },
  registered: {
    reg: /ffg\.\w+$/,
    name: () => lang.REGISTERED
  },
  part: {
    reg: /partexam\.\w+$/,
    name: () => lang.PART
  },
  finished: {
    reg: /exam\.\w+$/,
    name: () => lang.FINISHED
  },
};

exports.create = function create(send) {
  return function render(state, prev) {
    const { student, teacher } = state.courses;
    const sections = [];

    if (!isEmpty(student)) {
      sections.push(section(lang.COURSES_I_STUDY, student));
    }

    if (!isEmpty(teacher)) {
      sections.push(section(lang.COURSES_I_TEACH, teacher));
    }

    function section(title, courses) {
      return html`
        <section>
          <h2>${ title }</h2>

          ${ Object.keys(courses).filter(key => courses[key].length).map(type => html`
            <div>
              <h4>${ getTypeName(type) }</h4>
              <ul>
                ${ courses[type].map(course => html`
                  <li>
                    <em>${ STATES[course.status].name() }</em>: <a href="${ course.href }">${ course.name }</a>
                  </li>
                `) }
              </ul>
            </div>
          `) }
        </section>
      `;
    }

    return html`
      <section>
        <h2>${ lang.MY_COURSES }</h2>
        ${ sections.length ? sections : lang.NO_COURSES_FOUND }
      </section>
    `;
  };
};

exports.parse = function parse(source) {
  const root = fromString(source);
  const student = { current: [], finished: [], other: [] };
  const teacher = { current: [], finished: [], other: [] };

  for (let item of root.querySelectorAll('li.course')) {
    const link = item.querySelector('a.course');
    const type = item.classList.contains('is_student') ? student : teacher;
    const img = link.querySelector('img');
    const props = {
      name: link.innerText.trim(),
      href: link.href,
      status: Object.keys(STATES).find(key => STATES[key].reg.test(img.src))
    };

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

function isEmpty(obj) {
  return !Object.keys(obj).map(key => obj[key].length).filter(Boolean).length;
}

function getTypeName(type) {
  switch (type) {
    case 'current': return lang.CURRENT;
    case 'finished': return lang.FINISHED;
    default: return lang.OTHER;
  }
}
