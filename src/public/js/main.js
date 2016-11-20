
COLORS = ['<div class="yarn_color red"> </div>',
		  '<div class="yarn_color white"> </div>',
		  '<div class="yarn_color brown"> </div>',
		  '<div class="yarn_color blue"> </div>',
		  '<div class="yarn_color charcoal"> </div>',
		  '<div class="yarn_color light_gray"> </div>',
		  '<p class="inline_elements">Other</p>'];


// For scrolling to an element on page.
(function($) {
    $.fn.goTo = function() {
		if ($(document).scrollTop() > $(this).offset().top) {
			$('html, body').animate({
				scrollTop: $(this).offset().top + 'px'
			}, 'fast');
		}
        return this;
    }
})(jQuery);

/*
 * Shows a message.
 *
 * @param msg The message text.
 */
function showMsg(msg) {
	$('#msg').text(msg);
	$('#error').hide();
	$('#msg').show();
	$('#msg').goTo();
}

/*
 * Shows an error.
 *
 * @param error The error text.
 */
function showError(error) {
	$('#error').text('Error: ' + error);
	$('#msg').hide();
	$('#error').show();
	$('#error').goTo();
}

/*
 * Gets a file's base 64 contents.
 *
 * @param input File input object.
 * @param callback Function to call when contents have been read.
 */
function getFile(input, callback) {
	// Create a file upload element.
	var file = input.files[0];
	if (file) {
		var reader = new FileReader();
		reader.onload = function(evt) {
			this.callback(this.file.name, btoa(evt.target.result));
		}.bind({ file: file, callback: callback });
		reader.readAsBinaryString(file);
	} else {
		callback(null, null);
	}
}

/*
 * Creates a yarn entry.
 *
 * @param yarn Yarn object.
 * @param tag Tag to use to wrap the entry.
 */
function createYarnEntry(yarn, tag) {
	var entry = $('<' + tag + ' class="list-group-item inventory_item"></' + tag + '>');
	var name = $('<p class="inline_elements"></p>');
	name.text(yarn.name);
	var section = $('<p class="list-group-item-text"></p>');
	section.append(getYarnColor(yarn));
	section.append(name);
	entry.append(section);
	return entry;
}

function getYarnColor(yarn) {
	var color = $('<em></em>');
	color.html(COLORS[yarn.data.color]);
	return color;
}

function getHatColor(section, hat) {
	var color1 = $('<em></em>');
	color1.html(COLORS[hat.data.color1]);
	var color2 = $('<em></em>');
	color2.html(COLORS[hat.data.color2]);
	var color3 = $('<em></em>');
	color3.html(COLORS[hat.data.pom]);
	section.append(color1);
	section.append(color2);
	section.append(color3);
}

function getScarfColor(scarf, tag) {
	var colorList = []
	var colors = scarf.data.colors;
	for (var i in colors) {
		colorList.push(COLORS[colors[i]]);
	}
	colorList.sort();
	var colors = $('<em></em>');
	colors.html(colorList.join(''));
	return colors
}

function getCozyColor(cupcozy) {
	var color = $('<em></em>');
	color.html(COLORS[cupcozy.data.color]);
	return color;
}

/*
 * Creates a hat entry.
 *
 * @param hat Hat object.
 * @param tag Tag to use to wrap the entry.
 */
function createHatEntry(hat, tag) {
	var entry = $('<' + tag + ' class="list-group-item inventory_item"></' + tag + '>');
	var section = $('<p class="list-group-item-text"></p>');
	getHatColor(section, hat);
	var brim = $('<span></span>');
	brim.text((hat.data.brim == 1) ? 'Closed' : 'Open');
	section.append(brim);
	section.append(' Brim Hat');
	entry.append(section);
	return entry;
}

/*
 * Creates a scarf entry.
 *
 * @param scarf Scarf object.
 * @param tag Tag to use to wrap the entry.
 */
function createScarfEntry(scarf, tag) {
	var entry = $('<' + tag + ' class="list-group-item inventory_item"></' + tag + '>');
	var section = $('<p class="list-group-item-text"></p>');
	var colors = getScarfColor(scarf, tag);
	section.append(colors);
	section.append('Scarf');
	entry.append(section);
	return entry;
}

/*
 * Creates a cup cozy entry.
 *
 * @param cupcozy Cup cozy object.
 * @param tag Tag to use to wrap the entry.
 */
function createCupCozyEntry(cupcozy, tag) {
	var entry = $('<' + tag + ' class="list-group-item inventory_item"></' + tag + '>');
	var section = $('<p class="list-group-item-text"></p>');
	section.append(getCozyColor(cupcozy));
	section.append('Cozy');
	entry.append(section);
	return entry;
}

/*
 * Click events
 */
$(document).ready(function() {

	// back button that leads to the dashboard page
	$('.back').click(function(event) {
		// makes modal disappear
		$(this).closest('.modal').fadeOut(100);
		$('#main').show();
	});

	// makes things selectable
	$('.selectable').click(function(event) {
		if ($(this).prop('tagName') == "P") {
			$(this).toggleClass('selected_underline');
		} else {
			$(this).toggleClass('selected');
		}
	});
});

/*
 * Dismisses the modal and scrolls to the top of the page
 */
function dismissModal() {
	$('#main').show();
	$("html, body").animate({ scrollTop: 0 }, "slow");
}

// Gets the profile picture for a mom
function getMomProfilePicture(mom) {
	// Set the picture.
	if (mom.data.picture) {
		$('#picture-'+ mom._id).css('background-image', 'url(/imgs/uploads/' + mom.data.picture + ')');
	} else {
		$('#picture-' + mom._id).css('background-image', 'url(/imgs/fill_circle.png)');
	}
}

/*
 * Checks if a device is mobile.
 */
function checkMobile() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}
