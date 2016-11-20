$('#login').click(function(event) {
	// Prevent it from doing form things.
	event.preventDefault();

	// Get the email and password.
	var email = $('#email').val().trim();
	var password = $('#password').val();

	// Disable the login button.
	$('#login').attr('disabled', true);

	// Try to login.
	login(email, password, function() {
		location.reload();
	}, function(error) {
		showError(error);
		$('#login').removeAttr('disabled');
	});
});
