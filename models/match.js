var mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
	id: Number,
	participants: [{
		champion: Number,
		lane: String,
		role: String,
		highestAchievedSeasonTier: String,
		winner: boolean,
		summs: [Number],
		runes: [Number],
		masteries: [Number],
		items: [Number],
		brawlerID: Number,
		brawlerUpgrades: [Number],
		kills: Number,
		deaths: Number,
		assists: Number,
		gold: Number,
		magicDmg: Number,
		attackDmg: Number,
		trueDmg: Number,
		dmgTaken: Number,
		teamBarrons: Number,
		teamDragons: Number,
		teamTowers: Number
	}],
	matchDuration: Number,
	matchCreation: Number
});

var Match = mongoose.model('Match', matchSchema);
module.exports = Match;