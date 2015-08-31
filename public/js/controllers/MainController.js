google.load("visualization", "1", {packages:["corechart"]});

google.setOnLoadCallback(function() {
	angular.bootstrap(document.body, ['app']);
});

app.controller('MainController',['$http', function($http) {
	var self = this;
	self.name = "test";
	$http.get('/api/champions').then(function(res) {
		self.champions = res.data;
		self.winRates = winRates();
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
		return data;
	};
	
	var data = google.visualization.arrayToDataTable([
	  ['Age', 'Weight'],
	  [ 8,      12],
	  [ 4,      5.5],
	  [ 11,     14],
	  [ 4,      5],
	  [ 3,      3.5],
	  [ 6.5,    7]
	]);

	var options = {
	  title: 'Age vs. Weight comparison',
	  hAxis: {title: 'Age', minValue: 0, maxValue: 15},
	  vAxis: {title: 'Weight', minValue: 0, maxValue: 15},
	  legend: 'none'
	};

	var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

	chart.draw(data, options);
}]);