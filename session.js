/**
    class Session
		static class, not instantiated
		contains three static methods: set, get, delete
		
		We use this object to share the session-id across subdomains.
		Presently it is implemented using domain cookies.
		sessionStorage does NOT work across subdomains at this time. May 2016
**/
voyc.Session = function () {
}

/** @enum */
voyc.Method = {
	COOKIE:1,
	SESSIONSTORAGE:2
}

voyc.Session.settings = {
	method: voyc.Method.SESSIONSTORAGE
}

voyc.Session.set = function(name, value) {
	if (voyc.Session.settings.method == voyc.Method.COOKIE) {
		voyc.Cookie.set(name, value, null, '', voyc.Session.getRootDomain(), '');
	}
	else if (voyc.Session.settings.method == voyc.Method.SESSIONSTORAGE){
		sessionStorage.setItem(name, value);
	}
}

voyc.Session.get = function(name) {
	var value = '';
	if (voyc.Session.settings.method == voyc.Method.COOKIE) {
		value = voyc.Cookie.get(name);
	}
	else if (voyc.Session.settings.method == voyc.Method.SESSIONSTORAGE){
		value = sessionStorage.getItem(name);
	}
	return value;
}

voyc.Session.delete = function(name) {
	if (voyc.Session.settings.method == voyc.Method.COOKIE) {
		voyc.Cookie.delete(name);
	}
	else if (voyc.Session.settings.method == voyc.Method.SESSIONSTORAGE){
		sessionStorage.removeItem(name);
	}
}

voyc.Session.getRootDomain = function() {
	var dm = document.domain;
	var a = dm.split('.');
	var len = a.length;
	var r = '';
	if (len >= 2) {
		r = a[len-2] + '.' + a[len-1]
	}
	return r;
}
