var mainHandler = require('./handlers/main.js');

var Champion = require('./models/champion.js');
var Match = require('./models/match.js');

module.exports = function(app) {
	// index page
	app.get('/', mainHandler.index);
	
	// api --------------------------------
	app.get('/api/champions', function(req,res) {
		Champion.find(function(err, champions) {
			if(err) res.send(err)
			res.json(champions);	
		});
	});
	
	app.get('/api/matches', function(req,res) {
		Match.find(function(err, matches) {
			if(err) res.send(err)
			res.json(matches);
		});
	});

	// 404 page
	app.use(mainHandler.notFound);
	
	// 500 page
	app.use(mainHandler.internalError);
};