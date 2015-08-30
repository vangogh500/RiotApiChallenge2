var Match = require('../../models/match.js');
var Team = require('../../models/team.js');
var Participant = require('../../models/participant.js');
var Champion = require('../../models/champion.js');
var Item = require('../../models/item.js');
var async = require('async');

var brawlerIds = [3611, 3612, 3613, 3614];
var brawlerUpgradeIds = [3615, 3616, 3617, 3621, 3622, 3623, 3624, 3625, 3626];

module.exports = {
	// return a basic match object
	createMatchTemplate: function(match) {
		var newMatch = new Match({
				matchId: match.matchId,
				region: match.region,
				teams: [],
				matchDuration: match.matchDuration,
				matchCreation: match.matchCreation
			});
		return newMatch;
	},
	// return an array of basic team objects
	createTeamsTemplate: function(match) {
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
	createParticipantsTemplate: function(match) {
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
				teamId: participant.teamId,
				championId: participant.championId,
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
					assists: stats.assists,
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
					totalHeal: stats.totalHeal,
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
			participantArr.push(newParticipant);
		});
		return participantArr;
	},
	// updates champions/creates champions if they don't exist already dependent on the array of participants
	updateChampions: function(participants, newMatch, mainCallback) {
		async.eachSeries(participants, function(participant, cb){
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
				// find regional data
				var dbRegionalIdx = indexOfWithAttr(dbChamp.regionalStats, "regionName", newMatch.region);
				var dbRegion;
				if(dbRegionalIdx === -1) {
					dbRegion = {
						regionName: newMatch.region,
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
				
				// edit attr of regional data...
				if(dbRegion.matches.indexOf(newMatch._id) == -1){ dbRegion.matches.push(newMatch._id); }
				dbRegion.picks += 1;
				// helper function check if object with given attr exists and add match to it if it doesn't already exist, if not create new obj with match
				function addMatch(array, attr, value) {
					if(attr == "itemID") {
						console.log(dbChamp.championId);
						console.log("itemID: " + value);
						console.log(newMatch._id);
					}
					var db;
					var dbIdx = indexOfWithAttr(array, attr, value);
					if(dbIdx == -1) {
						db = {};
						db[attr] = value;
						db.matches = [];
						array.push(db);
					} else {
						db = array[dbIdx];
					}
					if(db.matches.indexOf(newMatch._id)	== -1){ 
						if(attr == "itemID") {
							console.log("sucess!");
						}
						db.matches.push(newMatch._id); 
					}
				}
				addMatch(dbRegion.lanes, "laneName", participant.lane);
				addMatch(dbRegion.roles, "roleName", participant.role);
				addMatch(dbRegion.ranks, "rankName", participant.highestAchievedSeasonTier);
				participant.summs.forEach(function(summ){
					addMatch(dbRegion.summs, "summID", summ);
				});
				participant.runes.forEach(function(rune){
					addMatch(dbRegion.runes, "runeID", rune);
				});
				participant.masteries.forEach(function(mastery){
					addMatch(dbRegion.masteries, "masteryID", mastery);
				});
				participant.items.forEach(function(item){
					addMatch(dbRegion.items, "itemID", item);
				});
				console.log("/t" + dbRegion.items);
				addMatch(dbRegion.brawlers, "brawlerID", participant.brawlerId);
				participant.brawlerUpgrades.forEach(function(brawlerUpgrade){
					addMatch(dbRegion.brawlerUpgrades, "brawlerUpgradeID", brawlerUpgrade);
				});
				
				function addToAvg(champAvg, playerStats) {
					return champAvg + (playerStats - champAvg)/ dbRegion.picks;
				}
				dbRegion.inGameAvgs.creepScore = addToAvg(dbRegion.inGameAvgs.creepScore, participant.inGameStats.creepScore);
				dbRegion.inGameAvgs.wardsPlaced = addToAvg(dbRegion.inGameAvgs.wardsPlaced, participant.inGameStats.wardsPlaced);
				dbRegion.inGameAvgs.wardsKilled = addToAvg(dbRegion.inGameAvgs.wardsKilled, participant.inGameStats.wardsKilled);
				dbRegion.inGameAvgs.kills = addToAvg(dbRegion.inGameAvgs.kills, participant.inGameStats.kills);
				dbRegion.inGameAvgs.pentaKills = addToAvg(dbRegion.inGameAvgs.pentaKills, participant.inGameStats.pentaKills);
				dbRegion.inGameAvgs.quadraKills = addToAvg(dbRegion.inGameAvgs.quadraKills, participant.inGameStats.quadraKills);
				dbRegion.inGameAvgs.tripleKills = addToAvg(dbRegion.inGameAvgs.tripleKills, participant.inGameStats.tripleKills);
				dbRegion.inGameAvgs.doubleKills = addToAvg(dbRegion.inGameAvgs.doubleKills, participant.inGameStats.doubleKills);
				dbRegion.inGameAvgs.largestMultiKill = addToAvg(dbRegion.inGameAvgs.largestMultiKill, participant.inGameStats.largestMultiKill);
				dbRegion.inGameAvgs.largestKillingSpree = addToAvg(dbRegion.inGameAvgs.largestKillingSpree, participant.inGameStats.largestKillingSpree);
				dbRegion.inGameAvgs.deaths = addToAvg(dbRegion.inGameAvgs.deaths, participant.inGameStats.deaths);
				dbRegion.inGameAvgs.assists = addToAvg(dbRegion.inGameAvgs.assists, participant.inGameStats.assists);
				dbRegion.inGameAvgs.gold = addToAvg(dbRegion.inGameAvgs.gold, participant.inGameStats.gold);
				dbRegion.inGameAvgs.largestCrit = addToAvg(dbRegion.inGameAvgs.largestCrit, participant.inGameStats.largestCrit);			
				dbRegion.inGameAvgs.totalDmgDealtToChamps = addToAvg(dbRegion.inGameAvgs.totalDmgDealtToChamps, participant.inGameStats.totalDmgDealtToChamps);
				dbRegion.inGameAvgs.magicDmgDealtToChamps = addToAvg(dbRegion.inGameAvgs.magicDmgDealtToChamps, participant.inGameStats.magicDmgDealtToChamps);
				dbRegion.inGameAvgs.physicalDmgDealtToChamps = addToAvg(dbRegion.inGameAvgs.physicalDmgDealtToChamps, participant.inGameStats.physicalDmgDealtToChamps);
				dbRegion.inGameAvgs.trueDmgDealtToChamps = addToAvg(dbRegion.inGameAvgs.trueDmgDealtToChamps, participant.inGameStats.trueDmgDealtToChamps);
				dbRegion.inGameAvgs.magicDmgTaken = addToAvg(dbRegion.inGameAvgs.magicDmgTaken, participant.inGameStats.magicDmgTaken);
				dbRegion.inGameAvgs.physicalDmgTaken = addToAvg(dbRegion.inGameAvgs.physicalDmgTaken, participant.inGameStats.physicalDmgTaken);
				dbRegion.inGameAvgs.trueDmgTaken = addToAvg(dbRegion.inGameAvgs.trueDmgTaken, participant.inGameStats.trueDmgTaken);
				dbRegion.inGameAvgs.totalDmgTaken = addToAvg(dbRegion.inGameAvgs.totalDmgTaken, participant.inGameStats.totalDmgTaken);
				dbRegion.inGameAvgs.ccDurationDealt = addToAvg(dbRegion.inGameAvgs.ccDurationDealt, participant.inGameStats.ccDurationDealt);
				dbRegion.inGameAvgs.totalHeal = addToAvg(dbRegion.inGameAvgs.totalHeal, participant.inGameStats.totalHeal);
				dbRegion.inGameAvgs.neutralMinionsKilledEnemyJg = addToAvg(dbRegion.inGameAvgs.neutralMinionsKilledEnemyJg, participant.inGameStats.neutralMinionsKilledEnemyJg);
				dbRegion.inGameAvgs.neutralMinionsKilledTeamJg = addToAvg(dbRegion.inGameAvgs.neutralMinionsKilledTeamJg, participant.inGameStats.neutralMinionsKilledTeamJg);
				dbRegion.inGameAvgs.firstBloodKill = addToAvg(dbRegion.inGameAvgs.firstBloodKill, participant.inGameStats.firstBloodKill);
				dbRegion.inGameAvgs.firstBloodAssist = addToAvg(dbRegion.inGameAvgs.firstBloodAssist, participant.inGameStats.firstBloodAssist);
				dbRegion.inGameAvgs.firstTowerKill = addToAvg(dbRegion.inGameAvgs.firstTowerKill, participant.inGameStats.firstTowerKill);
				dbRegion.inGameAvgs.firstTowerAssist = addToAvg(dbRegion.inGameAvgs.firstTowerAssist, participant.inGameStats.firstTowerAssist);
				dbRegion.inGameAvgs.towerKills = addToAvg(dbRegion.inGameAvgs.towerKills, participant.inGameStats.towerKills);
				dbRegion.inGameAvgs.csPerMin.zeroToTen = addToAvg(dbRegion.inGameAvgs.csPerMin.zeroToTen, participant.inGameStats.csPerMin.zeroToTen);
				dbRegion.inGameAvgs.csPerMin.thirtyToEnd = addToAvg(dbRegion.inGameAvgs.csPerMin.thirtyToEnd, participant.inGameStats.csPerMin.thirtyToEnd);
				dbRegion.inGameAvgs.csPerMin.tenToTwenty = addToAvg(dbRegion.inGameAvgs.csPerMin.tenToTwenty, participant.inGameStats.csPerMin.tenToTwenty);
				dbRegion.inGameAvgs.csPerMin.twentyToThirty = addToAvg(dbRegion.inGameAvgs.csPerMin.twentyToThirty, participant.inGameStats.csPerMin.twentyToThirty);
				dbRegion.inGameAvgs.csDiffPerMin.zeroToTen = addToAvg(dbRegion.inGameAvgs.csDiffPerMin.zeroToTen, participant.inGameStats.csDiffPerMin.zeroToTen);
				dbRegion.inGameAvgs.csDiffPerMin.thirtyToEnd = addToAvg(dbRegion.inGameAvgs.csDiffPerMin.thirtyToEnd, participant.inGameStats.csDiffPerMin.thirtyToEnd);
				dbRegion.inGameAvgs.csDiffPerMin.tenToTwenty = addToAvg(dbRegion.inGameAvgs.csDiffPerMin.tenToTwenty, participant.inGameStats.csDiffPerMin.tenToTwenty);
				dbRegion.inGameAvgs.csDiffPerMin.twentyToThirty = addToAvg(dbRegion.inGameAvgs.csDiffPerMin.twentyToThirty, participant.inGameStats.csDiffPerMin.twentyToThirty);	
				dbRegion.inGameAvgs.goldPerMin.zeroToTen = addToAvg(dbRegion.inGameAvgs.goldPerMin.zeroToTen, participant.inGameStats.goldPerMin.zeroToTen);
				dbRegion.inGameAvgs.goldPerMin.thirtyToEnd = addToAvg(dbRegion.inGameAvgs.goldPerMin.thirtyToEnd, participant.inGameStats.goldPerMin.thirtyToEnd);
				dbRegion.inGameAvgs.goldPerMin.tenToTwenty = addToAvg(dbRegion.inGameAvgs.goldPerMin.tenToTwenty, participant.inGameStats.goldPerMin.tenToTwenty);
				dbRegion.inGameAvgs.goldPerMin.twentyToThirty = addToAvg(dbRegion.inGameAvgs.goldPerMin.twentyToThirty, participant.inGameStats.goldPerMin.twentyToThirty);
				if(participant.winner){ dbRegion.wins += 1; }
				
				if(dbRegionalIdx === -1) {
					dbChamp.regionalStats.push(dbRegion);
				}
				else {
					dbChamp.regionalStats[dbRegionalIdx] = dbRegion;
				}
				dbChamp.save();	
				cb();
			});
		}, mainCallback);
	}	,
	updateItems: function(participants, newMatch, mainCallback) {
		function updateItem(participant, playerItem, cb) {
			Item.findOne({ itemId: playerItem }, function(err, item) {
				
				if (err) return console.error(err);
				
				var dbItem;
				// if item already exists grab pointer
				if(item !== undefined && item !== null) {
					dbItem = item;
				}
				else {
					dbItem = new Item({
						itemId: playerItem,
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
				// find regional data
				var dbRegionalIdx = indexOfWithAttr(dbItem.regionalStats, "regionName", newMatch.region);
				var dbRegion;
				if(dbRegionalIdx === -1) {
					dbRegion = {
						regionName: newMatch.region,
						picks: 0,
						wins: 0,
						champions: [],
						matches: []
					};
				} else {
					dbRegion = dbItem.regionalStats[dbRegionalIdx];
				}
				// edit attr of regional data...
				if(dbRegion.matches.indexOf(newMatch._id) == -1){ dbRegion.matches.push(newMatch._id); }
				// helper function check if object with given attr exists and add match to it if it doesn't already exist, if not create new obj with match
				function addMatch(array, attr, value) {
					var db;
					var dbIdx = indexOfWithAttr(array, attr, value);
					if(dbIdx == -1) {
						db = {};
						db[attr] = value;
						db.matches = [];
						array.push(db);
					} else {
						db = array[dbIdx];
					}
					if(db.matches.indexOf(newMatch._id)	== -1){ db.matches.push(newMatch._id); }
				}
				addMatch(dbRegion.champions, "championId", participant.championId);
				dbRegion.picks += 1;
				if(participant.winner){ dbRegion.wins += 1; }
				
				// finally insert dbRegion and save to data
				if(dbRegionalIdx === -1) {
					dbItem.regionalStats.push(dbRegion);
				}
				else {
					dbItem.regionalStats[dbRegionalIdx] = dbRegion;
				}
				dbItem.save();	
				cb();
			});
		}
		async.eachSeries(participants, function(participant, loopCb) {
			async.series([
				function(callBack) {
					async.eachSeries(participant.items, function(item, cb) {
						updateItem(participant, item, cb);
					}, callBack);
				},
				function(callBack) {
					async.eachSeries(participant.brawlerUpgrades, function(brawlerUpgrade, cb) {
						updateItem(participant, brawlerUpgrade, cb);
					}, callBack);
				},
				function(callBack) {
					updateItem(participant, participant.brawlerID, callBack);
				},
			], loopCb);
		}, mainCallback);
	}
};