var Formatter = require('./formatter.js');
var Match = require('../../models/match.js');
var async = require('async');

exports.schematize = function(match, callback) {
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
		//update champs
		function(cb) {
			Formatter.updateChampions(participantArr, newMatch, function() {
				console.log("\t added champions");
				cb();
			});
		},
		// update items
		function(cb) {
			Formatter.updateItems(participantArr, newMatch, function() {
				console.log("\t added items");
				cb();
			});
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
		}
	], callback);
};