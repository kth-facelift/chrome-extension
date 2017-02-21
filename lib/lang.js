const assert = require('assert');
const { format } = require('util');
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
  },
  NOTIFICATION: {
    en: 'Notification',
    sv: 'Notifiering'
  },
  SAME_DAY: {
    en: 'Today',
    sv: 'Idag'
  },
  NEXT_DAY: {
    en: 'Tomorrow',
    sv: 'Imorgon'
  },
  LAST_DAY: {
    en: 'Yesterday',
    sv: 'Igår'
  },
  LAST_OTHER: {
    en: 'Last',
    sv: 'Förra'
  },
  ONGOING: {
    en: 'Right now',
    sv: 'Just nu'
  },
  IMPORTANT: {
    en: 'Important',
    sv: 'Viktigt'
  },
  IN: {
    en: 'in',
    sv: 'i'
  },
  TO: {
    en: 'to',
    sv: 'till'
  },
  AT_TIME: {
    en: 'at',
    sv: 'kl'
  },
  ON_DATE: {
    en: 'on',
    sv: 'den'
  },
  SHOW_N_NOTIFICATIONS: {
    en: 'Show %d more notifications',
    sv: 'Visa ytterligare %d notifieringar'
  },
  SHOW_LESS: {
    en: 'Show less',
    sv: 'Visa färre'
  },
  RESPONDENT: {
    en: 'Respondent',
    sv: 'Respondent'
  },
  DISMISS: {
    en: 'Dismiss',
    sv: 'Ta bort'
  }
}, {
  get(target, name) {
    switch (name) {
      case 'current': return lang;
      case 'n': return (key, ...args) => format(target[key][lang], ...args);
      default: {
        const prop = target[name];
        return prop ? prop[lang] || name : name;
      }
    }
  },
  set(target, prop, value) {
    assert.equal(prop, 'current', 'Only the key `current` can be set');
    lang = value.replace(/-\w+$/, '');
  }
});
