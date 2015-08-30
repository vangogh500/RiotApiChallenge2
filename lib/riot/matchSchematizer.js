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
				var newMatch;
				var teamArr;
				var participantArr;
				async.series([
					// initialize objects
					function(cb) {
						// construct base template for match
						newMatch = Formatter.createMatchTemplate(match);
						// construct base template for teams
						teamArr = Formatter.createTeamsTemplate(match);
						// construct base teamplate for participants
						participantArr = Formatter.createParticipantsTemplate(match);
						cb();
					},
					// save objects to db
					function(cb) {
						// save participant pointers and push onto teams participants attr
						async.eachSeries(participantArr, function(participant, loopCb) {
							participant.save(function(err) {
								if (err) return console.error(err);
								teamArr.forEach(function(team){ 
									if(team.teamId === participant.teamId){ team.participants.push(participant._id) }
								});
								loopCb();
							});
						}, function() {
							console.log("\t added participants");
							cb();
						});
					},
					function(cb) {
						// save each team to the database and add team _id to match
						async.eachSeries(teamArr, function(team, loopCb){
							team.save(function(err) {
								if (err) return console.error(err);
								newMatch.teams.push(team._id);
								loopCb();
							});
						}, function() {
							console.log("\t added teams");
							cb();
						});
					},
					function(cb) {
						// save match object to db
						newMatch.save(function(err) {
							if (err) return console.error(err);
							console.log("\t added match");
							cb();
						});	
					},
					//update champs and items
					function(cb) {
						Formatter.updateChampions(participantArr, newMatch, cb);
					},
					function(cb) {
						Formatter.updateItems(participantArr, newMatch, cb);
					}
				]);
			}
		});	
};