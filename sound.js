
// http://www.html5rocks.com/en/tutorials/webaudio/intro/

function Sound(context) {
	this.context = context;  // AudioContext
	this.bufferList = {};
	this.loadCount = 0;
	this.loadedCount = 0;
	this.cb = null;
}

// load array of sound files
Sound.prototype.loadSounds = function(urlpattern, a, cb) {
	this.cb = cb;
	this.loadCount = a.length;
	var url;
	for (var sound in a) {
		url = urlpattern.replace('%sound%', a[sound]);
		this.loadSound(url, a[sound]);
	}
}

// load one sound file
Sound.prototype.loadSound = function(url, name) {
	// read sound file from url
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	var loader = this;

	request.onload = function() {
		// Asynchronously decode the audio file data in request.response
		loader.context.decodeAudioData(
			request.response,
			function(buffer) {
				if (!buffer) {
					alert('error decoding file data: ' + url);
					return;
				}
				loader.bufferList[name] = buffer;

				loader.loadedCount++;
				if (loader.loadCount == loader.loadedCount) {
					loader.cb();
				}
			},
			function(error) {
				console.error('decodeAudioData error', error);
			}
		);
	}

	request.onerror = function() {
		alert('Sound: XHR error');
	}

	request.send();
}

Sound.prototype.play = function(name) {
	var source = this.context.createBufferSource(); // creates a sound source
	source.buffer = this.bufferList[name];          // tell the source which sound to play
	source.connect(this.context.destination);       // connect the source to the context's destination (the speakers)
	source.start(0);                                // play the source now
											        // note: on older systems, may have to use deprecated noteOn(time);
}
