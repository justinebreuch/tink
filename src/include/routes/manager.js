var constants = require('../constants'),
	security = require('../security');

/*
 * This file holds all the routes for manipulating managers.
 */

/*
 * Dashboard page.
 */
exports.index = function(req, res) {
	if (security.enforceAdmin(req, res, false)) return;
	if (security.enforceLogin(req, res, true)) return;

	res.render('dashboard.html');
}

/*
 * Exchange page.
 */
exports.exchange = function(req, res) {
	if (security.enforceAdmin(req, res, false)) return;
	if (security.enforceLogin(req, res, true)) return;

	res.render('exchange.html');
}

/*
 * Exchanges page.
 */
exports.exchanges = function(req, res) {
	if (security.enforceAdmin(req, res, false)) return;
	if (security.enforceLogin(req, res, true)) return;

	res.render('exchanges.html');
}

/*
 * Mom page.
 */
exports.mom = function(req, res) {
	if (security.enforceLogin(req, res, true)) return;

	if (!req.params.id) {
		res.redirect('/');
	}

	res.render('mom.html', { mom: parseInt(req.params.id) });
}

/*
 * Manager page.
 */
exports.manager = function(req, res) {
	if (security.enforceLogin(req, res, true)) return;

	if (!req.params.id) {
		res.redirect('/');
	}

	res.render('manager.html', { manager: parseInt(req.params.id) });
}

