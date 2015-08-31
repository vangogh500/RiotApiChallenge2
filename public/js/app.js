var app = angular.module("app", ['nvd3ChartDirectives']);

app.config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('//');
	$interpolateProvider.endSymbol('//');
});