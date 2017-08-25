var moment = require('moment');

// var date = new Date();
// var months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu']
//
// console.log(date.getMonth());
moment.locale('it');
var date = moment();
console.log(date.valueOf());
console.log(date.format('DD/MM/YYYY HH:mm:ss'));


var createdAt = 10000;
var date = moment(createdAt);
console.log(date.format('DD/MM/YYYY HH:mm:ss'));
