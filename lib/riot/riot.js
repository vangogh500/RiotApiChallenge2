var https = require('https');

module.exports = function(riotOptions) {
	return {
		get: function(id, cb) {
			var tempPath = '/api/lol/';
			switch(riotOptions.type) {
				case "match":
					tempPath = tempPath + riotOptions.region + '/v2.2/match/' + id + '?includeTimeline=true';
					break;
				case "champion":
					tempPath = tempPath + 'static-data/' + riotOptions.region + '/v1.2/champion/' + id + '?champData=image';
					break;
				case "item":
					tempPath = tempPath + 'static-data/' + riotOptions.region + '/v1.2/item/' + id + '?itemData=image';
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
			function makeRequest(opts, callback) {
				https.request(opts, function(res) {
					var data = '';
					res.on('data', function(chunk) {
						data += chunk;
					});
					res.on('error', function(e) {
						console.log(e);
					});
					res.on('end', function() {
						if(res.statusCode == 429) {
							console.log(res.headers);
							makeRequest(opts, callback);
						}
						else {
							console.log(id + " : " + res.statusCode);
							callback(JSON.parse(data));
						}
					});
				}).end();
			}
			makeRequest(options, cb);
		}
	}
};