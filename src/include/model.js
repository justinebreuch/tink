var mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment');

/*
 * Contains the database models necessary for the web app.
 */

var userSchema = mongoose.Schema({
	email: String,
	password: String,
	admin: Boolean,
	name: String,
	phone: { type: String, default: '' },
	moms: { type: Array, default: [] }
});
userSchema.plugin(autoIncrement.plugin, 'User');

var momSchema = mongoose.Schema({
	name: String,
	organization: { type: String, default: '' },
	data: { type: Object, default: {} }
});
momSchema.plugin(autoIncrement.plugin, 'User');

var exchangeSchema = mongoose.Schema({
	recipient: Number,
	manager: Number,
	yarn: { type: Array, default: [] },
	product: { type: Array, default: [] },
	notes: { type: String, default: '' },
	date: { type: Date, default: Date.now }
});
exchangeSchema.plugin(autoIncrement.plugin, 'Exchange');

var itemSchema = mongoose.Schema({
	name: String,
	type: Number, // 0: Yarn, 1: Hat, 2: Scarf, 3: Cup Cozy.
	data: { type: Object, default: {} },
	amount: { type: Number, default: 0 }
});
itemSchema.plugin(autoIncrement.plugin, 'Item');

exports.User = mongoose.model('User', userSchema);
exports.Mom = mongoose.model('Mom', momSchema);
exports.Exchange = mongoose.model('Exchange', exchangeSchema);
exports.Item = mongoose.model('Item', itemSchema);
