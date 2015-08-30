var Match = require('../../models/match.js');
var matchSchematizer = require('./matchSchematizer.js');

module.exports = {
	// creates a base template for a match object and saves it to the database
	createMatchTemplate: function(match) {
		var newMatch = new Match({
				matchId: match.matchId,
				region: match.region,
				teams: [],
				matchDuration: match.matchDuration,
				matchCreation: match.matchCreation
			});
		newMatch.save(function(err) {
			if (err) return console.error(err);
		});
		return newMatch;
	}
};