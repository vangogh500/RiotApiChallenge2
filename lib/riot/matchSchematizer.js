var Formatter = require('./formatter.js');
var Match = require('../../models/match.js');

exports.schematize = function(match) {
		Match.find({ matchId: match.matchId }, function(err, matches) {
			// if match already exists in db
			if(matches.length) {
				console.log("match: " + match.matchId + " already exists");
			}
			// otherwise make new match object and add it to the database
			else {
				console.log("adding match: " + match.matchId + " to the database...");
				// construct base template for match
				var newMatch = Formatter.createMatchTemplate(match);
		
				// construct base template for teams and store pointers
				var teamArr = Formatter.createTeamTemplate(match);
	
				// create participant for each participant, save to database, and then push pointers into participants array in respective teams
				var participantArr = Formatter.saveParticipants(match, teamArr);
					
				Formatter.updateChampions(match, participantArr, newMatch);
				
				participantArr.forEach(function(participant) {
					teamArr.forEach(function(team) {
						if(team.teamId === participant.teamId){ team.participants.push(participant._id) }
					});
				});
		
				// save each team to the database and add db id to match
				teamArr.forEach(function(team){
					team.save(function(err) {
						if (err) return console.error(err);
					});
					newMatch.teams.push(team._id);
				});
		
				// finally save match to the db
				newMatch.save(function(err) {
					if (err) return console.error(err);
				});	
			}
		});	
};