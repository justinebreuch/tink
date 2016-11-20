/*
 * This file holds all the constant values for the server.
 */

/*** NETWORK ***/
exports.DB_HOST = 'mongodb://localhost/tink';
exports.PORT = 80;
exports.PUBLIC_DIR = 'public';
exports.TEMPLATES_DIR = 'templates';
exports.UPLOADS_DIR = 'uploads';
exports.SESSION_STORE = 'mongodb://localhost/tink-sessions';
exports.SESSION_SECRET = 'THIS_IS_A_SECRET_DO_NOT_SHARE';

/*** SECURITY ***/
exports.PWD_HASH = 'sha256';
exports.PWD_DIGEST = 'hex';

/*** ERRORS ***/
exports.ERR_FORBIDDEN = 'forbidden action';
exports.ERR_DOES_NOT_EXIST = 'user/mom does not exist';
exports.ERR_USER_EXISTS = 'user exists';
exports.ERR_INVALID_LOGIN = 'invalid login';
exports.ERR_NO_SUCH_ITEM = 'no such item';
exports.ERR_INVALID_FILE = 'invalid file';
