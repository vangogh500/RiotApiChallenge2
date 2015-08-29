var Match = require('../../models/match.js');
var Participant = require('../../models/participant.js');
var Team = require('../../models/team.js');

var brawlerIds = [3611, 3612, 3613, 3614];
var brawlerUpgradeIds = [3615, 3616, 3617, 3621, 3622, 3623, 3624, 3625, 3626];

exports.schematize = function(match) {
	
		Match.find({ matchId: match.matchId }, function(err, matches) {
			// if match already exists in db
			if(matches.length) {
				console.log("match: " + match.matchId + " already exists");
			}
			// otherwise make new match object and add it to the database
			else {
				console.log("adding match: " + match.matchId + " to the database...");
				// construct base template for match
				var newMatch = new Match({
					matchId: match.matchId,
					region: match.region,
					teams: [],
					matchDuration: match.matchDuration,
					matchCreation: match.matchCreation
				});
		
				// construct base template for teams and store pointers
				var teamArr = [];
				match.teams.forEach(function(team){
					var newTeam = new Team({
						teamId: team.teamId,
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
	
				// create participant for each participant, save to database, and then push pointers into participants array in respective teams
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
					
					var brawler;
					var tempBrawlerUpgrades = [];
					match.timeline.frames.forEach(function(frame) {
						console.log("checking frame w/ time stamp: " + frame.timestamp + "...");
						if(frame.events) {
							console.log("found events!");
							frame.events.forEach(function(event) {
								if(event.participantId === participant.Id) {
									console.log("found matching participant!");
									if(event.eventType === "ITEM_PURCHASED") {
										if(brawlerIds.includes(event.itemId)){ brawler = event.itemId; }
										else if(brawlerUpgradeIds.includes(event.itemId)){ tempBrawlerUpgrades.push(event.itemId); }
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
					// save to the database
					newParticipant.save();
					// add index to participants in appropriate teams
					teamArr.forEach(function(team){
						if(team.teamId === participant.teamId) {
							team.participants.push(newParticipant._id);
						}
					});
				});
		
				// save each team to the database and add db id to match
				teamArr.forEach(function(team){
					team.save(function(err) {
						if (err) return console.error(err);
					});
					newMatch.teams.push(team._id);
				});
		
				// finally save match to the db
				newMatch.save(function(err) {
					if (err) return console.error(err);
				});	
			}
		});	
};