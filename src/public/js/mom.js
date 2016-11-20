var _user;
var _mom;

$(document).ready(function() {
	// Get the current user's information.
	getCurrentUser(function(data) {
		_user = data;
	}, showError);

	// Get the mom.
	getMom();
	populateFields();
});

function getMom() {
	// Get the mom.
	searchMoms({ _id: _momId }, function(data) {
		if (data.length == 0) {
			window.location = '/';
			return;
		}

		_mom = data[0];

		populateFields();
	}, showError);
}


function populateFields() {
	document.title = _mom.name + ' | Tink Knit';

	// Set the name.
	$('#name').text(_mom.name);
	$('#picture').attr('id', 'picture-'+ _mom._id);

	getMomProfilePicture(_mom);

	// Set the editable fields.
	$('#email').val(_mom.data.email);
	$('#phone').val(_mom.data.phone);
	$('#organization').val(_mom.organization);
	$('#secondary-name').val(_mom.data.secondaryName);
	$('#secondary-phone').val(_mom.data.secondaryPhone);

	// Set the product types.
	if (_mom.data.products & 1 << 0) $('#hat').prop('checked', true);
	if (_mom.data.products & 1 << 1) $('#scarf').prop('checked', true);
	if (_mom.data.products & 1 << 2) $('#cupcozy').prop('checked', true);
	if (_mom.data.products & 1 << 3) $('#other').prop('checked', true);

	// Set other fields.
	if (_mom.data.supplier) $('#supplier').prop('checked', true);
	if (_mom.data.beginner) $('#beginner').prop('checked', true);

	// Get the manager.
	searchUsers({ _id: _mom.data.manager }, function(data) {
		if (data.length > 0) {
			$('#manager').text(data[0].name);
		} else {
			$('#manager').text('(None)');
		}
	}, showError);
}

// Claim button.
$('#claim').click(function() {
	// Disable the button.
	$('#claim').attr('disabled', true);

	// Set the data.
	var data = {
		manager: _user._id
	};

	// Update the mom.
	updateMom(_mom._id, data, function(data) {
		showMsg('Successfully claimed');
		$('#manager').text(_user.name);
		$('#claim').removeAttr('disabled');
	}, function(error) {
		showError(error);
		$('#claim').removeAttr('disabled');
	});
});

// Save button.
$('#save').click(function() {
	// Disable the button.
	$('#save').attr('disabled', true);

	// Get the field values.
	var email = $('#email').val().trim();
	var phone = $('#phone').val().trim();
	var organization = $('#organization').val().trim();
	var secondaryName = $('#secondary-name').val().trim();
	var secondaryPhone = $('#secondary-phone').val().trim();
	var products = 0;
	if ($('#hat').is(':checked')) products |= 1 << 0;
	if ($('#scarf').is(':checked')) products |= 1 << 1;
	if ($('#cupcozy').is(':checked')) products |= 1 << 2;
	if ($('#other').is(':checked')) products |= 1 << 3;
	var supplier = $('#supplier').is(':checked');
	var beginner = $('#beginner').is(':checked');

	// Set the data.
	var data = {
		email: email,
		phone: phone,
		organization: organization,
		secondaryName: secondaryName,
		secondaryPhone: secondaryPhone,
		products: products,
		supplier: supplier,
		beginner: beginner
	};

	// Update the mom.
	updateMom(_mom._id, data, function(data) {
		showMsg('Successfully updated');
		$('#save').removeAttr('disabled');
	}, function(error) {
		showError(error);
		$('#save').removeAttr('disabled');
	});
});

// Delete button.
$('#delete').click(function() {
	// Delete the mom.
	removeMom(_mom._id, function(data) {
		window.location = '/';
	}, showError);
});
