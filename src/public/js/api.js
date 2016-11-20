function apiCallback(data) {
	if (data.error) return this.error(data.error);
	this.success(data);
}

/* ===== USERS ===== */

/*
 * Register a new user.
 *
 * @param name Name of the user.
 * @param email Email address of the user.
 * @param password Password of the user.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function register(name, email, password, success, error) {
	$.ajax({
		url: '/api/register',
		data: {
			name: name,
			email: email,
			password: password
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/*
 * Login as an existing user.
 *
 * @param email Email address of the user.
 * @param password Password of the user.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function login(email, password, success, error) {
	$.ajax({
		url: '/api/login',
		data: {
			email: email,
			password: password
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/*
 * Get the current user's data.
 *
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function getCurrentUser(success, error) {
	$.ajax({
		url: '/api/current_user',
		method: 'GET',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/*
 * Update a user's information.
 *
 * @param id User ID.
 * @param fields Fields to be updated.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function updateUser(id, fields, success, error) {
	$.ajax({
		url: '/api/update_user',
		data: {
			id: id,
			fields: JSON.stringify(fields)
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/*
 * Remove a user.
 *
 * @param id User ID.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function removeUser(id, success, error) {
	$.ajax({
		url: '/api/remove_user',
		data: {
			id: id
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/*
 * Search users.
 *
 * @param filter The filter to apply.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function searchUsers(filter, success, error) {
	$.ajax({
		url: '/api/search_users',
		data: {
			filter: JSON.stringify(filter)
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/* ===== MOMS ===== */

/*
 * Create a new mom.
 *
 * @param name Name of the mom.
 * @param organization Organization the mom belongs to.
 * @param data Other data.
 */
function createMom(name, organization, data, success, error) {
	$.ajax({
		url: '/api/create_mom',
		data: {
			name: name,
			organization: organization,
			data: JSON.stringify(data)
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/*
 * Update a mom's information.
 *
 * @param id Mom ID.
 * @param fields Fields to be updated.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function updateMom(id, fields, success, error) {
	$.ajax({
		url: '/api/update_mom',
		data: {
			id: id,
			fields: JSON.stringify(fields)
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/*
 * Remove a mom.
 *
 * @param id Mom ID.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function removeMom(id, success, error) {
	$.ajax({
		url: '/api/remove_mom',
		data: {
			id: id
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/*
 * Search moms.
 *
 * @param filter The filter to apply.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function searchMoms(filter, success, error) {
	$.ajax({
		url: '/api/search_moms',
		data: {
			filter: JSON.stringify(filter)
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/* ===== ITEMS ===== */

/*
 * Create a new item.
 *
 * @param type The type of item (0: Yarn, 1: Hat, 2: Scarf, 3: Cup Cozy).
 * @param name The name of the item.
 * @param data Data associated with the item.
 * @param amount The amount of the item.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function createItem(type, name, data, amount, success, error) {
	$.ajax({
		url: '/api/create_item',
		data: {
			type: type,
			name: name,
			data: JSON.stringify(data),
			amount: amount
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/*
 * Remove an item.
 *
 * @param id Item ID.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function removeItem(id, success, error) {
	$.ajax({
		url: '/api/remove_item',
		data: {
			id: id
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/*
 * Search items.
 *
 * @param filter The filter to apply.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function searchItems(filter, success, error) {
	$.ajax({
		url: '/api/search_items',
		data: {
			filter: JSON.stringify(filter)
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/*
 * Change the amount of an item.
 *
 * @param id The id of the item.
 * @param mode The way to change the amount (0: set, 1: add).
 * @param amount The amount to change to/by.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function changeItem(id, mode, amount, success, error) {
	$.ajax({
		url: '/api/change_item',
		data: {
			id: id,
			mode: mode,
			amount: amount
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/* ===== EXCHANGES ===== */

/*
 * Create a new exchange.
 *
 * @param recipient The recipient of the exchange.
 * @param manager The manager doing the exchange.
 * @param yarn The ids and amounts of yarn being exchanged.
 * @param product The ids and amounts of product being exchanged.
 * @param notes Notes taken.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function createExchange(recipient, manager, yarn, product, notes, success, error) {
	$.ajax({
		url: '/api/create_exchange',
		data: {
			recipient: recipient,
			manager: manager,
			yarn: JSON.stringify(yarn),
			product: JSON.stringify(product),
			notes: notes
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/*
 * Search exchanges.
 *
 * @param filter The filter to apply.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function searchExchanges(filter, success, error) {
	$.ajax({
		url: '/api/search_exchanges',
		data: {
			filter: JSON.stringify(filter)
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/* ===== UTILITIES ===== */

/*
 * Upload a file to the server.
 *
 * @param data Base64 data.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function upload(data, success, error) {
	if (data.length == 0) return success({ id: '' });

	$.ajax({
		url: '/api/upload',
		data: {
			data: data
		},
		method: 'POST',
		dataType: 'json',
		success: apiCallback.bind({ success: success, error: error })
	});
}

/* ===== SPECIFIC ITEMS ===== */

/*
 * Create a new yarn.
 *
 * @param name Name of the yarn.
 * @param color Color of the yarn.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function createYarn(name, color, success, error) {
	createItem(0, name, { color: color }, 0, success, error);
}

/*
 * Create a new yarn.
 *
 * @param name Name of the yarn.
 * @param color Color of the yarn.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function createYarn(name, color, success, error) {
	createItem(0, name, { color: color }, 0, success, error);
}

/*
 * Create a new hat.
 *
 * @param color1 Base color.
 * @param color2 Stripe color.
 * @param pom Pom pom color.
 * @param brim Brim open vs closed (0: Open, 1: Closed).
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function createHat(color1, color2, pom, brim, success, error) {
	var data = {
		color1: color1,
		color2: color2,
		pom: pom,
		brim: brim
	};
	createItem(1, 'Hat', data, 0, success, error);
}

/*
 * Create a new scarf.
 *
 * @param colors Colors (array).
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function createScarf(colors, success, error) {
	createItem(2, 'Scarf', { colors: colors }, 0, success, error);
}

/*
 * Create a new cup cozy.
 *
 * @param color Color of the cup cozy.
 * @param success Function to be called if succeeded.
 * @param error Function to be called if there is an error.
 */
function createCupCozy(color, success, error) {
	createItem(3, 'Cup Cozy', { color: color }, 0, success, error);
}

