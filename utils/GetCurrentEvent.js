var _          = require('lodash');
var moment     = require('moment');
var startTimes = require('./StartTimes');

/*
	Helper function to get the current event.
	A 'current event' is defined as one that is either currently ongoing or being transitioned into.
	E.g. with a 15 minute event length and 5 minute transition time, an event that goes from 9:00 - 9:15 would be
	current from 8:55 - 9:10.

	@params student: The student info
*/
module.exports = function(student, eventLength, transitionLength) {

	// First check if there is a "current" google calendar event, and return it if so
	var currentEvent = _.find(student.calendar, function(event) {
		var start = moment( event.start ).subtract(transitionLength, 'ms');
		var end = moment( event.end ).subtract(transitionLength, 'ms' );
		return moment( moment().tz("America/Denver").format() ).isBetween( start, end );
	});

	if (currentEvent) {
		return currentEvent;
	}

	/*
		If looking at the grove calendar:
		(a) We return the most recently checked into event IF it was a correct check-in AND we are still within that event's window (it is "current").
		(b) In all other circumstances (we are transitioning out of the correctly scanned event, student hasn't scanned during this period, last scan was wrong), we always show the first event that has not yet been checked into, or null if all events have been checked into (up to the calling function to determine what to do if that is the case.)
	*/
	var currentEventWindowStart = moment( moment().tz("America/Denver").format() ).add( startTimes( eventLength, transitionLength ) - transitionLength );
	// var currentEventWindowEnd = moment( Date.now() ).add( startTimes( eventLength, transitionLength ) - transitionLength + eventLength );

	var scan = student.recentCorrectScan;

	if (scan && currentEventWindowStart.isBefore( Number(scan.time) ) ) {
		// Return the correctly scanned into event
		return scan.event[0];
	} else {
		// Return the first unchecked event in the student's grove calendar
		return _.find( student.groveCalendar, function(event) {
			return !event.checkedIn;
		});
	}
}
