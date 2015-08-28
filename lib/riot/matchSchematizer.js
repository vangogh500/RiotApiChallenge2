var Match = require('../../models/match.js');

exports.schematize = function(match) {
		// construct base template
		var newMatch = new Match({
			id: match.matchId,
			participants: [],
			matchDuration: match.matchDuration,
			matchCreation: match.matchCreation
		});

		// get list of participants in match
		for(participant in match.participants) {
			var stats = participant.stats
			var timeline = participant.timeline
			var runes = participants.runes
			var masteries = participants.materies
	
			// get list of rune ids
			var runeset = [];
			for(rune in runes) {
				runeset.push(rune.runeId);
			}
		
			// get list of mastery ids
			var masteryset = [];
			for(mastery in masteries) {
				masteryset.push(mastery.masteryId);
			}
			
			newMatch.participants.push({
				champion: participant.championId,
				lane: timeline.lane,
				role: timeline.role,
				highestAchievedSeasonTier: participant.highestAchievedSeasonTier,
				winner: stats.winner,
				summs: [participant.spell1Id, participant.spell2Id],
				runes: runeset,
				masteries: masteryset,
				items: [stats.item0, stats.item1, stats.item2, stats.item3, stats.item4, stats.item5, stats.item6],
				kills: stats.kills,
				deaths: stats.deaths,
				assists: stats.assist,
				gold: stats.goldEarned,
				magicDmg: stats.magicDamageDealtToChampions,
				physDmg: stats.physicalDamageDealtToChampions,
				trueDmg: stats.trueDamageDealtToChampions,
				dmgTaken: stats.totalDamageTaken,
				ccDurationDealt: stats.totalTimeCrowdControlDealt,
				neutralMinionsKilledTeamJg: stats.neutralMinionsKilledEnemyJungle
			});
		}

		newMatch.save(function(err,res) {
			if (err) return console.error(err);
		});
		
		Match.find(function(err, matches) {
			if (err) return console.error(err);
			console.log(matches);
		});
};