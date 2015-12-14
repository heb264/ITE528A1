/**
 * Phonegap DatePicker Plugin Copyright (c) Greg Allen 2011 MIT Licensed
 * Reused and ported to Android plugin by Daniel van 't Oever
 */

/**
 * Constructor
 */
function DatePicker() {
  //this._callback;
}

/**
 * show - true to show the ad, false to hide the ad
 */
DatePicker.prototype.show = function(options, cb) {
  	
	if (options.date) {
		options.date = (options.date.getMonth() + 1) + "/" + 
					   (options.date.getDate()) + "/" + 
					   (options.date.getFullYear()) + "/" + 
					   (options.date.getHours()) + "/" + 
					   (options.date.getMinutes());
	}

	var defaults = {
		mode : 'date',
		date : '',
		minDate: 0,
		maxDate: 0,
		doneButtonLabel: "Done",
		cancelButtonLabel: "Cancel",
		clearButtonLabel: "Clear",
		clearButton: false,
		cancelButton: false,
		windowTitle: "[default]"
	};
	
	for (var key in defaults) {
		if (typeof options[key] !== "undefined") {
			defaults[key] = options[key];
		}
	}
	
	//this._callback = cb;
	
	var callback = function(message) {
		if ( message == "clear" || message == "cancel" || message == "CANCEL") {
			cb(message);
		} else {
			cb(new Date(message));
		}
	}
  
	cordova.exec(callback, 
		null, 
		"DatePickerPlugin", 
		defaults.mode,
		[defaults]
	);
};

var datePicker = new DatePicker();
module.exports = datePicker;

// Make plugin work under window.plugins
if (!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.datePicker) {
    window.plugins.datePicker = datePicker;
}