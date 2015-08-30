var express = require('express');
var app = express();
var matchSchematizer = require('./lib/riot/matchSchematizer.js');

// handlebars
var handlebars = require('express-handlebars').create({
	defaultLayout:'main',
	extname:'.hbs'
});
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

// mongoose
var mongoose = require('mongoose');
var opts = {
	server: {
		socketOptions: { keepAlive: 1 }
	}
};

// custom modules
var credentials = require('./credentials.js');
var riot = require('./lib/riot/riot.js')({
	type: "match",
	key: credentials.riot.key,
	region: 'na'
});

riot.test(1907069332, matchSchematizer.schematize);

mongoose.connect(credentials.mongo.connectionString, opts);


// Set port and ip
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP);

// Set up middle ware for client side assets
app.use(express.static(__dirname + '/public'));

// Set up routes
require('./routes.js')(app);

app.listen(app.get('port'), app.get('ip'), function() {
	console.log("Server is running");
});