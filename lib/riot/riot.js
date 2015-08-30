var https = require('https');
var matchSchematizer = require('./matchSchematizer.js');

module.exports = function(riotOptions) {
	return {
		test: function(id) {
			var tempPath = '/api/lol/';
			switch(riotOptions.type) {
				case "match":
					tempPath = tempPath + riotOptions.region + '/v2.2/match/' + id + '?includeTimeline=true';
					break;
				case 1:
					tempPath = temptPath + 'static-data/' + riotOptions.region + '/v1.2/champion/' + id;
					break;
			}
			var options = {
				hostname: 'na.api.pvp.net',
				port: '443',
				method: 'GET',
				path: tempPath,
				headers: {
					'X-Riot-Token': riotOptions.key
				}
			};
			https.request(options, function(res) {
				var data = '';
				res.on('data', function(chunk) {
					data += chunk;
				});
				res.on('end', function() {
					console.log(data);
					matchSchematizer.schematize(JSON.parse(data));
				});
			}).end();
		}
	}
};