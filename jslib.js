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
	new BrowserHistory('name', function(pageid) {
		document.title = 'jslib Test ' + pageid
		document.getElementById('pageid').innerHTML = 'This is page: ' + (pageid || 'home') + '.';
	});
	$('genghis').addEventListener('click', function(event) {
		(new BrowserHistory).nav('genghis');
	}, false);
	$('winston').addEventListener('click', function(event) {
		(new BrowserHistory).nav('winston');
	}, false);

	// test comm
	comm = new Comm('http://guru.hagstrand.com/svc/');
	$('echotest').addEventListener('click', function(evt) {
		var a = {
			data: $("xinput").value,
			stress: '0'
		}
		comm.request('echo', a, function(ok, response, o) {
			if (ok) {
				$("xoutput").value = response['echo'];
			}
		});
	}, false);

	// test cookie.  Works only from server.
	Cookie.set('test', '42');
	var test = Cookie.get('test');
	Cookie.delete('test');
	console.log('cookie test ' + ((test == '42') ? 'passed' : 'failed'));

	// test dragger
	dragger = new Dragger();
	dragger.enableDrag($("redsquare"));

	// test observer
	observer = new Observer();
	observer.subscribe( 'testnotification', 'subscriber', function(note) {
		console.log('received testnotification ' + note.payload['x']);
	});
	$('testobserver').addEventListener('click', function(event) {
		observer.publish(new Note('testnotification', 'publisher', {x:'homer', y:'jethro'}));
	}, false);

	// test sketch
	sketch = new Sketch($('sketchpad'));
	sketch.draw();
	$('clear-btn').addEventListener('click', function(event) {
		sketch.clear();
	}, false);

	// test sound
	var urlpattern = 'a/%sound%.mp3';
	var fxfiles = [
		'explosionshort',
		'klunk',
	];
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var context = new AudioContext();
	sound = new Sound(context);
	sound.loadSounds(urlpattern, fxfiles, function() {
		$('msg').innerHTML = 'loaded';
	});
	$('btnExplosionShort').addEventListener('click', function() { 
		sound.play( 'explosionshort');
	}, false);
	$('btnKlunk').addEventListener('click', function() { 
		sound.play( 'klunk');
	}, false);
	
	// test spinner
	var spinner = new Spinner($('spinner'));
	spinner.draw();
	spinner.spin();
	$('togglespinner').addEventListener('click', function(evt) {
		spinner.toggle();
	}, false);
	
	// test utils
	var x = $('togglespinner');
	appendScript('cookie.js');
	var b = isArray([1,2,3]);
	var a = cloneArray(['a','b','c']);
	var o = clone({a:1,b:2,c:[4,5,6],x:'xyz'});
	center($('redsquare'), window);
	var pos = getAbsolutePosition($('redsquare'));
	var s = dumpObject({a:1,b:2,c:[4,5,6],x:'xyz'});
	var t = prepString("We're so $1 to hear about your recent $2.", ['thrilled', 'misfortune'], null);
	removeWhiteSpace($('commtest'));
	loadCss('http://minimal.hagstrand.com/theme/mahagony.css');
	unloadCss('http://minimal.hagstrand.com/theme/mahagony.css');
	isCssLoaded('http://minimal.hagstrand.com/theme/mahagony.css');
	toggleCss('http://minimal.hagstrand.com/theme/mahagony.css');
	toggleAttribute($('redsquare'), 'xyz', 'offen');
	
	console.log('onload complete');
}, false)
