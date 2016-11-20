var constants = require('../constants'),
	security = require('../security');

/*
 * This file holds all the route functions for admin functions.
 */

/*
 * Index page.
 */
exports.index = function(req, res) {
	if (security.enforceAdmin(req, res, true)) return;
	res.render('admin.html');
}
