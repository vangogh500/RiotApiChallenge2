google.load("visualization", "1", {packages:["corechart"]});

google.setOnLoadCallback(function() {
	angular.bootstrap(document.body, ['app']);
});
app.controller('MainController',['champions', '$http', '$scope', function(champions, $http, $scope) {
	var self = this;
	
	self.getDivId = function(arg) {
		return "champion" + arg.championId;
	}
	
	self.getBackgroundUrl = function(arg) {
		return "url("+arg.sprite + ")";
	}
	
	$scope.$on('onRepeatLast', function(scope, element, attrs) {
		console.log("done");
		var table = google.visualization.arrayToDataTable(self.winRates);
		var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
		google.visualization.events.addListener(chart, 'ready',
			placeMarker.bind(chart, table));
		chart.draw(table, options);
	});
	
	champions.getStats.then(function(data) {
		self.winRates = champions.formatWinRates(data);
		console.log(self.winRates);
		self.championStats = data;
	});
	
	
	var options = {
		hAxis: {
			title: 'Pick Rates',
			viewWindowMode: 'explicit',
			viewWindow: {
				min: -0.01,
				max: 0.18
			}
		},
	  	vAxis: {
	  		title: 'Win Rates',
			viewWindowMode: 'explicit',
			viewWindow: {
				min: -0.1,
				max: 1.1
			}
		},
	  	legend: 'none',
	  	'chartArea': {'width': '85%', 'height': '85%'},
	  	'tooltip' : {
  			trigger: 'none'
		},
	  	backgroundColor: "transparent"
	};
	
	function placeMarker(dataTable) {
		var cli = this.getChartLayoutInterface();
        var chartArea = cli.getChartAreaBoundingBox();
		self.championStats.forEach(function(champion, idx) {
			var name = "#champion" + champion.championId;
       		document.querySelector(name).style.left = Math.floor(cli.getXLocation(dataTable.getValue(idx, 0))) + 264 + "px";
       		document.querySelector(name).style.top = Math.floor(cli.getYLocation(dataTable.getValue(idx, 1))) + 66 + "px";
       	});
    };

}]);