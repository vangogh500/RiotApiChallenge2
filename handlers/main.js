exports.index = function(req, res){
	res.render('index');
};

exports.notFound = function(req, res){
	res.status(404);
	res.render('404');
};

exports.internalError = function(req, res){
	console.error(err.stack);
	res.status(500);
	res.render('500');
};