const attr = document.documentElement.getAttribute('lang');
const query = location.search.match(/[?|&]l=(\w+)/);

let lang = attr || (query && query[1]) || 'en';

module.exports = new Proxy({
  ADMITTED: {
    en: 'Admitted',
    sv: 'Antagen'
  },
  REGISTERED: {
    en: 'Registered',
    sv: 'Registrerad'
  },
  PARTEXAM: {
    en: 'Part way finished',
    sv: 'Delvis avklarad'
  },
  FINISHED: {
    en: 'Finished',
    sv: 'Avklarad'
  },
  UNKNOWN: {
    en: 'Unknown',
    sv: 'Ej känt'
  },
  SCHEDULE: {
    en: 'Schedule',
    sv: 'Schema'
  },
  KTHEVENTS: {
    en: 'Events at KTH',
    sv: 'Händelser på KTH'
  },
  COURSES: {
    en: 'Courses',
    sv: 'Kurser'
  },
  NOTIFICATIONS: {
    en: 'Notifications',
    sv: 'Notifieringar'
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
