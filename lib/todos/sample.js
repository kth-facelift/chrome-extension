const moment = require('moment');

module.exports = [{
  id: 'registration_spring_2017',
  title: 'The next period is coming up! Be sure to register for courses.',
  status: 'pending',
  date: moment('2017-03-23').toDate(),
  priority: 3,
  href: 'https://www.kth.se/student/minasidor/registreringar/',
  type: 'registration',
  course: null,
  match: [ 'title', 'type' ]
}];
