var Match = require('../../models/match.js');
var matchSchematizer = require('./matchSchematizer.js');
var Team = require('../../models/team.js');

module.exports = {
	// return a basic match object and saves it to the database
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
	},
	// return an array of basic team objects
	createTeamTemplate: function(match) {
		var teamArr = [];
		match.teams.forEach(function(team){
			var newTeam = new Team({
				teamId: team.teamId,
				winner: team.winner,
				participants: [],
				inGameStats: {
					firstDragon: team.firstDragon,
					firstBaron: team.firstBaron,
					barrons: team.baronKills,
					dragons: team.dragonKills,
					towerKills: team.towerKills
				},
				bans: []
			});
			team.bans.forEach(function(ban) {
				newTeam.bans.push(ban.championId);
			});
			teamArr.push(newTeam);
		});
		return teamArr;
	}
};