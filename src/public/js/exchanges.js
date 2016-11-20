var _exchanges;
var _moms = {};
var _inventory = {};
var _users = {};

var _loaded = 0;
var color_numbers = ["red", "white", "brown", "blue", "charcoal", "light_gray", "Other"];

$(document).ready(function() {
	// Get the exchanges.
	searchExchanges({ }, function(data) {
		_exchanges = data;
		populate();
	}, showError);

	// Get the moms.
	searchMoms({ }, function(data) {
		for (var i in data) {
			_moms[data[i]._id] = data[i];
		}
		populate();
	}, showError);

	// Get the items.
	searchItems({ }, function(data) {
		for (var i in data) {
			_inventory[data[i]._id] = data[i];
		}
		populate();
	}, showError);

	// Get the users.
	searchUsers({ }, function(data) {
		for (var i in data) {
			_users[data[i]._id] = data[i];
		}
		populate();
	}, showError);
});

function populate() {
	// Only run if all data has loaded.
	_loaded ++;
	if (_loaded < 4) return;

	// Sort the exchanges by date.
	_exchanges.sort(function(a, b) {
		return (a.date < b.date) ? 1 : -1;
	});

	// Add the exchanges.
	var counter = 0;
	for (var i in _exchanges) {
		// Limit to last 30 exchanges.
		counter ++;
		if (counter > 30) break;

		addExchange(_exchanges[i]);
	}
}

function addExchange(exchange) {
	var panel = $('<div class="panel panel-default" style="margin-top:2rem; border-bottom: 1px solid white;"></div>');
	var panelHeading = $('<div class="panel-heading"></div>');
	var panelBody = $('<div class="panel-body" style="display: inline-block; width: 100%;"></div>');

	var manager_container = $('<div class="inline_elements"></div>');
	var recipient_container = $('<div class="inline_elements" style="margin-left: calc(2vw);"></div>');

	// Get the fields.
	var user = _users[exchange.manager];
	var mom = _moms[exchange.recipient];
	var gave = exchange.yarn;
	var received = exchange.product;

	// Remove items that don't exist anymore.
	for (var i in gave) {
		if (!_inventory[gave[i][0]]) {
			gave.splice(i, 1);
			i --;
		}
	}
	for (var i in received) {
		if (!_inventory[received[i][0]]) {
			received.splice(i, 1);
			i --;
		}
	}

	var date = new Date(exchange.date);

	// Set the panel fields.
	manager_container.append('<h3>Manager</h3>');
	var headingName = $('<p></p>');
	headingName.text(user.name + ' ' + date.toLocaleDateString());
	manager_container.append(headingName);
	panelHeading.append(manager_container);

	var container_gave = $('<div class="inline_elements"></div>');
	var container_received = $('<div class="inline_elements"></div>');

	recipient_container.append('<h3>Recipient</h3>');
	var momName = $('<p></p>');
	momName.text(mom.name);
	recipient_container.append(momName);
	panelHeading.append(recipient_container)
	
	if (gave.length) {
		console.log(exchange.yarn);
		container_gave.append('<h3>Gave</h3>');
		var gaveList = createItemList(gave);
		container_gave.append(gaveList);
		panelBody.append(container_gave);
	}

	if (received.length) {
		container_received.append('<h3>Received</h3>');
		var receivedList = createItemList(received);
		container_received.append(receivedList);
		panelBody.append(container_received);
	}

	if (exchange.notes) {
		panelBody.append('<h3>Notes</h3>');
		var notes = $('<p></p>');
		notes.text(exchange.notes);
		panelBody.append(notes);
	}

	panelBody.append('<br><br>');

	// Construct the panel.
	panel.append(panelHeading);
	panel.append(panelBody);

	$('#exchanges').append(panel);
}

function createItemList(list) {
	var listElement = $('<div class="list-group"></div>');
	for (var i in list) {
		var item = _inventory[list[i][0]];
		if (!item) {
			continue;
		}
		var entry;
		switch (item.type) {
			case 0: entry = createYarnEntry(item, 'div'); break;
			case 1: entry = createHatEntry(item, 'div'); break;
			case 2: entry = createScarfEntry(item, 'div'); break;
			case 3: 
				var tag = 'div';
				if ($('#cozies div.yarn_color').last().hasClass(color_numbers[cupcozy.data.color])) {
					tag = "div class='inline_elements'"
				}
				entry = createCupCozyEntry(item, tag); break;
		}
		listElement.append(entry);
	}
	return listElement;
}
