var na = require('../../datasets/NA.json');
var eune = require('../../datasets/EUNE.json');
var async = require('async');
var credentials = require('../../credentials.js');
var matchSchematizer = require('./matchSchematizer.js');
var Match = require('../../models/match.js');


module.exports = {
	loadDataSet: function(region) {
		var toProcess;
		var riot;
		switch(region) {
			case "na":
				toProcess = na;
				riot = require('./riot.js')({
					type: "match",
					key: credentials.riot.key,
					region: 'na'
				});
				break;
			case "eune":
				toProcess = eune;
				break;
		}
		async.eachSeries(na, function(match, cb) {
			Match.findOne({ matchId: match }, function(err, match) {			
				if(match) {
					console.log("match: " + match + " already exists");
					cb();
				}
				else {
					console.log("adding match: " + match + " to the database...");
					setTimeout(riot.get(match, function(data){
						matchSchematizer.schematize(data, cb);
						}), 1500);
				}
			});
		});	
	}
};