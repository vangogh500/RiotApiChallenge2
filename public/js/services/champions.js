app.factory('champions', ['$http', function($http) {
	
	function formatWinRates(championStats) {
		var totalPicks = 0;
		var data = [['Picks', 'Win Rate']];
		championStats.forEach(function(champion){
			var championTotalPicks = 0;
			var championTotalWins = 0;
			champion.regionalStats.forEach(function(regionalStat) {
				championTotalPicks += regionalStat.picks;
				totalPicks += regionalStat.picks;
				championTotalWins += regionalStat.wins;
			});
			data.push([championTotalPicks, championTotalWins/championTotalPicks]);
		});
		
		data.forEach(function(row){
			if(row[0] != "Picks") row[0] = row[0] / (totalPicks/5);
		});
		return data;
	}
	
	return {
		getStats: $http.get('/api/champions').then(function(res) {
			return res.data;
		}),
		formatWinRates: function(stats) {
			return formatWinRates(stats);
		}
	};
}]);