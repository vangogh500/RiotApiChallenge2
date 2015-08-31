google.load("visualization", "1", {packages:["corechart"]});

google.setOnLoadCallback(function() {
	angular.bootstrap(document.body, ['app']);
});

app.controller('MainController',['$http', function($http) {
	var self = this;
	
	var options = {
	  hAxis: {title: 'Win Rates', minValue: -1, maxValue: 1},
	  vAxis: {title: 'Picks', minValue: 0, maxValue: 15},
	  legend: 'none'
	};

	var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
	
	self.name = "test";
	$http.get('/api/champions').then(function(res) {
		self.champions = res.data;
		self.winRates = winRates();
		chart.draw(self.winRates, options);
	}, function(err) {
		console.error(err);
	});
	
	var winRates = function() {
		var data = [['Picks', 'Win Rate']];
		self.champions.forEach(function(champion){
			console.log("processing: " + champion.name);
			var championTotalPicks = 0;
			var championTotalWins = 0;
			champion.regionalStats.forEach(function(regionalStat) {
				championTotalPicks += regionalStat.picks;
				championTotalWins += regionalStat.wins;
			});
			data.push([championTotalWins/championTotalPicks, championTotalPicks]);
		});
		console.log(data);
		return google.visualization.arrayToDataTable([data]);
	};
}]);