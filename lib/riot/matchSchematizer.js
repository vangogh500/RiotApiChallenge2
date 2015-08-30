var Formatter = require('./formatter.js');
var Match = require('../../models/match.js');
var async = require('async');

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
				// construct base template for teams
				var teamArr = Formatter.createTeamsTemplate(match);
				// construct base teamplate for participants
				var participantArr = Formatter.createParticipantsTemplate(match);
				
				// save participant pointers and push onto teams participants attr
				participantArr.forEach(function(participant) {
					participant.save(function(err) {
						if (err) return console.error(err);
					});
					teamArr.forEach(function(team) {
						if(team.teamId === participant.teamId){ team.participants.push(participant._id) }
					});
				});
				
				Formatter.updateChampions(participantArr, newMatch);
				Formatter.updateItems(participantArr, newMatch);
		
				// save each team to the database and add team _id to match
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