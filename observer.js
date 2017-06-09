/**
	class Observer
	@constructor
	Passes Note objects from publishers to subscribers.
*/
voyc.Observer = function() {
	if (voyc.Observer._instance) return voyc.Observer._instance;
	voyc.Observer._instance = this;

	this.stack = [];
}

voyc.Observer.prototype = {
	subscribe: function(notename, subscriber, callback) {
		//console.log('note '+notename+' subscribed to by '+subscriber);
	
		// first time subscribed, create the callback-array
		if (!this.stack[notename]) {
			this.stack[notename] = [];
		}

		// add this callback to the callback-array for this notename
		this.stack[notename].push( {subscriber:subscriber, callback:callback});
	},

	publish: function(notename, publisher, payload) {
		var note = new voyc.Note(notename, publisher, payload);

		// if no one has subscribed to this notename, exit now
		if (!this.stack[note.name]) {
		   	console.log('note '+note.name+' published by '+note.publisher+' but unsubscribed');
			return;
		}
		
		// call each callback in the callback-array
		console.log('note '+note.name+' published by '+note.publisher);
		var callbackarray = this.stack[note.name];
		var cb,msg;
		var passing = [];
		passing.push(note);
		var self = this;
		setTimeout(function() {
			for (var i in callbackarray) {
				cb = callbackarray[i];
				console.log('note '+note.name+' published to subscriber '+cb.subscriber);
				cb.callback.apply(self, passing);
			}
		}, 0);
	}
}

/**
	class Note, as in Notification.
	@constructor
	A Note is passed from publisher to subscribers 
	by the Observer.
*/
voyc.Note = function(name, publisher, payload) {
	this.name = name,
	this.publisher = publisher,
	this.payload = payload,
	this.start = Date.now(),
	this.end = 0;
	this.elapsed = 0;
}

voyc.Note.prototype = {
	finish: function() {
		this.end = Date.now();
		this.elapsed = this.end - this.start;
	},
	toString: function() {
		var s = name
		return s;
	}
}
