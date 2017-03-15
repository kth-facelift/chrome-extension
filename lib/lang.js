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
    sv: 'Sök efter eller lägg till en ny uppgift'
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
    sv: 'Är det viktigt?'
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
  },
  CANT_FIND_IT: {
    en: 'Can\'t find what you are looking for?',
    sv: 'Kan du inte hitta vad du letar efter?'
  },
  WHY_NOT: {
    en: 'Why not',
    sv: 'Varför inte'
  },
  ADD_TO_LIST: {
    en: 'add it to the list',
    sv: 'lägga till det i listan'
  },
  EXAMINATION: {
    en: 'Exampination',
    sv: 'Examination'
  },
  LABORATION: {
    en: 'Lab',
    sv: 'Laboration'
  },
  LABORATORY: {
    en: 'Lab',
    sv: 'Laboration'
  },
  FÖRELÄSNING: {
    en: 'Lecture',
    sv: 'Föreläsning'
  },
  LECTURE: {
    en: 'Lecture',
    sv: 'Föreläsning'
  },
  SEMINAR: {
    en: 'Seminar',
    sv: 'Seminarie'
  },
  LESSON: {
    en: 'Lesson',
    sv: 'Lektion'
  },
  FIELD_EXERCISE: {
    en: 'Field exercise',
    sv: 'Fältövning'
  },
  PRESENTATION: {
    en: 'Presentation',
    sv: 'Presentation'
  },
  KONFERENSER_OCH_EVENEMANG: {
    en: 'Conference',
    sv: 'Konferens'
  },
  ÖVRIGT: {
    en: 'Other',
    sv: 'Övrigt'
  },
  DISPUTATIONER: {
    en: 'Disputation',
    sv: 'Disputation'
  },
  MASTER_THESIS_PRESENTATION: {
    en: 'Master thesis presentation',
    sv: 'Presentation av exjobb'
  },
  EXAMPINATION: {
    en: 'Examination',
    sv: 'Examination'
  },
  LICENTIATSEMINARIER: {
    en: 'PhD Seminar',
    sv: 'Licentiatseminarie'
  },
  DOCENTPRESENTATIONER: {
    en: 'Doctorate Seminar',
    sv: 'Docentseminarie'
  },
  MUSIK: {
    en: 'Music',
    sv: 'Musik'
  },
  FÖRELÄSNINGAR_OCH_SEMINARIER: {
    en: 'Lecure / Seminar',
    sv: 'Föreläsning / seminarie'
  },
  EDIT_TODO: {
    en: 'Edit todo',
    sv: 'Ändra uppgift'
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
