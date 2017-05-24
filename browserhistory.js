/**
	class BrowserHistory
	@constructor
	singleton
	@param {string} [keyword='pageid'] Defines the key used in the url querystring.
			Example: http://mysite.com?keyword=pageid
	@param {function(string)} [onNavCallback] Function that sets the title and draws the page.
**/
voyc.BrowserHistory = function(keyword, onNavCallback) {
	// is singleton
	if (voyc.BrowserHistory._instance) return voyc.BrowserHistory._instance;
	else voyc.BrowserHistory._instance = this;

	this.keyword = keyword;
	this.onNavCallback = onNavCallback;
	this.bookmark = '';

	// on startup, we check for page request from bookmark
	var qstring = window.location.search;
	if (qstring.length > 0) {
		var pos = qstring.indexOf(this.keyword + '=');
		if (pos > -1) {
			pos += this.keyword.length + 1;
			this.bookmark = qstring.substring(pos);
		}
	}
}

// public function called by get the startup bookmark
voyc.BrowserHistory.prototype.getBookmark = function() {
	return this.bookmark;
}

// public function called by app to display a new page
voyc.BrowserHistory.prototype.nav = function(pageid) {
	if (!(window.location.protocol.indexOf('file') > -1)) {
		var url = '?' + this.keyword + '='+pageid
		window.history.pushState({'pageid':pageid}, '', url);
	}
	this.onNavCallback(pageid);
}

// called by windows on back button
window.onpopstate = function(event) {
	var pageid = (event['state']) ? event['state']['pageid'] : '';
	(new voyc.BrowserHistory()).onNavCallback(pageid);
}
