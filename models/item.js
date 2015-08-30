var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
	itemId: Number,
	itemName: Number,
	imgURL: String,
	regionalStats: [{
		regionName: String,
		picks: Number,
		wins: Number,
		champions: [{
			championId: Number,
			matches: [Number]
		}],
		matches: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Match'
		}]
	}]
});

var Item = mongoose.model('Item', itemSchema);
module.exports = Item;