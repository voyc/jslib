#!/usr/bin/python2.4

import httplib, urllib, sys

# Define the parameters for the POST request and encode them in
# a URL-safe format.

params = urllib.urlencode([
	('code_url', 'http://jslib.hagstrand.com/jslib.js'),
	('code_url', 'http://jslib.hagstrand.com/browserhistory.js'),
	('code_url', 'http://jslib.hagstrand.com/comm.js'),
	('code_url', 'http://jslib.hagstrand.com/cookie.js'),
	('code_url', 'http://jslib.hagstrand.com/dragger.js'),
	('code_url', 'http://jslib.hagstrand.com/note.js'),
	('code_url', 'http://jslib.hagstrand.com/observer.js'),
	('code_url', 'http://jslib.hagstrand.com/sketch.js'),
	('code_url', 'http://jslib.hagstrand.com/sound.js'),
	('code_url', 'http://jslib.hagstrand.com/spinner.js'),
	('code_url', 'http://jslib.hagstrand.com/utils.js'),
	('code_url', 'http://jslib.hagstrand.com/voyclogo.js'),
	('compilation_level', 'ADVANCED_OPTIMIZATIONS'),
	('language', 'ECMASCRIPT5'),
	('output_format', 'text'),
	('output_info', 'compiled_code'),
	#('formatting', 'pretty_print'),
])

# Always use the following value for the Content-type header.
headers = { "Content-type": "application/x-www-form-urlencoded" }
conn = httplib.HTTPConnection('closure-compiler.appspot.com')
conn.request('POST', '/compile', params, headers)
response = conn.getresponse()
data = response.read()
print data
conn.close()
