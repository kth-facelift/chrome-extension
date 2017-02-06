const attr = document.documentElement.getAttribute('lang');
const query = location.search.match(/[?|&]l=(\w+)/);

let lang = attr || (query && query[1]) || 'en';

module.exports = new Proxy({
  COURSES_I_STUDY: {
    en: 'Courses that I study'
  },
  COURSES_I_TEACH: {
    en: 'COurses that I teach'
  }
}, {
  get(target, name) {
    const prop = target[name];
    return prop ? prop[lang] || name : name;
  },
  set(target, prop, value) {
    lang = value.replace(/-\w+$/, '');
  }
});
