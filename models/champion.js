var mongoose = require('mongoose');

var championSchema = mongoose.Schema({
	championId: Number,
	name: String,
	imgURL: String,
	regionalStats: [{
		regionName: String,
		matches: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Match'
		}],
		picks: Number,
		wins: Number,
		lanes: [{
			laneName: String,
			_id: { type: mongoose.Schema.Types.ObjectId, select: false },
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		roles: [{
			roleName: String,
			_id: { type: mongoose.Schema.Types.ObjectId, select: false },
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		ranks: [{
			rankName: String,
			_id: { type: mongoose.Schema.Types.ObjectId, select: false },
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		summs: [{
			summId: Number,
			_id: { type: mongoose.Schema.Types.ObjectId, select: false },
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		runes: [{
			runeId: Number,
			_id: { type: mongoose.Schema.Types.ObjectId, select: false },
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		masteries: [{
			masteryId: Number,
			_id: { type: mongoose.Schema.Types.ObjectId, select: false },
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		items: [{
			itemId: Number,
			_id: { type: mongoose.Schema.Types.ObjectId, select: false },
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		brawlers: [{
			brawlerId: Number,
			_id: { type: mongoose.Schema.Types.ObjectId, select: false },
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		brawlerUpgrades: [{
			brawlerUpgradeId: Number,
			_id: { type: mongoose.Schema.Types.ObjectId, select: false },
			matches: [{
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
			firstBloodKill: Number,
			firstBloodAssist: Number,
			firstTowerKill: Number,
			firstTowerAssist: Number,
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