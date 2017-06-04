/**
	class voyc.Sync
	@constructor
	Maintains a list of events and a callback function.
	Each event is a name and a state.
	When all events are at state 'ready', the callback function is executed.
*/
voyc.Sync = function (cb) {
	this.events = {};
	this.callback = function() {};
	this.setup(cb);
}

voyc.Sync.prototype.setup = function( cb) {
	this.events = {};
	this.callback = cb;
}

voyc.Sync.prototype.clear = function() {
	this.setup(null);
}

voyc.Sync.prototype.set = function(name, state) {
	this.events[name] = state;
	if (this.countState('ready') == this.count()) {
		this.callback();
	}
}

voyc.Sync.prototype.get = function(name, state) {
	return this.events[name];
}

voyc.Sync.prototype.countState = function(state) {
	var cnt = 0;
	for (var k in this.events) {
		if (this.events[k] == state) {
			cnt++;
		}
	}
	return cnt;
}

voyc.Sync.prototype.count = function() {
	return Object.keys(this.events).length;
}
