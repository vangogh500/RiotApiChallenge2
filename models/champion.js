var mongoose = require('mongoose');

var championSchema = mongoose.Schema({
	championId: Number,
	name: String,
	imgURL: String,
	matches: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Match'
	}],
	regionalStats: [{
		regionName: String,
		picks: Number,
		wins: Number,
		lanes: [{
			lane: String,
			match: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		roles: [{
			role: String,
			match: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		ranks: [{
			rank: String,
			match: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		summs: [{
			summID: Number,
			match: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		runes: [{
			runeID: Number,
			match: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		masteries: [{
			masteryID: Number,
			match: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		items: [{
			itemID: Number,
			match: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		brawlers: [{
			brawlerID: Number,
			match: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		brawlerUpgrades: [{
			brawlerID: Number,
			match: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		inGameAvgs: {
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
	}]
});
championSchema.methods.getWinRate = function(){
	return (this.wins / this.picks);
};
var Champion = mongoose.model('Champion', championSchema);
module.exports = Champion;