const moment = require('moment');
const { id } = require('../utils');

module.exports = [{
  id: id(),
  title: 'Turn in report draft',
  state: 'pending',
  date: moment('2017-03-02T23:59').toDate(),
  priority: 1,
  href: null,
  type: 'assignment',
  course: 'DH2628',
  match: [ 'title', 'type', 'course' ]
}, {
  id: id(),
  title: 'Turn in final report',
  state: 'pending',
  date: moment('2017-03-16T23:59').toDate(),
  priority: 2,
  href: null,
  type: 'assignment',
  course: 'DH2628',
  match: [ 'title', 'type', 'course' ]
}, {
  id: id(),
  title: 'The next period is coming up! Be sure to register for courses.',
  state: 'pending',
  date: moment('2017-03-28').toDate(),
  priority: 3,
  href: 'https://www.kth.se/student/minasidor/registreringar/',
  type: 'registration',
  course: null,
  match: [ 'title', 'type' ]
}];
