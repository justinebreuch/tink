var _user;

var _addList;
var _giving = {};
var _receiving = {};

var color_numbers = ["red", "white", "brown", "blue", "charcoal", "light_gray", "Other"];

$(document).ready(function() {
	// Get the current user's information.
	getCurrentUser(function(data) {
		_user = data;

		// Get the list of moms.
		updateMoms();

		// Update the inventory.
		updateInventory();

	}, showError);

	$( "#inventory-modal" ).hide();
	
});

function updateMoms() {
	// Empty the list.
	$('#recipient').empty();

	// Get the list of moms.
	searchMoms({ 'data.manager': _user._id }, function(data) {
		// Add moms to list.
		for (var i in data) {
			addMom(data[i], i);
		}
	}, showError);
}

function addMom(mom) {
	var entry = $('<option></option>');
	entry.attr('value', mom._id);
	entry.text(mom.name);

	$('#recipient').append(entry);
}

function updateInventory() {
	// Empty the list.
	$('#inventory').empty();
	$('#inventory').append('<div id="yarns"><h3>Yarn</h3></div>');
	$('#inventory').append('<div id="hats"><h3>Hats (Base, Stripe, Pom pom)</h3></div>');
	$('#inventory').append('<div id="scarves"><h3>Scarves</h3></div>');
	$('#inventory').append('<div id="cozies"><h3>Cup Cozies</h3></div>');

	// Get the list of items.
	searchItems({ }, function(data) {
		// Sort the data by type (yarn > hats > scarves > cup cozies).
		// then by color 
		data.sort(function(a, b) {
			if (a.type != b.type) {
		        return a.type - b.type;
		    } else {
		        return a.data.color - b.data.color;
		    }
		});

		// Add items to lists.
		for (var i in data) {
			switch (data[i].type) {
				case 0: addYarn(data[i]); break;
				case 1: addHat(data[i]); break;
				case 2: addScarf(data[i]); break;
				case 3: addCupCozy(data[i]); break;
			}
		}

	}, showError);

	
}

function addGestures(item) {
	console.log("ges");
	var inputs = $('input.values');
	if (checkMobile()) inputs.attr('disabled', true);

	inputs.eq(inputs.length-1).add( new Hammer.Tap({ event: 'press', time: 1 }) );

	// // remove from inventory
	Hammer(inputs[inputs.length-1]).on("press", function() {
		console.log("remove");
		// Remove the item.
		if (_addList == 0) {
			$(this.element).closest('.inventory_item').fadeOut(500);
			delete(_giving[this.item._id]);
		} else{
			$(this.element).closest('.inventory_item').fadeOut(500);
			delete(_receiving[this.item._id]);
		}
	}.bind({ item: item, element:inputs[inputs.length - 1] }));

	//change inventory on desktop
	inputs.eq(inputs.length-1).on("change", swipeHandler.bind({ item: item, input: inputs.eq(inputs.length-1), direction: 0 }));

	// change inventory on mobile
	if (checkMobile()) {
		Hammer(inputs[inputs.length-1]).on("swiperight", swipeHandler.bind({ item: item, input: inputs.eq(inputs.length-1), direction: 1 }));
	} else {
		inputs.eq(inputs.length-1).on("click", swipeHandler.bind({ item: item, input: inputs.eq(inputs.length-1), direction: 1 }));
	}

	Hammer(inputs[inputs.length-1]).on("swipeleft", swipeHandler.bind({ item: item, input: inputs.eq(inputs.length-1), direction: -1 }));

}

function addYarn(yarn) {
	var entry = createYarnEntry(yarn, 'div');
	entry.attr('class', 'inventory_item');
	entry.attr('id', 'modal-' + yarn._id);
	$('#yarns').append(entry);

	// Add to appropriate list when clicked.
	entry.click(function() {
		addToList(this, createYarnEntry);
		$('.modal').fadeOut(100);
		dismissModal();
		addGestures(this);
	}.bind(yarn));
}

function addHat(hat) {
	var entry = createHatEntry(hat, 'div');
	entry.attr('class', 'inventory_item');
	entry.attr('id', 'modal-' + hat._id);
	$('#hats').append(entry);

	// Add to appropriate list when clicked.
	entry.click(function() {
		addToList(this, createHatEntry);
		$('.modal').fadeOut(100);
		dismissModal();
		addGestures(this);
	}.bind(hat));
}

