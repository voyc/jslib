#!/usr/bin/python2.4

import httplib, urllib, sys

# Define the parameters for the POST request and encode them in
# a URL-safe format.

url = 'http://jslib.voyc.com/'

arr = [
	('code_url', url + 'namespace.js'),
	('code_url', url + 'jslib.js'),
	('code_url', url + 'browserhistory.js'),
	('code_url', url + 'comm.js'),
	('code_url', url + 'cookie.js'),
	('code_url', url + 'session.js'),
	('code_url', url + 'dragger.js'),
	('code_url', url + 'observer.js'),
	('code_url', url + 'sketch.js'),
	('code_url', url + 'spinner.js'),
	('code_url', url + 'utils.js'),
	('code_url', url + 'voyclogo.js'),
	('compilation_level', 'ADVANCED_OPTIMIZATIONS'),
	('language', 'ECMASCRIPT5'),
	('output_format', 'text'),
	('output_info', 'compiled_code'),
]

if (len(sys.argv) > 1):
	arr.append(('formatting', 'pretty_print'))

params = urllib.urlencode(arr)

# Always use the following value for the Content-type header.
headers = { "Content-type": "application/x-www-form-urlencoded" }
conn = httplib.HTTPConnection('closure-compiler.appspot.com')
conn.request('POST', '/compile', params, headers)
response = conn.getresponse()
data = response.read()
print data
conn.close()
