// return a multi-line string display of an object's members
// uses recursion to display hierarchy of embedded objects
voyc.dumpObject = function(obj,level) {
	incIndent = function() {
		numIndent++;
		indentstr = composeIndentStr(numIndent);
	}
	decIndent = function() {
		numIndent--;
		indentstr = composeIndentStr(numIndent);
	}
	composeIndentStr = function(num) {
		var s = '';
		for (var i=0; i<num; i++) {
			s += "&nbsp;&nbsp;&nbsp;"
		}
		return s;
	}
	dumpObjectR = function(obj) {
		var t;
		for (var x in obj) {
			t = obj[x];
			if (typeof(t) == "string") {
				t = '&apos;' + t + '&apos;';
			}
			if (typeof(t) == "object" && numIndent<level) {
				str += indentstr+x+"= {<br/>";
				incIndent();
				dumpObjectR(t);
				decIndent();
				str += indentstr+"}<br/>";
			}
			else {
				str += indentstr+x+"="+t+"<br/>";
			}
		}
	}
	var numIndent = 0;
	var indentstr = '';
	var str = '';
	dumpObjectR(obj);
	return str;
}

// return a multi-line string display of an HTML element's members
voyc.dumpElement = function(e) {
	var str = 'event type ' + e.type + '<br/>';
	var a = []
	for (var x in e)
		a.push(x)
	a.sort()
	var x,t;
	var goodtypes = ['boolean', 'number', 'string']
	var badtypes = ['function', 'object']
	for (var i in a) {
		x = a[i]
		t = e[x];
		if (x == x.toUpperCase())
			continue
		if (badtypes.includes(typeof(t)))
			t = typeof(t)
		str += x+": "+t+"<br/>";
	}
	return str;
}

// examine the bubbling of events through the hierarchy of overlaid elements 
// parental hierarchy - child of child of child, last child is on the bottom 
// display order - last child is displayed last, "on top"
// bubbling up - up the parental hierarchy 
// target = bottom of the hierarchy, on top of the display, first to feel the touch
// currentTarget = current element as the event bubbles up the hierarchy
debugEventBubbling = function(event, parent, level) {
	composeIndentStr = function(num) {
		var s = ''
		for (var i=0; i<num; i++)
			s += "+"
		return s
	}
	function logevent(e,r) {
		var cx = e.pageX 
		var cy = e.pageY
		if (e.currentTarget != window) {
			cx -= e.currentTarget.offsetLeft 
			cy -= e.currentTarget.offsetTop 
		}
		var current = 'unmatched'
		if (e.currentTarget == window) 
			current = 'window'
		else if (e.currentTarget.id == '')
			current = e.currentTarget.offsetParent.id
		else
			current = e.currentTarget.id



		var x = e.pageX - e.target.offsetLeft 
		var y = e.pageY - e.target.offsetTop 
		var target = 'unmatched'
		if (e.target == window) 
			target = 'window'
		else if (e.target.id == '')
			target = e.target.offsetParent.id
		else
			target = e.target.id

		var s = composeIndentStr(r) 
		console.log([r, s, current,cx,cy, target,x,y])
	}

	function recurseChildren(parent) {
		r++
		var rlvl = r		
		parent.addEventListener(event, function(e) {
			logevent(e,rlvl) // add this listener to each element in the subtree
		}, false)
		if (r <= level) {
			for (var child of parent.childNodes) {
				recurseChildren(child)
			}
		}
		r--
	}

	window.addEventListener(event, function(e) {
		logevent(e,r)   // window is always on top of the hierarchy
	}, false)

	var r = 1 // level of recursion
	var subtree = voyc.$(parent)  // top of this subtree hierarchy
	recurseChildren(subtree)
}

// a console.log replacement for android debugging
voyc.logger = function(msg) {
	var e = document.getElementById('logger')
	if (!e) {
		e = document.createElement('div')
		e.id = 'logger'
		e.style.position = 'fixed'
		e.style.width = '50%'
		e.style.height = '50%'
		e.style.right = '10px'
		e.style.top = '50px'
		e.style.border = '1px'
		e.style.padding = '1em'
		e.style.backgroundColor = 'white'
		e.style.border = '1px solid black'
		e.style.boxShadow = '4px 4px 2px 0px rgba(0,0,0,.5)'
		e.style.overflow = 'scroll'
		document.body.appendChild(e)
	}
	e.innerHTML += msg + '<br/>'
	e.scrollTop = e.scrollHeight;
}
