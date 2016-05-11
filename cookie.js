/**
    class Cookie
		static class, not instantiated
		contains three static methods
			Cookie.set( name, value)
			Cookie.get( name)
			Cookie.delete( name)
**/
voyc.Cookie = function() {
}

/**
	@param {string} name
	@param {string} value
	@param {Object} [expires=null]
	@param {string} [path='']
	@param {string} [domain='']
	@param {string} [secure='']
*/
voyc.Cookie.set = function(name, value, expires, path, domain, secure) {
  var sname = name;
  // default to six months
  if (!expires) {
    var now = new Date();
    now.setTime(now.getTime() + 180 * 24 * 60 * 60 * 1000);
    expires = now;
  }

  document.cookie= sname + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
}

voyc.Cookie.get = function(name) {
  var sname = name;
  var dc = document.cookie;
  var prefix = sname + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1)
  {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
  }
  else
  {
      begin += 2;
  }
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
  {
      end = dc.length;
  }
  return unescape(dc.substring(begin + prefix.length, end));
}

/**
	@param {string} name
	@param {string} [path='']
	@param {string} [domain='']
*/
voyc.Cookie.delete = function(name, path, domain) {
  var sname = name;
  if (voyc.Cookie.get(sname))
  {
      document.cookie = sname + "=" + 
          ((path) ? "; path=" + path : "") +
          ((domain) ? "; domain=" + domain : "") +
          "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
}
