voyc.$ = function(s) {
	return document.getElementById(s);
}

voyc.appendScript = function(file) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = file;
	document.getElementsByTagName("head")[0].appendChild(script);
}

voyc.prepString = function(s, a, o) {
	// s = "We're so $1 to hear about your recent $2."
	// a = ['thrilled', 'misfortune'];
	// o = optional associative array of strings keyed by the values in a
	var target = s;
	var sub, pattern;
	if (typeof(a) != 'undefined') {
		for (var i=0; i<a.length; i++) {
			pattern = new RegExp('\\$'+(i+1), 'g');
			sub = (o) ? o[a[i]] : a[i];
			target = target.replace(pattern, sub);
		}
	}
	return target;
}

/**
	array utilities
**/

voyc.isArray = function(a) {
	return (Object.prototype.toString.call(a) === '[object Array]');
}

voyc.cloneArray = function(a) {
	var n = [];
	for(var i=0; i<a.length; i++) {
		n[i]=a[i];
	}
	return n;
}

voyc.printArray = function(a,br,max) {
	var max = max || 10000;
	var br = br || '<br/>';
	var ashort = a.splice(0,max); // trim
	var s = ashort.join(br);
	return s;
}

voyc.shuffleArray = function(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

voyc.subtractArray = function(arrayplus, arrayminus) {
	array = []
	var n = arrayplus.length
	for (var i=0; i<n; i++)
		array[i] = arrayplus[i] - arrayminus[i]
	return array
}

/**
	object utilities
**/

voyc.clone = function(obj) {
	if (voyc.isArray(obj)) {
		return voyc.cloneArray(obj);
	}
	var newObj={};
	for(i in obj) {
		if (obj[i]&&typeof obj[i]=="object") {
			newObj[i]=voyc.clone(obj[i]);
		}
		else if (voyc.isArray(obj[i])) {
			newObj[i]=voyc.cloneArray(obj[i]);
		}
		else {
			newObj[i]=obj[i];
		}
	}
	return newObj;
}

voyc.merge = function(obj1, obj2) {
	for (var i in obj2) {
		if (typeof obj2[i] == "object") {
			obj1[i] = voyc.clone(obj2[i]);
		}
		else if (voyc.isArray(obj2[i])) {
			obj1[i] = voyc.cloneArray(obj2[i]);
		}
		else {
			obj1[i] = obj2[i];
		}
	}
}

/**
	DOM utilities
**/

voyc.getAbsolutePosition = function(e) {
	var x = 0;
	var y = 0;
	if (e.offsetParent)
	{
		while (e.offsetParent) {
			y += e.offsetTop
			x += e.offsetLeft
			e = e.offsetParent;
		}
	}
	else if (e.x) {
		x += e.x;
		y += e.y;
	}
	return {x:x,y:y};
}

voyc.center = function(elem, container) {
	// center a div within a container
	var g = elem;
	g.style.margin = 'auto auto';
	var gHt = g.offsetHeight;
	var gWid = g.offsetWidth;

	var f = container;
	var fHt = f.offsetHeight;
	var fWid = f.offsetWidth;

	// center horizontally
	var w = fWid - gWid;
	if (w) {
		var left = Math.floor(w / 2);
		var pct = Math.floor((left/fWid) * 100);
		g.style.margin = 'auto ' + pct + '%';
	}

	// center vertically
	var h = fHt - gHt;
	if (h) {
		var top = Math.floor(h / 2);
		g.style.top = top + 'px';
	}
}

voyc.removeWhiteSpace = function(node) {
	for (var i=0; i<node.childNodes.length; i++) {
		var child = node.childNodes[i];
		if(child.nodeType == 3 && !/\S/.test(child.nodeValue)) {
			node.removeChild(child);
			i--;
		}
		if(child.nodeType == 1) {
			voyc.removeWhiteSpace(child);
		}
	}
}


voyc.findParentWithTag = function(elem, tag) {
	var parent = null;
	for ( var e=elem; e && e !== document; e = e.parentNode ) {
		if (e.tagName.toLowerCase() == tag.toLowerCase()) {
			parent = e;
		}
	}
	return parent;
}

voyc.toggleAttribute = function(elem, attr, value, boo) {
	var boo = (typeof(boo) == 'undefined') ? elem.hasAttribute(attr) : boo;
	if (boo) {
		elem.setAttribute(attr,value);
	}
	else {
		elem.removeAttribute(attr);
	}
}

voyc.show = function(elem, boo) {
	if (boo)
		elem.classList.remove('hidden')
	else
		elem.classList.add('hidden')
}

/**
	CSS utilities
**/
voyc.loadCss = function(filename) {
	var css = document.createElement('link');
	css.setAttribute('rel', 'stylesheet');
	css.setAttribute('type', 'text/css');
	css.setAttribute('href', filename);
	document.getElementsByTagName('head')[0].appendChild(css);
}

voyc.unloadCss = function(filename) {
	var a = document.getElementsByTagName('link')
	for (var c,h,i=a.length-1; i>=0; i--) {
		c = a[i];
		h = c.getAttribute('href');
		if (h && h.indexOf(filename) != -1)	{
			c.parentNode.removeChild(c);
		}
	}
}

voyc.isCssLoaded = function(filename) {
	var a = document.getElementsByTagName('link')
	for (var c,h,i=a.length-1; i>=0; i--) {
		c = a[i];
		h = c.getAttribute('href');
		if (h && h.indexOf(filename) != -1)	{
			return true;
		}
	}
	return false;
}

voyc.toggleCss = function(filename) {
	if (voyc.isCssLoaded(filename)) {
		voyc.unloadCss(filename);
	}
	else {
		voyc.loadCss(filename);
	}
}

/**
	Math utilities
**/
voyc.round = function(x,precis) {
	// see https://dustinpfister.github.io/2020/06/15/js-math-round/
	var f = (10**precis)
	return Math.round(x*f)/f
}

voyc.clamp = function(x,min,max) {
	return Math.round(Math.min(max, Math.max(min, x)));
}

voyc.interpolate = function(x, imin, imax, omin, omax) {
	//(r-omin)/(omax-omin) = (x-imin)/(imax-imin)
	return (((x-imin)/(imax-imin)) * (omax-omin)) + omin
}
