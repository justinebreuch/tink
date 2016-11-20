var _user;

$(document).ready(function() {
	// Get the current user's information.
	getCurrentUser(function(data) {
		_user = data;
		
		// Set name.
		$('#account-name').val(_user.name);

		// Set phone number.
		$('#account-phone').val(_user.phone);
	}, showError);

	// Get the list of users.
	updateUsers();

	// update modals
	updateModals();
});


function updateModals() {
	// hide modals
	$('.panel').hide();
}

function updateUsers() {
	// Empty the list.
	$('#users').empty();

	// Get the list of users.
	searchUsers({ admin: false }, function(data) {
		// Add users to list.
		for (var i in data) {
			addUser(data[i]);
		}
	}, showError);
}

function addUser(user) {
	var entry = $('<div class="list-group-item inline_elements"></div>');
	var name = $('<p class="inline_elements"></p>');
	
	name.text(user.name);
	entry.append(name);

	var remove = $('<button class="btn btn-sm btn-danger inline_elements" style="width: 60px; border: none; margin-left: calc(2vw);">Remove</button>');
	remove.click(function() {
		// Remove the user.
		removeUser(this._id, function(data) {
			showMsg('Successfully removed user');
			updateUsers();
		}, showError);
	}.bind(user));
	entry.append(remove);

	$('#users').append(entry);
}


$('#new_user').click(function(event) {
	$('.panel').show();
	$('#main').hide();
});

// Update account button.
$('#account-update').click(function() {
	// Disable the button.
	$('#account-update').attr('disabled', true);

	// Get the field values.
	var name = $('#account-name').val().trim();
	var phone = $('#account-phone').val().trim();
	var password = $('#account-password').val();

	// Create the fields.
	var fields = {
		name: name,
		phone: phone
	};

	// Add the password if it's not empty.
	if (password.length > 0) fields.password = password;

	// Update the account info.
	updateUser(_user._id, fields, function(data) {
		showMsg('Successfully updated');
		$('#account-update').removeAttr('disabled');
	}, function(error) {
		showError(error);
		$('#account-update').removeAttr('disabled');
	});
});

// Create new user button.
$('#user-create').click(function() {
	// Disable the button.
	$('#user-create').attr('disabled', true);

	// Get the field values.
	var name = $('#user-name').val().trim();
	var email = $('#user-email').val().trim();
	var password = $('#user-password').val();

	// Register the account.
	register(name, email, password, function(data) {
		showMsg('Successfully created');
		$('#user-create').removeAttr('disabled');
		updateUsers();
	}, function(error) {
		showError(error);
		$('#user-create').removeAttr('disabled');
	});
});

// Logout button.
$('#logout').click(function() {
	window.location = '/logout';
});