function addScarf(scarf) {
	var entry = createScarfEntry(scarf, 'div');
	entry.attr('class', 'inventory_item');
	entry.attr('id', 'modal-' + scarf._id);
	$('#scarves').append(entry);

	// Add to appropriate list when clicked.
	entry.click(function() {
		addToList(this, createScarfEntry);
		$('.modal').fadeOut(100);
		dismissModal();
		addGestures(this);
	}.bind(scarf));
}

function addCupCozy(cupcozy) {
	var entry = createCupCozyEntry(cupcozy, 'div');

	entry.attr('class', 'inventory_item');
	
	entry.attr('id', 'modal-' + cupcozy._id);
	$('#cozies').append(entry);

	// Add to appropriate list when clicked.
	entry.click(function() {
		addToList(this, createCupCozyEntry);
		$('.modal').fadeOut(100);
		dismissModal();
		addGestures(this);
	}.bind(cupcozy));
}

function createInventoryCounter(item) {
	var wrapper = $('<div class="input-group"></div>');
	var input = $('<input type="text" class="form-control values counter">');
	input.val(0);
	
	wrapper.append(input);

	return wrapper;
}

// if left is true swipe is left, if false, swipe is right
function swipeHandler(){
	console.log(this);
	var amount = this.input.val();

	if (isNaN(amount)) amount = 0;
	else amount = parseInt(amount) + this.direction;

	// Can't have negative amount.
	if (amount < 0) amount = 0;
	
	this.input.val(amount);

	// Save the amount.
	changeItem(this.item._id, 0, amount, function(data) {
	}, showError);
}

function addToList(item, create) {

	// Create the entry.            
	var entry = create(item);
	entry.attr('id', 'list-' + item._id);

	// Add the counter.
	entry.prepend(createInventoryCounter(item));

	// Add the item to the appropriate list.
	if (_addList == 0) {
		$('#giving').append(entry);
		_giving[item._id] = 0;
	} else{
		$('#receiving').append(entry);
		_receiving[item._id] = 0;
	}

}

function setDisabled() {
	// Set everything enabled.
	$('#inventory').children().removeClass('disabled');
	$('#inventory').children().removeAttr('disabled');

	// Disable entries that have already been chosen.
	for (var id in _giving) {
		$('#modal-' + id).addClass('disabled');
		$('#modal-' + id).attr('disabled', true);
	}
	for (var id in _receiving) {
		$('#modal-' + id).addClass('disabled');
		$('#modal-' + id).attr('disabled', true);
	}
}

// Add to giving button.
$('#giving-add').click(function() {
	// Set which list to add to.
	_addList = 0;
	
	$('#inventory-modal').show();
	$('#main').hide();
	
	// Set disabled elements.
	setDisabled();

});


// Add to receiving button.
$('#receiving-add').click(function() {
	// Set which list to add to.
	_addList = 1;

	$('#inventory-modal').show();
	$('#main').hide();
	
	// Set disabled elements.
	setDisabled();
});

// Save button.
$('#save').click(function() {
	// Disable the button.
	$('#save').attr('disabled', true);

	// Get the field values.
	var recipient = parseInt($('#recipient').val());
	var giving = [];
	for (var i in _giving) {
		var val = $('#list-' + i + ' .counter').val();
		if (isNaN(val)) {
			val = 0;
		} else {
			val = parseInt(val);
		}

		// No negative values.
		if (val < 0) {
			val = 0;
		}

		giving.push([i, val]);
	}
	var receiving = [];
	for (var i in _receiving) {
		var val = $('#list-' + i + ' .counter').val();
		if (isNaN(val)) {
			val = 0;
		} else {
			val = parseInt(val);
		}

		// No negative values.
		if (val < 0) {
			val = 0;
		}

		receiving.push([i, val]);
	}
	var notes = $('#notes').val();

	// Save the exchange.
	createExchange(recipient, _user._id, giving, receiving, notes, function(data) {
		showMsg('Successfully saved, redirecting back to dashboard...');
		setTimeout(function() {
			window.location = '/';
		}, 2000);
	}, function(error) {
		showError(error);
		$('#save').removeAttr('disabled');
	});
});
