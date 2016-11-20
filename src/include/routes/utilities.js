var constants = require('../constants'),
	security = require('../security'),
	utilities = require('../utilities');

/*
 * This file holds all the route functions for utilities.
 */

/*
 * Upload a file.
 *
 * @param data The base64 contents of the file to be uploaded.
 */
exports.upload = function(req, res) {
	this.req = req;
	this.res = res;
	this.result = {};

	if (!security.enforce(req, res, 1)) return;

	// Get the contents.
	this.data = req.body.data;

	// Upload the file.
	utilities.upload(this.data, function(err, id) {
		if (err) return this.res.json({ error: err });
		this.res.json({ id: id });
	}.bind(this));
};
