var constants = require('./constants');

/*
 * This file holds all of the functions related to security.
 */

/*
 * Redirects the user depending on their login state.
 *
 * @param req The request.
 * @param res The response.
 * @param state Whether the user should be logged in.
 *
 * @return A boolean representing whether the user was redirected.
 */
exports.enforceLogin = function(req, res, state) {
	var loggedIn = req.session && !(req.session.user == null);

	if (loggedIn && !state) {
		// If the user is logged in and they shouldn't be, redirect to dashboard.
		res.redirect('/dashboard');
		return true;
	}

	if (!loggedIn && state) {
		// If the user isn't logged in and they should be, redirect to index page.
		res.redirect('/');
		return true;
	}

	// No redirection necessary.
	return false;
};

/*
 * Enforces admin privileges and redirects users accordingly.
 *
 * @param req The request.
 * @param res The response.
 * @param state Whether the user should be an admin.
 *
 * @return A boolean representing whether the user was redirected.
 */
exports.enforceAdmin = function(req, res, state) {
	var admin = req.session.user && req.session.user.admin;

	if (admin && !state) {
		// If the user is an admin and they shouldn't be, redirect to admin page.
		res.redirect('/admin');
		return true;
	}

	if (!admin && state) {
		// If the user isn't an admin and they should be, redirect to index page.
		res.redirect('/');
		return true;
	}

	// No redirection necessary.
	return false;
};

/*
 * Gets the current user's type.
 *
 * @param req The request.
 *
 * @return 0: guest, 1: user, 2: admin.
 */
exports.getType = function(req) {
	if (!req.session.user) return 0;
	if (!req.session.user.admin) return 1;
	return 2;
};

/*
 * Enforces API privilieges.
 *
 * @param req The request.
 * @param res The response.
 * @param level Minimum privilege level (0: guest, 1: user, 2: admin).
 *
 * @return Whether the request is allowed.
 */
exports.enforce = function(req, res, level) {
	var type = exports.getType(req);
	if (type < level) {
		res.json({ error: constants.ERR_FORBIDDEN });
		return false;
	}
	return true;
};

/*
 * Removes < and > characters for sanitation.
 *
 * @param text The text to sanitize.
 *
 * @return The sanitized text.
 */
exports.sanitize = function(text) {
	return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
