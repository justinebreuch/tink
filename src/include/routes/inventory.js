var constants = require('../constants'),
	security = require('../security'),
	model = require('../model');

/*
 * This file holds all the route functions for inventory manipulation.
 */

/*
 * Create a new item.
 *
 * @param type The type of item (0: Yarn, 1: Hat, 2: Scarf, 3: Cup Cozy).
 * @param name The name of the item.
 * @param data Data associated with the item.
 * @param amount The amount of the item.
 */
exports.create = function(req, res) {
	this.req = req;
	this.res = res;
	this.result = {};

	if (!security.enforce(req, res, 1)) return;

	// Get the arguments from the request body.
	this.type = parseInt(req.body.type);
	this.name = req.body.name;
	this.data = JSON.parse(req.body.data);
	this.amount = parseInt(req.body.amount);

	// Create the new item.
	var newItem = new model.Item();
	newItem.type = this.type;
	newItem.name = this.name;
	newItem.data = this.data;
	newItem.amount = this.amount;

	// Save the item.
	newItem.save(function() {
		this.res.json(this.result);
	}.bind(this));
};

/*
 * Delete an item.
 *
 * @param id The id of the item.
 */
exports.remove = function(req, res) {
	this.req = req;
	this.res = res;
	this.result = {};

	if (!security.enforce(req, res, 1)) return;

	// Get the arguments from the request body.
	this.id = parseInt(req.body.id);

	// Search for the item.
	model.Item.find({ _id: this.id }, function(err, result) {
		if (result) {
			result[0].remove(function() {
				this.res.json(this.result);
			}.bind(this));
		} else {
			this.result.error = constants.ERR_NO_SUCH_ITEM;
			this.res.json(this.result);
		}
	}.bind(this));
};

/*
 * Search for items given a filter.
 *
 * @param filter The filter to use.
 */
exports.search = function(req, res) {
	this.req = req;
	this.res = res;
	this.result = {};

	if (!security.enforce(req, res, 1)) return;

	// Get the arguments from the request body.
	this.filter = JSON.parse(req.body.filter);

	// Search for the items.
	model.Item.find(this.filter, function(err, result) {
		this.res.json(result);
	}.bind(this));
};

/*
 * Change the amount of an item.
 *
 * @param id The id of the item.
 * @param mode The way to change the amount (0: set, 1: add).
 * @param amount The amount to change to/by.
 */
exports.change = function(req, res) {
	this.req = req;
	this.res = res;
	this.result = {};

	if (!security.enforce(req, res, 1)) return;

	// Get the arguments from the request body.
	this.id = parseInt(req.body.id);
	this.mode = parseInt(req.body.mode);
	this.amount = parseInt(req.body.amount);

	// Search for the item.
	model.Item.find({ _id: this.id }, function(err, result) {
		if (result) {
			result[0].amount = this.mode * result[0].amount + this.amount;
			result[0].save(function() {
				this.res.json(this.result);
			}.bind(this));
		} else {
			this.result.error = constants.ERR_NO_SUCH_ITEM;
			this.res.json(this.result);
		}
	}.bind(this));
};
