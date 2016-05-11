/**
	jslib.js
	used with index.html for testing
**/

var comm = null;
var dragger = null;
var observer = null;
var sketch = null;
var sound = null;
var spinner = null;

addEventListener('load', function(event) {
	console.log('onload');

	// test browserhistory.  Works only from server.
	new voyc.BrowserHistory('name', function(pageid) {
		document.title = 'jslib Test ' + pageid
		document.getElementById('pageid').innerHTML = 'This is page: ' + (pageid || 'home') + '.';
	});
	voyc.$('genghis').addEventListener('click', function(event) {
		(new voyc.BrowserHistory).nav('genghis');
	}, false);
	voyc.$('winston').addEventListener('click', function(event) {
		(new voyc.BrowserHistory).nav('winston');
	}, false);

	// test comm
	comm = new voyc.Comm('http://guru.hagstrand.com/svc/');
	voyc.$('echotest').addEventListener('click', function(evt) {
		var a = {
			data: voyc.$("xinput").value,
			stress: '0'
		}
		comm.request('echo', a, function(ok, response, o) {
			if (ok) {
				voyc.$("xoutput").value = response['echo'];
			}
		});
	}, false);

	// test cookie.  Works only from server.
	Cookie.set('test', '42');
	var test = Cookie.get('test');
	Cookie.delete('test');
	console.log('cookie test ' + ((test == '42') ? 'passed' : 'failed'));

	// test dragger
	dragger = new voyc.Dragger();
	dragger.enableDrag(voyc.$("redsquare"));

	// test observer
	observer = new voyc.Observer();
	observer.subscribe( 'testnotification', 'subscriber', function(note) {
		console.log('received testnotification ' + note.payload['x']);
	});
	voyc.$('testobserver').addEventListener('click', function(event) {
		observer.publish(new voyc.Note('testnotification', 'publisher', {x:'homer', y:'jethro'}));
	}, false);

	// test sketch
	sketch = new voyc.Sketch(voyc.$('sketchpad'));
	sketch.draw();
	voyc.$('clear-btn').addEventListener('click', function(event) {
		sketch.clear();
	}, false);

	// test spinner
	var spinner = new voyc.Spinner(voyc.$('spinner'));
	spinner.draw();
	spinner.spin();
	voyc.$('togglespinner').addEventListener('click', function(evt) {
		spinner.toggle();
	}, false);
	
	// test utils
	var x = voyc.$('togglespinner');
	voyc.appendScript('cookie.js');
	var b = voyc.isArray([1,2,3]);
	var a = voyc.cloneArray(['a','b','c']);
	var o = voyc.clone({a:1,b:2,c:[4,5,6],x:'xyz'});
	voyc.center(voyc.$('redsquare'), window);
	var pos = voyc.getAbsolutePosition(voyc.$('redsquare'));
	var s = voyc.dumpObject({a:1,b:2,c:[4,5,6],x:'xyz'});
	var t = voyc.prepString("We're so $1 to hear about your recent $2.", ['thrilled', 'misfortune'], null);
	voyc.removeWhiteSpace(voyc.$('commtest'));
	voyc.loadCss('http://minimal.hagstrand.com/theme/mahagony.css');
	voyc.unloadCss('http://minimal.hagstrand.com/theme/mahagony.css');
	voyc.isCssLoaded('http://minimal.hagstrand.com/theme/mahagony.css');
	voyc.toggleCss('http://minimal.hagstrand.com/theme/mahagony.css');
	voyc.toggleAttribute(voyc.$('redsquare'), 'xyz', 'offen');
	
	console.log('onload complete');
}, false)
