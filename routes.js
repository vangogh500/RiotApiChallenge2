var mainHandler = require('./handlers/main.js');

module.exports = function(app) {
	// index page
	app.get('/', mainHandler.index);

	// 404 page
	app.use(mainHandler.notFound);
	
	// 500 page
	app.use(mainHandler.internalError);
};