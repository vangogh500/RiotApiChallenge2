var mongoose = require('mongoose');

var championSchema = mongoose.Schema({
	name: String,
	wins: Number,
	picks: Number
});
championSchema.methods.getWinRate = function(){
	return (this.wins / this.picks);
};
var Champion = mongoose.model('Champion', championSchema);
module.exports = Champion;