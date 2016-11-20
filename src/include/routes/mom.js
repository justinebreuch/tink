var constants = require('../constants'),
	security = require('../security'),
	model = require('../model');

/*
 * This file holds all the route functions for mom manipulation.
 */

/*
 * Create a new mom.
 *
 * @param name Name of the mom.
 * @param organization Organization associated with the mom.
 * @param data Data associated with the mom.
 */
exports.create = function(req, res) {
	this.req = req;
	this.res = res;
	this.result = {};

	if (!security.enforce(req, res, 1)) return;

	// Get the parameters from the request body.
	this.name = req.body.name.trim();
	this.organization = req.body.organization.trim();
	this.data = JSON.parse(req.body.data);

	// Create the new mom.
	var newMom = new model.Mom();
	newMom.name = this.name;
	newMom.organization = this.organization;
	newMom.data = this.data;

	// Save the mom.
	newMom.save(function() {
		this.res.json(this.result);
	}.bind(this));
};

/*
 * Updates a mom.
 *
 * @param id Id of the mom to update.
 * @param fields Fields of the mom to update with their values.
 */
exports.update = function(req, res) {
	this.req = req;
	this.res = res;
	this.result = {};

	if (!security.enforce(req, res, 1)) return;

	// Get the parameters from the request body.
	this.fields = JSON.parse(req.body.fields);

	// Update the mom.
	model.Mom.find({ _id: req.body.id }, function(err, result) {
		for (field in this.fields) {
			if (field == 'organization') {
				result[0][field] = this.fields[field];
			} else {
				result[0].data[field] = this.fields[field];
			}
		}

		// Mark the data field as modified.
		result[0].markModified('data');
		
		// Save the mom.
		result[0].save(function(err) {
			this.res.json(this.result);
		}.bind(this));
	}.bind(this));
};

/*
 * Removes a mom.
 *
 * @param id The id of the mom.
 */
exports.remove = function(req, res) {
	this.req = req;
	this.res = res;
	this.result = {};

	if (!security.enforce(req, res, 1)) return;

	// Get the id.
	this.id = parseInt(req.body.id);

	// Find the mom.
	model.Mom.find({ _id: this.id }, function(err, result) {
		if (result.length) {
			result[0].remove(function() {
				this.res.json(this.result);
			}.bind(this));
		} else {
			this.result.error = constants.ERR_DOES_NOT_EXIST;
			this.res.json(this.result);
		}
	}.bind(this));
};

/*
 * Searches for moms given a filter.
 *
 * @param filter The filter to use when searching for moms.
 */
exports.search = function(req, res) {
	this.req = req;
	this.res = res;

	if (!security.enforce(req, res, 1)) return;

	// Get the filter.
	var filter = JSON.parse(req.body.filter);

	// Find all moms.
	model.Mom.find(filter, function(err, result) {
		this.res.json(result);
	}.bind(this));
};
