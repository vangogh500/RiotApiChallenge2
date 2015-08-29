var mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
	matchId: Number,
	region: String,
	teams: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Team'
	}],
	matchDuration: Number,
	matchCreation: Number
});

var Match = mongoose.model('Match', matchSchema);
module.exports = Match;