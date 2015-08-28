var mainHandler = require('./handlers/main.js');

module.exports = function(app) {
	// index page
	app.get('/', mainHandler.index);

	// 404 page
	app.use(mainHandler.404);
	
	// 500 page
	app.use(mainHandler.500);
};