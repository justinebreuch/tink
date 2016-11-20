var _user;

var _momPictureData = '';


$(document).ready(function() {
	// Get the current user's information.
	getCurrentUser(function(data) {
		_user = data;
		
		// Set name.
		$('#account-name').val(_user.name);
		$('#account-name').css("color", "#A7A7A7");

		// Set phone number.
		$('#account-phone').val(_user.phone);
		$('#account-phone').css({ 'color': '#A7A7A7'});

		// Get the list of moms.
		updateMoms();

	}, showError);

	// Update the inventory.
	updateInventory();

	// Update modals
	updateModals();

});

function addGestures(type, item) {
	var inputs = $('#' + type + ' input.form-control.values');
	if (checkMobile()) inputs.attr('disabled', true);

	inputs.eq(inputs.length-1).add( new Hammer.Tap({ event: 'press', time: 1 }) );
	

	// remove from inventory
	Hammer(inputs[inputs.length-1]).on("press", function() {
		console.log("remove");
		// Remove the item.
		removeItem(this.item._id, function(data) {
			updateInventory();
		}, showError);
	}.bind({ item: item }));
	
	//change inventory
	inputs.eq(inputs.length-1).on("change", swipeHandler.bind({ item: item, input: inputs.eq(inputs.length-1), direction: 0 }));

	// change inventory on mobile
	if (checkMobile()) {
		Hammer(inputs[inputs.length-1]).on("swiperight", swipeHandler.bind({ item: item, input: inputs.eq(inputs.length-1), direction: 1 }));
	} else {
		inputs.eq(inputs.length-1).on("click", swipeHandler.bind({ item: item, input: inputs.eq(inputs.length-1), direction: 1 }));
	}

	Hammer(inputs[inputs.length-1]).on("swipeleft", swipeHandler.bind({ item: item, input: inputs.eq(inputs.length-1), direction: -1 }));


}

function updateModals() {
	// add color options to modals
	$('.color_options').html($("<div class='yarn_color red selectable' value='0'> </div><div class='yarn_color white selectable' value='1'> </div><div class='yarn_color brown selectable' value='2'> </div><div class='yarn_color blue selectable' value='3'> </div><div class='yarn_color charcoal selectable' value='4'> </div><div class='yarn_color light_gray selectable' value='5'> </div><p class='selectable inline_elements' value='6'>Other</p>"));
	// hide modals
	$('.panel').hide();
}

function updateMoms() {
	// Empty the list.
	$('#moms').empty();

	// Get the list of moms.
	searchMoms({ }, function(data) {
		// Sort the list of moms.
		data.sort(function(a, b) {
			return a.name > b.name;
		});

		// Add moms to list.
		for (var i in data) {
			addMom(data[i]);
			getMomProfilePicture(data[i]);
		}
	}, showError);
}

function addMom(mom) {
	var entry = $('<a class="list-group-item"> </a>');
	if (mom.data.manager == _user._id) {
		var picture = $("<div class='picture small_picture' id='picture-" + mom._id + "'></div>");
		var name = $('<p> </p>');
		name.text(mom.name);
		entry.append(picture);
		entry.append(name);
	} else {
		entry.text(mom.name);
	}

	// Go to that mom when clicked.
	entry.click(function() {
		window.location = '/mom/' + this._id;
	}.bind(mom));

	$('#moms').append(entry);
}

