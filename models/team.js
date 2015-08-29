var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
	teamId: Number,
	winner: Boolean,
	participants: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Participant'
	}],
	inGameStats: {
		firstDragon: Boolean,
		firstBaron: Boolean,
		barrons: Number,
		dragons: Number,
		towerKills: Number
	},
	bans: [Number]
});

var Team = mongoose.model('Team', teamSchema);
module.exports = Team;