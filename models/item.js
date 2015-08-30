var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
	itemId: Number,
	itemName: Number,
	imgURL: String,
	regionalStats: [{
		region: String,
		picks: Number,
		wins: Number,
		champions: [{
			championId: Number,
			matches: [Number]
		}]
	}]
});

var Item = mongoose.model('Item', itemSchema);
module.exports = Item;