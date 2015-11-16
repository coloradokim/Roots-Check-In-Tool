var _      = require('lodash');
var moment = require('moment');

/* Split the hour based on EVENT_LENGTH and TRANSITION_LENGTH
e.g. if events go for 15 with 5 min transition, 8:55 - 9:10 would
be the period during which we would show a student that an event
is starting at 9:00.
Take in event and transition length as parameters so this method can be used in a uniform way on both client and server. */
module.exports = function(eventLength, transitionLength) {
	var currentTime = moment( Date.now() );
	var intervals = 60 / (eventLength / (60 * 1000)) + 1;
	var start_times = [];
	for (var i =0; i < intervals; i++) {
		// Remember to use new moment object here for each iteration so as not to override currentTime
		start_times.push( moment( Date.now() ).startOf('hour').add(i * eventLength - transitionLength, 'ms'));
	}

	// We return the difference between the start time and current time. If it is negative, we are in an event span. If it is positive, we are in a transition period.
	var event_start = _.find(start_times, function(t) {
		return currentTime.isBetween( t, moment(t).add( eventLength, 'ms' ) );
	}).add(transitionLength, 'ms');

	return event_start.diff(currentTime);
}
