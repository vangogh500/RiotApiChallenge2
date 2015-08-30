var mongoose = require('mongoose');
var Schema = mongoose.Schema

var participantSchema = mongoose.Schema({
	participantId: Number,
	teamId: Number,
	championId: Number,
	lane: String,
	role: String,
	highestAchievedSeasonTier: String,
	winner: Boolean,
	summs: [Number],
	runes: [Number],
	masteries: [Number],
	items: [Number],
	brawlerId: Number,
	brawlerUpgrades: [Number],
	inGameStats: {
		creepScore: Number,
		wardsPlaced: Number,
		wardsKilled: Number,
		kills: Number,
		pentaKills: Number,
		quadraKills: Number,
		tripleKills: Number,
		doubleKills: Number,
		largestMultiKill: Number,
		largestKillingSpree: Number,
		deaths: Number,
		assists: Number,
		gold: Number,
		largestCrit: Number,
		totalDmgDealtToChamps: Number,
		magicDmgDealtToChamps: Number,
		physicalDmgDealtToChamps: Number,
		trueDmgDealtToChamps: Number,
		magicDmgTaken: Number,
		physicalDmgTaken: Number,
		trueDmgTaken: Number,
		totalDmgTaken: Number,
		ccDurationDealt: Number,
		totalHeal: Number,
		neutralMinionsKilledEnemyJg: Number,
		neutralMinionsKilledTeamJg: Number,
		firstBloodKill: Boolean,
		firstBloodAssist: Boolean,
		firstTowerKill: Boolean,
		firstTowerAssist: Boolean,
		towerKills: Number,
		csPerMin: {
			zeroToTen: Number,
			thirtyToEnd: Number,
			tenToTwenty: Number,
			twentyToThirty: Number
		},
		csDiffPerMin: {
			zeroToTen: Number,
			thirtyToEnd: Number,
			tenToTwenty: Number,
			twentyToThirty: Number
		},
		goldPerMin: {
			zeroToTen: Number,
			thirtyToEnd: Number,
			tenToTwenty: Number,
			twentyToThirty: Number
		}
	}
	
});

var Participant = mongoose.model('Participant', participantSchema);
module.exports = Participant;