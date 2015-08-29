var https = require('https');
var matchSchematizer = require('./matchSchematizer.js');

module.exports = function(riotOptions) {
	return {
		test: function() {
			var options = {
				hostname: 'na.api.pvp.net',
				port: '443',
				method: 'GET',
				path: '/api/lol/na/v2.2/match/1907069332',
				headers: {
					'X-Riot-Token': riotOptions.key,
					'includeTimeline': true
				}
			};
			https.request(options, function(res) {
				var data = '';
				res.on('data', function(chunk) {
					data += chunk;
				});
				res.on('end', function() {
					matchSchematizer.schematize(JSON.parse(data));
				});
			}).end();
		}
	}
};