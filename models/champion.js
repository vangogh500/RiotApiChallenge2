var mongoose = require('mongoose');

var schema = new Schema({ _id: false });

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
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		roles: [{
			roleName: String,
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		ranks: [{
			rankName: String,
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		summs: [{
			summID: Number,
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		runes: [{
			runeID: Number,
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		masteries: [{
			masteryID: Number,
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		items: [{
			itemID: Number,
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		brawlers: [{
			brawlerID: Number,
			matches: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Match' 
			}]
		}],
		brawlerUpgrades: [{
			brawlerUpgradeID: Number,
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
}, { _id: false });
championSchema.methods.getWinRate = function(){
	return (this.wins / this.picks);
};
var Champion = mongoose.model('Champion', championSchema);
module.exports = Champion;