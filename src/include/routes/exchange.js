var constants = require('../constants'),
	security = require('../security'),
	model = require('../model'),
	utilities = require('../utilities');

/*
 * This file holds all the route functions for exchange manipulation.
 */

/*
 * Create a new exchange.
 *
 * @param recipient The recipient of the exchange.
 * @param manager The manager doing the exchange.
 * @param yarn The ids and amounts of yarn being exchanged.
 * @param product The ids and amounts of product being exchanged.
 * @param notes Notes taken.
 */
exports.create = function(req, res) {
	this.req = req;
	this.res = res;
	this.result = {};

	if (!security.enforce(req, res, 1)) return;

	// Get the arguments from the request body.
	this.recipient = req.body.recipient;
	this.manager = req.body.manager;
	this.yarn = JSON.parse(req.body.yarn);
	this.product = JSON.parse(req.body.product);
	this.notes = req.body.notes;

	// Create the new exchange.
	var newExchange = new model.Exchange();
	newExchange.recipient = this.recipient;
	newExchange.manager = this.manager;
	newExchange.yarn = this.yarn;
	newExchange.product = this.product;
	newExchange.notes = this.notes;

	newExchange.save(function() {
		this.res.json(this.result);
	}.bind(this));

	// Change the inventory accordingly.
	this.items = [];
	for (var i in this.yarn) {
		this.items.push([ this.yarn[i][0], -this.yarn[i][1] ]);
	}
	for (var i in this.product) {
		this.items.push(this.product[i]);
	}
	for (var i in this.items) {
		var item = this.items[i];
		model.Item.find({ _id: item[0] }, function(err, result) {
			if (result.length) {
				result[0].amount += this[1];
				result[0].save();
			}
		}.bind(item));
	}
}

/*
 * Searches for exchanges given a filter.
 *
 * @param filter The filter to use when searching for exchanges.
 */
exports.search = function(req, res) {
	this.req = req;
	this.res = res;

	if (!security.enforce(req, res, 1)) return;

	// Get the filter.
	var filter = JSON.parse(req.body.filter);

	// Find all exchanges.
	model.Exchange.find(filter, function(err, result) {
		this.res.json(result);
	}.bind(this));
}
