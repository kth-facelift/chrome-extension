const moment = require('moment');
const { id } = require('../utils');

module.exports = [{
  id: id(),
  title: 'The next period is coming up! Be sure to register for courses.',
  status: 'pending',
  date: moment('2017-03-28').toDate(),
  priority: 3,
  href: 'https://www.kth.se/student/minasidor/registreringar/',
  type: 'registration',
  course: null,
  match: [ 'title', 'type' ]
}];
