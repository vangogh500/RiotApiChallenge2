var express = require('express');
var handlebars = require('express-handlebars').create({
	defaultLayout:'main',
	extname:'.hbs'
});

var app = express();

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

// Set port and ip
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP);

app.get('/', function(req,res){
	res.render('index');
});

app.use(express.static(__dirname + '/public'));

// 404 page
app.use(function(req,res){
	res.status(404);
	res.render('404');
});
// 500 page
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), app.get('ip'), function() {
	console.log("Server is running");
});