var constants = require('../constants'),
	security = require('../security');

/*
 * This file holds all the routes for the various pages in the webapp.
 */

/*
 * Index page.
 */
exports.index = function(req, res) {
	if (security.enforceAdmin(req, res, false)) return;
	if (security.enforceLogin(req, res, false)) return;

	// Render the index page.
	res.render('login.html');
};