function updateInventory() {
	// Empty the lists.
	$('#yarns').empty();
	$('#hats').empty();
	$('#scarves').empty();
	$('#cupcozies').empty();

	// Get the list of items.
	searchItems({ }, function(data) {
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

function createInventoryCounter(item) {
	var wrapper = $('<div class="input-group"></div>');
	var input = $('<input type="text" class="form-control values">');
	input.val(item.amount);
	wrapper.append(input);	
	return wrapper;
}

// if left is true swipe is left, if false, swipe is right
function swipeHandler(){
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

function addYarn(yarn) {
	var entry = createYarnEntry(yarn, 'div');
	
	var counter = createInventoryCounter(yarn);
	counter.prependTo(entry);

	$('#yarns').append(entry);
	addGestures('yarns', yarn);
}

function addHat(hat) {
	var entry = createHatEntry(hat, 'div');

	var counter = createInventoryCounter(hat);
	counter.prependTo(entry);

	$('#hats').append(entry);
	addGestures('hats', hat);
}

function addScarf(scarf) {
	var entry = createScarfEntry(scarf, 'div');

	var counter = createInventoryCounter(scarf);
	counter.prependTo(entry);

	$('#scarves').append(entry);
	addGestures('scarves', scarf);
}

function addCupCozy(cupcozy) {
	var entry = createCupCozyEntry(cupcozy, 'div');

	var counter = createInventoryCounter(cupcozy);
	counter.prependTo(entry);

	$('#cupcozies').append(entry);
	addGestures('cupcozies', cupcozy);

}

// gets the color selected
function getSelectedColor(type) {
	var selected = $('#' + type + '_options .selected');
	var color = [];

	// default is Other
	if (selected.length == 0) {
		color = 6
	} else {
		for (var i = 0; i < selected.length; i++) {
			color.push(parseInt(selected.eq(i).attr('value')));
		}	
	}
	return color;
}

// Update account button.
$('#account-update').click(function() {
	// Disable the button.
	$('#account-update').attr('disabled', true);

	// Get the field values.
	var name = $('#account-name').val().trim();
	var phone = $('#account-phone').val().trim();
	var password = $('#account-password').val();

	//Create the fields.
	var fields = {
		name: name,
		phone: phone
	};

	// Add the password if it's not empty.
	if (password.length > 0) fields.password = password;

	// Update the account info.
	updateUser(_user._id, fields, function(data) {
		$('#account-update').removeAttr('disabled');
	}, function(error) {
		showError(error);
		$('#account-update').removeAttr('disabled');
	});
});

// Mom picture button.
$('#mom-picture').change(function() {
	getFile($('#mom-picture')[0], function(name, data) {
		_momPictureData = data;
	});
});

// opens the modal for the button (button must have id such that the
//	modal to appear is {id}-create-panel)
$('.open_modal').click(function(event) {
	$('#' + $(this).attr('id') + '-create-panel').show();
	$('#main').hide();
});

// Create mom button.
$('#mom-create').click(function() {
	// Disable the button.
	$('#mom-create').attr('disabled', true);

	// Get the field values.
	var name = $('#mom-name').val().trim();
	var email = $('#mom-email').val().trim();
	var phone = $('#mom-phone').val().trim();
	var address = $('#mom-address').val().trim();
	var zip = $('#mom-zip').val().trim();
	var birthday = $('#mom-birthday').val().trim();
	var nationality = $('#mom-nationality').val().trim();
	var ethnicity = $('#mom-nationality').val().trim();
	var secondaryName = $('#mom-secondary-name').val().trim();
	var secondaryPhone = $('#mom-secondary-phone').val().trim();
	var organization = $('#mom-organization').val().trim();
	var aok = $('#mom-aok').val().trim();
	var occupation = $('#mom-occupation').val().trim();
	var education = $('#mom-education').val().trim();
	var income = $('#mom-income').val().trim();
	var car = $('#mom-car').is(':checked');
	var deposit = ($('#mom-deposit-check').is(':checked') ? 1 : 0);

	// Create the data field.
	var data = {
		email: email,
		phone: phone,
		address: address,
		zip: zip,
		birthday: birthday,
		nationality: nationality,
		ethnicity: ethnicity,
		secondaryName: secondaryName,
		secondaryPhone: secondaryPhone,
		aok: aok,
		occupation: occupation,
		education: education,
		income: income,
		car: car,
		deposit: deposit,
		products: 0,
		supplier: false,
		beginner: false,
		manager: _user._id
	};

	// Upload the picture.
	upload(_momPictureData, function(data) {
		// Save the picture name.
		this.data.picture = data.id;

		// Create the mom. Dismiss modal, scroll to the top.
		createMom(this.name, this.organization, this.data, function(data) {
			$('#mom-create').closest('.modal').fadeOut(100);
			dismissModal();
			$('#mom-create').removeAttr('disabled');
			updateMoms();
		}, function(error) {
			showError(error);
			$('#mom-create').removeAttr('disabled');
		});
	}.bind({ name: name, organization: organization, data: data }), function(error) {
		showError(error);
		$('#mom-create').removeAttr('disabled');
	});
});

// Create yarn button.
$('#yarn-create').click(function() {
	// Disable the button.
	$('#yarn-create').attr('disabled', true);

	// Get the field values.
	var name = $('#yarn-name').val().trim();

	// first color selected is the color
	var color = getSelectedColor('yarn_color')[0];
	
	// Create the new yarn type.
	createYarn(name, color, function(data) {
		$('#yarn-create').removeAttr('disabled');
		updateInventory();
		$('#yarn-create').closest('.modal').fadeOut(100);
		dismissModal();
	}, function(error) {
		showError(error);
		$('#yarn-create').removeAttr('disabled');
	});
});

// Create hat button.
$('#hat-create').click(function() {
	// Disable the button.
	$('#hat-create').attr('disabled', true);

	// Get the field values.
	var color1 = getSelectedColor('base_color')[0];
	var color2 = getSelectedColor('stripe_color')[0];
	var color3 = getSelectedColor('pom_pom_color')[0];
	var brim = ($('#hat-brim').is(':checked') ? 1 : 0);

	// Create the new hat type.
	createHat(color1, color2, color3, brim, function(data) {
		$('#hat-create').closest('.modal').fadeOut(100);
		dismissModal();
		$('#hat-create').removeAttr('disabled');
		updateInventory();
	}, function(error) {
		showError(error);
		$('#hat-create').removeAttr('disabled');
	});
});

// Create scarf button.
$('#scarf-create').click(function() {
	// Disable the button.
	$('#scarf-create').attr('disabled', true);

	// Get the field values.
	var colors = getSelectedColor('scarf_color');

	// Create the new scarf type.
	createScarf(colors, function(data) {
		$('#scarf-create').closest('.modal').fadeOut(100);
		dismissModal();
		$('#scarf-create').removeAttr('disabled');
		updateInventory();
	}, function(error) {
		showError(error);
		$('#scarf-create').removeAttr('disabled');
	});
});

// Create cup cozy button.
$('#cupcozy-create').click(function() {
	// Disable the button.
	$('#cupcozy-create').attr('disabled', true);

	// Get the field values.
	var color = getSelectedColor('cupcozy_color');

	// Create the new cupcozy type.
	createCupCozy(color, function(data) {
		$('#cupcozy-create').closest('.modal').fadeOut(100);
		dismissModal();
		$('#cupcozy-create').removeAttr('disabled');
		updateInventory();
	}, function(error) {
		showError(error);
		$('#cupcozy-create').removeAttr('disabled');
	});
});

// Logout button.
$('#logout').click(function() {
	window.location = '/logout';
});
