var constants = require('../constants'),
	security = require('../security'),
	model = require('../model'),
	crypto = require('crypto');

/*
 * This file holds all the route functions for user manipulation.
 */

/*
 * Register new user.
 *
 * @param name Name of the new user.
 * @param email Email address of the new user.
 * @param password Password of the new user.
 */
exports.register = function(req, res) {
	this.req = req;
	this.res = res;
	this.result = {};

	if (!security.enforce(req, res, 2)) return;

	// Get the parameters from the request body.
	this.name = req.body.name.trim();
	this.email = req.body.email.trim().toLowerCase();
	this.password = req.body.password;

	// Check if the user already exists.
	model.User.find({ email: this.email }, function(err, result) {
		if (result.length) {
			// User already exists.
			this.result.error = constants.ERR_USER_EXISTS;
		} else {
			// User doesn't exist, so let's make it.
			var newUser = new model.User();
			newUser.name = this.name;
			newUser.email = this.email;
			newUser.password = crypto
				.createHash(constants.PWD_HASH)
				.update(this.password)
				.digest(constants.PWD_DIGEST);
			newUser.admin = false;

			// Save the new user.
			newUser.save();
		}

		// Send back the response.
		this.res.json(this.result);
	}.bind(this));
};

/*
 * Logs a user in.
 *
 * @param email Email address of the user.
 * @param password Password of the user.
 */
exports.login = function(req, res) {
	this.req = req;
	this.res = res;
	this.result = {};

	// Get the parameters from the request body.
	this.email = req.body.email.trim().toLowerCase();
	this.password = crypto
		.createHash(constants.PWD_HASH)
		.update(req.body.password)
		.digest(constants.PWD_DIGEST);

	// Verify the login information.
	model.User.find({ email: this.email, password: this.password }, function(err, result) {
		if (result.length) {
			// Correct login information, so set the session to the user.
			this.req.session.user = result[0];
		} else {
			// Incorrect login information.
			this.result.error = constants.ERR_INVALID_LOGIN;
		}

		// Send back the response.
		this.res.json(this.result);
	}.bind(this));
};

/*
 * Logs out.
 */
exports.logout = function(req, res) {
	req.session.destroy();

	// Send the user back to the home page.
	res.redirect('/');
};

/*
 * Settings page.
 */
exports.settings = function(req, res) {
	// if (security.enforceAdmin(req, res, false)) return;
	// if (security.enforceLogin(req, res, false)) return;

	// Render the settings page.
	res.render('settings.html');
};

/*
 * Gets the current user.
 */
exports.currentUser = function(req, res) {
	this.req = req;
	this.res = res;
	this.result = {};

	if (!security.enforce(req, res, 1)) return;

	// Find the user.
	model.User.find({ _id: req.session.user._id }, function(err, result) {
		if (result.length) {
			this.result = result[0];
			
			// Update the user in the session.
			this.req.session.user = this.result;

			// Sanitize the result.
			for (field in this.result) {
				if (this.result[field] instanceof String) {
					this.result = security.sanitize(this.result);
				}
			}
		}

		// Send back the response.
		this.res.json(this.result);
	}.bind(this));
};

/*
 * Updates a user.
 *
 * @param id Id of the user to update.
 * @param fields Fields of the user to update with their values.
 */
exports.update = function(req, res) {
	this.req = req;
	this.res = res;
	this.result = {};

	if (!security.enforce(req, res, 1)) return;

	// Update the user.
	model.User.find({ _id: req.body.id }, function(err, result) {
		this.type = 'user';
		if (result.length) updateUser.bind(this)(err, result);
	}.bind(this));
	model.Mom.find({ _id: req.body.id }, function(err, result) {
		this.type = 'mom';
		if (result.length) updateUser.bind(this)(err, result);
	}.bind(this));
}

/*
 * Helper function for updating a user.
 */
function updateUser(err, result) {
	// Verify that this is allowed.
	if (this.req.session.user.admin ||
		this.req.session.user._id == this.req.body.id ||
		this.type == 'mom') {
		this.req.body.fields = JSON.parse(this.req.body.fields);
		for (field in this.req.body.fields) {
			// Don't allow changing the email.
			if (field == 'email') continue;

			// Don't allow changing other people's passwords.
			if (this.req.session.user._id != this.req.body.id && field == 'password') continue;

			// If the field is the password, encrypt it first.
			if (field == 'password') {
				this.req.body.fields[field] = crypto
					.createHash(constants.PWD_HASH)
					.update(this.req.body.fields[field])
					.digest(constants.PWD_DIGEST);
			}

			// Change the field.
			result[0][field] = this.req.body.fields[field];
		}

		// Save the user.
		result[0].save(function() {
			this.res.json(this.result);
		}.bind(this));
	} else {
		this.result.error = constants.ERR_FORBIDDEN;
		this.res.json(this.result);
	}
}

/*
 * Removes a user.
 *
 * @param id The id of the user.
 */
exports.remove = function(req, res) {
	this.req = req;
	this.res = res;
	this.result = {};

	if (!security.enforce(req, res, 2)) return;

	// Get the id.
	this.id = parseInt(req.body.id);

	// Find the user.
	model.User.find({ _id: this.id }, function(err, result) {
		if (result.length) {
			result[0].remove(function() {
				this.res.json(this.result);
			}.bind(this));
		} else {
			this.result.error = constants.ERR_DOES_NOT_EXIST;
			this.res.json(this.result);
		}
	}.bind(this));
}

/*
 * Searches for users given a filter.
 *
 * @param filter The filter to use when searching for users.
 */
exports.search = function(req, res) {
	this.req = req;
	this.res = res;

	if (!security.enforce(req, res, 1)) return;

	// Get the filter.
	var filter = JSON.parse(req.body.filter);

	// Find all users.
	model.User.find(filter, function(err, result) {
		this.res.json(result);
	}.bind(this));
}
