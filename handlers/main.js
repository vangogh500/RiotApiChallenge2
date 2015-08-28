exports.index = function(req, res){
	res.render('home');
};

exports.404 = function(req, res){
	res.status(404);
	res.render('404');
};

exports.500 = function(req, res){
	console.error(err.stack);
	res.status(500);
	res.render('500');
};