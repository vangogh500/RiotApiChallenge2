var Match = require('../../models/match.js');
var Team = require('../../models/team.js');
var Participant = require('../../models/participant.js');
var Champion = require('../../models/champion.js');

var brawlerIds = [3611, 3612, 3613, 3614];
var brawlerUpgradeIds = [3615, 3616, 3617, 3621, 3622, 3623, 3624, 3625, 3626];

module.exports = {
	// return a basic match object and saves it to the database
	createMatchTemplate: function(match) {
		var newMatch = new Match({
				matchId: match.matchId,
				region: match.region,
				teams: [],
				matchDuration: match.matchDuration,
				matchCreation: match.matchCreation
			});
		newMatch.save(function(err) {
			if (err) return console.error(err);
		});
		return newMatch;
	},
	// return an array of basic team objects
	createTeamTemplate: function(match) {
		var teamArr = [];
		match.teams.forEach(function(team){
			var newTeam = new Team({
				teamId: team.teamId,
				winner: team.winner,
				participants: [],
				inGameStats: {
					firstDragon: team.firstDragon,
					firstBaron: team.firstBaron,
					barrons: team.baronKills,
					dragons: team.dragonKills,
					towerKills: team.towerKills
				},
				bans: []
			});
			team.bans.forEach(function(ban) {
				newTeam.bans.push(ban.championId);
			});
			teamArr.push(newTeam);
		});
		return teamArr;
	},
	// return an array of participant objects
	saveParticipants: function(match, teamArr) {
		var participantArr = [];
		match.participants.forEach(function(participant){
			var stats = participant.stats
			var timeline = participant.timeline
			var runes = participant.runes
			var masteries = participant.masteries
	
			// get list of rune ids
			var runeset = [];
			runes.forEach(function(rune) {
				runeset.push(rune.runeId);
			});

			// get list of mastery ids
			var masteryset = [];
			masteries.forEach(function(mastery) {
				masteryset.push(mastery.masteryId);
			});
			
			// get brawler info
			var brawler;
			var tempBrawlerUpgrades = [];
			match.timeline.frames.forEach(function(frame) {
				if(frame.events) {
					frame.events.forEach(function(event) {
						if(event.participantId === participant.participantId) {
							if(event.eventType == "ITEM_PURCHASED") {
								if(brawlerIds.indexOf(event.itemId) > -1){ brawler = event.itemId; }
								else if(brawlerUpgradeIds.indexOf(event.itemId) >- 1){ tempBrawlerUpgrades.push(event.itemId); }
							}
						} 
					});
				}
			});
	
			// create new participant obj
			var newParticipant = new Participant({	
				participantId: participant.participantId,		
				champion: participant.championId,
				lane: timeline.lane,
				role: timeline.role,
				highestAchievedSeasonTier: participant.highestAchievedSeasonTier,
				winner: stats.winner,
				summs: [participant.spell1Id, participant.spell2Id],
				runes: runeset,
				masteries: masteryset,
				items: [stats.item0, stats.item1, stats.item2, stats.item3, stats.item4, stats.item5, stats.item6],
				brawlerID: brawler,
				brawlerUpgrades: tempBrawlerUpgrades,
				inGameStats: {
					creepScore: stats.minionsKilled,
					wardsPlaced: stats.wardsPlaced,
					wardsKilled: stats.wardsKilled,
					kills: stats.kills,
					pentaKills: stats.pentaKills,
					quadraKills: stats.quadraKills,
					tripleKills: stats.tripleKills,
					doubleKills: stats.doubleKills,
					largestMultiKill: stats.largestMultiKill,
					largestKillingSpree: stats.largestKillingSpree,
					deaths: stats.deaths,
					assists: stats.assist,
					gold: stats.goldEarned,
					largestCrit: stats.largestCriticalStrike,
					totalDmgDealtToChamps: stats.totalDamageDealtToChampions,
					magicDmgDealtToChamps: stats.magicDamageDealtToChampions,
					physicalDmgDealtToChamps: stats.physicalDamageDealtToChampions,
					trueDmgDealtToChamps: stats.trueDamageDealtToChampions,
					magicDmgTaken: stats.magicDamageTaken,
					physicalDmgTaken: stats.physicalDamageTaken,
					trueDmgTaken: stats.trueDamageTaken,
					totalDmgTaken: stats.totalDamageTaken,
					ccDurationDealt: stats.totalTimeCrowdControlDealt,
					neutralMinionsKilledEnemyJg: stats.neutralMinionsKilledEnemyJungle,
					neutralMinionsKilledTeamJg: stats.neutralMinionsKilledTeamJungle,
					firstBloodKill: stats.firstBloodKill,
					firstBloodAssist: stats.firstBloodAssist,
					firstTowerKill: stats.firstTowerKill,
					firstTowerAssist: stats.firstTowerAssist,
					towerKills: stats.towerKills,
					csPerMin: {
						zeroToTen: timeline.creepsPerMinDeltas.zeroToTen,
						thirtyToEnd: timeline.creepsPerMinDeltas.thirtyToEnd,
						tenToTwenty: timeline.creepsPerMinDeltas.tenToTwenty,
						twentyToThirty: timeline.creepsPerMinDeltas.twentyToThirty
					},
					csDiffPerMin: {
						zeroToTen: timeline.csDiffPerMinDeltas.zeroToTen,
						thirtyToEnd: timeline.csDiffPerMinDeltas.thirtyToEnd,
						tenToTwenty: timeline.csDiffPerMinDeltas.tenToTwenty,
						twentyToThirty: timeline.csDiffPerMinDeltas.twentyToThirty
					},
					goldPerMin: {
						zeroToTen: timeline.goldPerMinDeltas.zeroToTen,
						thirtyToEnd: timeline.goldPerMinDeltas.thirtyToEnd,
						tenToTwenty: timeline.goldPerMinDeltas.tenToTwenty,
						twentyToThirty: timeline.goldPerMinDeltas.twentyToThirty
					}
				}
			});
			newParticipant.save();
			teamArr.forEach(function(team){
				if(team.teamId === participant.teamId) {
					team.participants.push(participant._id);
				}
			});
			participantArr.push(newParticipant);
		});
		return participantArr;
	},
	updateChampions: function(match, participants, newMatch) {
		participants.forEach(function(participant){
			Champion.findOne({ championId: participant.championId }, function(err, champion) {
				if (err) return console.error(err);
				
				var dbChamp;
				// if champion already exists grab pointer
				if(champion) {
					dbChamp = champion;
				}
				// otherwise make a new champion object to push into the database
				else {
					dbChamp = new Champion({
						championId: participant.championId,
						regionalStats: []
					});
				}
				
				// helper function returns index of object with a given attribute in array, returns -1 if it can't find it
				function indexOfWithAttr(array, attr, value) {
					for(var i = 0; i < array.length; i+=1) {
						if(array[i][attr] == value){ return i; }
					}
					return -1;
				}
		
				var dbRegionalIdx = indexOfWithAttr(dbChamp.regionalStats, "regionName", match.region);
				var dbRegion;
				if(dbRegionalIdx === -1) {
					dbRegion = {
						regionName: match.region,
						matches: [],
						picks: 0,
						wins: 0,
						lanes: [],
						roles: [],
						ranks: [],
						summs: [],
						runes: [],
						masteries: [],
						items: [],
						brawlers: [],
						brawlerUpgrades: [],
						inGameAvgs: {
							creepScore: 0,
							wardsPlaced: 0,
							wardsKilled: 0,
							kills: 0,
							pentaKills: 0,
							quadraKills: 0,
							tripleKills: 0,
							doubleKills: 0,
							largestMultiKill: 0,
							largestKillingSpree: 0,
							deaths: 0,
							assists: 0,
							gold: 0,
							largestCrit: 0,
							totalDmgDealtToChamps: 0,
							magicDmgDealtToChamps: 0,
							physicalDmgDealtToChamps: 0,
							trueDmgDealtToChamps: 0,
							magicDmgTaken: 0,
							physicalDmgTaken: 0,
							trueDmgTaken: 0,
							totalDmgTaken: 0,
							ccDurationDealt: 0,
							totalHeal: 0,
							neutralMinionsKilledEnemyJg: 0,
							neutralMinionsKilledTeamJg: 0,
							firstBloodKill: 0,
							firstBloodAssist: 0,
							firstTowerKill: 0,
							firstTowerAssist: 0,
							towerKills: 0,
							csPerMin: {
								zeroToTen: 0,
								thirtyToEnd: 0,
								tenToTwenty: 0,
								twentyToThirty: 0
							},
							csDiffPerMin: {
								zeroToTen: 0,
								thirtyToEnd: 0,
								tenToTwenty: 0,
								twentyToThirty: 0
							},
							goldPerMin: {
								zeroToTen: 0,
								thirtyToEnd: 0,
								tenToTwenty: 0,
								twentyToThirty: 0
							}
						}
					};
				} else {
					dbRegion = dbChamp.regionalStats[dbRegionalIdx];
				}
				// helper function check if object with given attr exists and add match to it if it doesn't already exist, if not create new obj with match
				function addMatch(array, attr, value) {
					var db;
					var dbIdx = indexOfWithAttr(array, attr, value);
					if(dbIdx == -1) {
						db = new Object;
						db[attr] = value;
						db.matches = [];
						//console.log(db);
						array.push(db);
					} else {
						db = array[dbIdx];
					}
					//console.log(array);
					if(db.matches.indexOf(newMatch._id)	== -1){ db.matches.push(newMatch._id); }
				}
				// add match to regional stats if it doesn't already
				if(dbRegion.matches.indexOf(newMatch._id) == -1){ dbRegion.matches.push(newMatch._id); }
				// add one to picks parameter
				dbRegion.picks += 1;
				addMatch(dbRegion.roles, "roleName", match.timeline.role);
				console.log("dbRegion: " + JSON.stringify(dbRegion.roles));
				//console.log("dbChamp: " + dbChamp.regionalStats.filter(function(regionStats){ return regionStats.regionName == match.region }));
				// add one to wins parameter if participant won
				if(stats.winner){ dbRegion.wins += 1; }
				dbChamp.regionalStats.push(dbRegion);
				dbChamp.save();	
			});
		});
	}	
};