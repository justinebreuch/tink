var constants = require('./include/constants'),
	utilities = require('./include/utilities'),
	engines = require('consolidate'),
	express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	mongoose = require('mongoose'),
	autoIncrement = require('mongoose-auto-increment');

var MongoStore = require('connect-mongo')(session);


/*** INIT ***/

// Connect to the tink database.
mongoose.connect(constants.DB_HOST);
var db = mongoose.connection;
db.on('error', utilities.err);

// Initialize auto-increment for the mongodb database.
autoIncrement.initialize(mongoose.connection);

// Create express server.
var app = express();
app.engine('html', engines.hogan); // Use hogan to render dynamic pages.
app.set('views', constants.TEMPLATES_DIR); // Get templates from the template directory.
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' })); // Parse application/x-www-form-urlencoded.
app.use(bodyParser.json({ limit: '10mb' })); // Parse application/json.
app.use(express.static(constants.PUBLIC_DIR)); // Serve static files.
app.use(cookieParser()); // Parse cookies.
app.use(session({ // Save session data.
	store: new MongoStore({
		url: constants.SESSION_STORE
	}),
	proxy: true,
	resave: true,
	saveUninitialized: true,
	secret: constants.SESSION_SECRET
}));

var routes = {
	user: require('./include/routes/user'),
	mom: require('./include/routes/mom'),
	page: require('./include/routes/page'),
	admin: require('./include/routes/admin'),
	manager: require('./include/routes/manager'),
	inventory: require('./include/routes/inventory'),
	exchange: require('./include/routes/exchange'),
	utilities: require('./include/routes/utilities')
};


/*** API ROUTES ***/

app.post('/api/register', utilities.isolate.bind(routes.user.register));
app.post('/api/login', utilities.isolate.bind(routes.user.login));
app.get('/api/current_user', utilities.isolate.bind(routes.user.currentUser));
app.post('/api/update_user', utilities.isolate.bind(routes.user.update));
app.post('/api/remove_user', utilities.isolate.bind(routes.user.remove));
app.post('/api/search_users', utilities.isolate.bind(routes.user.search));

app.post('/api/create_mom', utilities.isolate.bind(routes.mom.create));
app.post('/api/update_mom', utilities.isolate.bind(routes.mom.update));
app.post('/api/remove_mom', utilities.isolate.bind(routes.mom.remove));
app.post('/api/search_moms', utilities.isolate.bind(routes.mom.search));

app.post('/api/create_item', utilities.isolate.bind(routes.inventory.create));
app.post('/api/remove_item', utilities.isolate.bind(routes.inventory.remove));
app.post('/api/search_items', utilities.isolate.bind(routes.inventory.search));
app.post('/api/change_item', utilities.isolate.bind(routes.inventory.change));

app.post('/api/create_exchange', utilities.isolate.bind(routes.exchange.create));
app.post('/api/search_exchanges', utilities.isolate.bind(routes.exchange.search));

app.post('/api/upload', utilities.isolate.bind(routes.utilities.upload));


/*** ADMIN ROUTES ***/

app.get('/admin', utilities.isolate.bind(routes.admin.index));


/*** MANAGER ROUTES ***/

app.get('/dashboard', utilities.isolate.bind(routes.manager.index));
app.get('/exchange', utilities.isolate.bind(routes.manager.exchange));
app.get('/exchanges', utilities.isolate.bind(routes.manager.exchanges));
app.get('/mom/:id', utilities.isolate.bind(routes.manager.mom));
app.get('/manager/:id', utilities.isolate.bind(routes.manager.manager));


/*** SITE ROUTES ***/

app.get('/', utilities.isolate.bind(routes.page.index));
app.get('/logout', utilities.isolate.bind(routes.user.logout));
app.get('/settings', utilities.isolate.bind(routes.user.settings));


/*** POST-INIT ***/

// Wait for the database to connect.
db.once('open', function() {
	// Start listening.
	app.listen(constants.PORT, function() {
		utilities.log('Listening on port ' + constants.PORT);
	});
});
