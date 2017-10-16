/**
	class voyc.Post
	@constructor
	One public method, post().
	Opens app and sends data.
*/
voyc.Post = function(name,url,local) {
	// is singleton
	if (voyc.Post._instance) return voyc.Post._instance;
	else voyc.Post._instance = this;

	this.url = url;
	if (window.location.href.indexOf('file:') > -1) {
		this.url = local;
	}
	this.name = name;
	this.win = null;
	this.queue = null;
	
	var self = this;
	this.sync = new voyc.Sync(function() {
		self.win.postMessage(self.queue, '*');
		self.queue = null;
	});
	window.addEventListener('message', function(evt) {
		if (evt.data == 'ack') {
			self.sync.set('open','ready');
		}
	}, false);
}

voyc.Post.prototype.post = function(data) {
	this.openWindow();
	this.postData(data);
}

voyc.Post.prototype.openWindow = function() {
	if (this.win && !this.win.closed) {
		console.log(this.name + 'already open');
		this.win.focus();
	}
	else {
		console.log('opening ' + this.name);
		this.win = window.open(this.url, this.name);
		this.sync.set('open', 'pending');
	}
}

voyc.Post.prototype.postData = function(data) {
	this.queue = data;
	this.sync.set('queue', 'ready');
}
