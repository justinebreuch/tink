var colors = require('colors'),
	constants = require('./constants'),
	crypto = require('crypto');

/*
 * Simple node utilities for the server.
 */

/*
 * Logs output to stdout.
 *
 * @param msg Message to output.
 */
exports.log = function(msg) {
	console.log(' - LOG:'.yellow, msg);
}

/*
 * Logs an error to stderr.
 *
 * @param err Error to output.
 */
exports.err = function(err) {
	console.error(' - ERR:'.red, err);
}

/*
 * Save a file to the uploads directory.
 *
 * @param contents Base64 raw data.
 * @param callback Function to call when the upload is finished.
 *
 * @return Name of the file.
 */
exports.upload = function(contents, callback) {
	var id = crypto.createHash('md5').update(contents).digest('hex');
	require('fs').writeFile(constants.UPLOADS_DIR + '/' + id, contents, 'base64', function(err) {
		this.callback(err, this.id);
	}.bind({ callback: callback, id: id }));
}

/*
 * Isolate an express function by giving it its own this object.
 * 
 * @param req The request.
 * @param res The response.
 */
exports.isolate = function(req, res) {
	this.bind({ })(req, res);
}
