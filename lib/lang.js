const assert = require('assert');
const { format } = require('util');
const attr = document.documentElement.getAttribute('lang');
const query = location.search.match(/[?|&]l=(\w+)/);
const moment = require('moment');

let lang = attr || (query && query[1]) || 'en';

// Add Swedish localistion to moment
require('moment/locale/sv');

// Set locale to initial language
moment.locale([ lang, 'en' ]);

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
  SHOW_MORE: {
    en: 'Show more',
    sv: 'Visa mer'
  },
  SHOW_N_MORE: {
    en: 'Show %d more',
    sv: 'Visa %d till'
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
  },
  TODO: {
    en: 'Todo',
    sv: 'Att göra'
  },
  ASSIGNMENT: {
    en: 'Assignment',
    sv: 'Uppgift'
  },
  REGISTRATION: {
    en: 'Registration',
    sv: 'Registrering'
  },
  WEB_REGISTRATIONS: {
    en: 'Online registrations',
    sv: 'Webbregistreringar'
  },
  REGISTRATIONS_UPCOMING: {
    en: 'The next period is coming up. It\'s time to register for courses',
    sv: 'Nästa period börjar snart. Det är dags att registrera dig för kurser'
  },
  UPCOMING: {
    en: 'Coming up',
    sv: 'Kommer snart'
  },
  SHOWING: {
    en: 'Showing',
    sv: 'Visar'
  },
  SEARCH_OR_ADD: {
    en: 'Find something or add a new todo',
    sv: 'Hitta något eller lägg till en uppgift'
  },
  ADD_TODO: {
    en: 'Add todo',
    sv: 'Lägg till'
  },
  TITLE: {
    en: 'Title',
    sv: 'Titel'
  },
  DUE_DATE: {
    en: 'Due date',
    sv: 'Datum'
  },
  PRIORITY: {
    en: 'Is this task important?',
    ev: 'Är det viktigt?'
  },
  NO_PRIORITY: {
    en: 'Not really',
    sv: 'Inte särskillt'
  },
  LOW_PRIORITY: {
    en: 'Kind of',
    sv: 'Lite'
  },
  MEDIUM_PRIORITY: {
    en: 'Yes, it is',
    sv: 'Jo, det är det'
  },
  HIGH_PRIORITY: {
    en: 'Super!',
    sv: 'Verkligen!'
  },
  CANCEL: {
    en: 'Cancel',
    sv: 'Avbryt'
  },
  RESET: {
    en: 'Reset',
    sv: 'Nollställ'
  },
  SAVE: {
    en: 'Save',
    sv: 'Spara'
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
    moment.locale([ lang, 'en' ]);
  }
});
