var express = require('express');

var app = express();

app.set('ip', process.env.OPENSHIFT_NODEJS_IP);
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);

// 404 page
app.use(function(req,res){
	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');
});
// 500 page
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - Server Error');
});

app.listen(app.get('port'), function() {
});