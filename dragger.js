/*
	Creates a Dragger object.
	Adds dragging to HTML elements.
	A singleton object. 
	Three public methods: enableDrag(), enableDrop(), addListener(), showInternals().
	Expects two classes
		.dragging {position:absolute;} - style the object as it is being dragged
		.highlight {border:1px solid red} - style the drop target as it is hovered
	Requires jslib/utils.js
*/
Dragger = function() {
	// make sure only one object is created
	if ( arguments.callee._singletonInstance )
		return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;

	this.internaldiv = null;
	this.mousex = 0;
	this.mousey = 0;
	this.grbx = 0;
	this.grby = 0;
	this.orix = 0;
	this.oriy = 0;
	this.elex = 0;
	this.eley = 0;
	this.dragobj;
	
	this.zIndex = 1;
	
	this.draggables = [];
	this.droppables = [];
	
	this.cb = {
		cbgrab:null,
		cbdrag:null,
		cbdrop:null,
	};
}

Dragger.prototype = {
	// Make a specified element draggable.
	enableDrag: function(e) {
		var self = this;
		e.addEventListener('touchstart', dgrab, false);
		e.addEventListener('mousedown', dgrab, false);
		this.draggables.push(e)
	},

	// Make a specified element droppable.
	enableDrop: function(e) {
		this.droppables.push(e)
	},

	// Specify callback function for 'grab', 'drag' or 'drop' event.
	addListener: function(e, eventName, callback) {
		var dragged = e || this.cb;
		if (eventName == 'grab') {
			dragged.cbgrab = callback;
		}
		if (eventName == 'drag') {
			dragged.cbdrag = callback;
		}
		if (eventName == 'drop') {
			dragged.cbdrop = callback;
		}
	},

	// Return point of mouse or touch
	getMousePos : function(e) { 
		var p = {x:-1, y:-1};
		if (e.targetTouches) {
			p.x = e.targetTouches[0].pageX;
			p.y = e.targetTouches[0].pageY;
		}
		else if (e.pageX || e.pageY) {
			p.x = e.pageX;
			p.y = e.pageY;
		}
		return p;
	},
	
	// Event Handler for mousedown, touchstart on a draggable element.
	ongrab : function(e) {
		if (!e.currentTarget.hasAttribute('drag')) {
			return;
		}
		
		console.log('grabbed');
		pos = this.getMousePos(e);
		this.mousex = pos.x;
		this.mousey = pos.y;
		this.dragobj = e.currentTarget;
		
		var self = this;
		this.dragobj.addEventListener('touchmove', ddrag, false);
		this.dragobj.addEventListener('mousemove', ddrag, false);
		this.dragobj.addEventListener('touchend', ddrop, false);
		this.dragobj.addEventListener('mouseup', ddrop, false);
		this.dragobj.classList.add('dragging');

		this.grbx = this.mousex;
		this.grby = this.mousey;

		this.orix = this.dragobj.offsetLeft;
		this.oriy = this.dragobj.offsetTop;

		this.elex = this.orix;
		this.eley = this.oriy;

		if (this.dragobj.cbgrab) {
			this.dragobj.cbgrab(this.dragobj, this.elex, this.eley);
		}

		this.dragobj.style.zIndex = this.zIndex++;

		e.preventDefault();
		this.refreshInternals();
	},
	
	// Event Handler for mousemove, touchmove on a dragging element.
	ondrag : function(e) {
		pos = this.getMousePos(e);
		this.mousex = pos.x;
		this.mousey = pos.y;

		if (this.dragobj) {
			this.elex = this.orix + (this.mousex - this.grbx);
			this.eley = this.oriy + (this.mousey - this.grby);
			
			this.dragobj.style.left = this.elex + 'px';
			this.dragobj.style.top = this.eley + 'px';

			if (this.droptarget) {
				this.droptarget.classList.remove('highlight');
			}

			this.droptarget = this.findDropTarget(this.dragobj, this.elex, this.eley);
			if (this.droptarget) {
				this.droptarget.classList.add('highlight');
			}
		
			if (this.dragobj.cbdrag) {
				this.dragobj.cbdrag(this.dragobj, this.elex, this.eley, this.droptarget);
			}
		}
		this.refreshInternals(e);

		// Prevent the whole page from dragging if on mobile
		e.preventDefault();
	},
	
	// Event Handler for mouseup, touchend, and touchcancel on a dragging element.
	ondrop : function() {
		console.log('dropped');
		if (this.dragobj) {

			var droptarget = this.findDropTarget(this.dragobj, this.elex, this.eley);
		
			if (this.droptarget) {
				this.droptarget.classList.remove('highlight');

				if (this.dragobj.cbdrop) {
					this.dragobj.cbdrop( this.dragobj, this.elex, this.eley, droptarget);
				}
				if (this.cb.cbdrop) {
					this.cb.cbdrop( this.dragobj, this.elex, this.eley, droptarget);
				}
			}
	
			this.dragobj.removeEventListener('touchmove', ddrag, false);
			this.dragobj.removeEventListener('touchend', ddrop, false);
			this.dragobj.classList.remove('dragging');
			this.dragobj = null;
		}
		this.refreshInternals();
	},

	intersectRect: function(r1, r2) {
		return !(r2.left > r1.right || 
			r2.right < r1.left || 
			r2.top > r1.bottom ||
			r2.bottom < r1.top);
	},
		
	findDropTarget: function(dragobj, x, y) {
		var ret = null;
		var r1 = {
			top:y,
			left:x,
			right:x+dragobj.offsetWidth,
			bottom:y+dragobj.offsetHeight,
		};
		
		
		
		var o, r2;
		for (var i=0; i<this.droppables.length; i++) {
			o = this.droppables[i];
			var p = getAbsolutePosition(o); // needed for tr which has table as offsetParent.  LI has body as offsetParent.
			r2 = {
				top:p.y,
				left:p.x,
				right:p.x + o.offsetWidth,
				bottom:p.y + o.offsetHeight,
			};
			
			if (o != dragobj && this.intersectRect(r1,r2)) {
				ret = o;
				break;
			}
		}
		return ret;
	},

	/**
	 * Set the div id in which to display internals.
	 * @public
	 */
	setInternals : function(e) {	
		this.internaldiv = e;
		var s = "<table>"+
			"<tr><td>parameter</td><td> value </td></tr>"+
			"<tr><td>navi.appName</td><td><span id='dragint_browser'>&nbsp;</span></td></tr>"+
			"<tr><td>window.event</td><td><span id='dragint_winevent'>&nbsp;</span></td></tr>"+
			"<tr><td>auto event</td><td><span id='dragint_autevent'>&nbsp;</span></td></tr>"+
			"<tr><td>algorithm</td><td><span id='dragint_algor'>&nbsp;</span></td></tr>"+
			"<tr><td>mousex,y</td><td><span id='dragint_mousex'>&nbsp;</span>, <span id='dragint_mousey'>&nbsp;</span></td></tr>"+
			"<tr><td>dragobj</td><td><span id='dragint_dragobj'>&nbsp;</span></td></tr>"+
			"<tr><td>grabx,y</td><td><span id='dragint_grabx'>&nbsp;</span>, <span id='dragint_graby'>&nbsp;</span></td></tr>"+
			"<tr><td>orix,y</td><td><span id='dragint_orix'>&nbsp;</span>, <span id='dragint_oriy'>&nbsp;</span></td></tr>"+
			"<tr><td>elex,y</td><td><span id='dragint_elex'>&nbsp;</span>, <span id='dragint_eley'>&nbsp;</span></td></tr>"+
			"</table>";
		if (this.internaldiv) {
			this.internaldiv.innerHTML = s;
		}
	},
	
	/**
	 * Refresh the internals window.
	 * @private
	 */
	refreshInternals : function(e) {
		if (!this.internaldiv) return;
		document.getElementById('dragint_winevent').innerHTML = window.event ? window.event.type : '(na)';
		document.getElementById('dragint_autevent').innerHTML = e ? e.type : '(na)';
		document.getElementById('dragint_mousex').innerHTML = this.mousex;
		document.getElementById('dragint_mousey').innerHTML = this.mousey;
		document.getElementById('dragint_grabx').innerHTML = this.grbx;
		document.getElementById('dragint_graby').innerHTML = this.grby;
		document.getElementById('dragint_orix').innerHTML = this.orix;
		document.getElementById('dragint_oriy').innerHTML = this.oriy;
		document.getElementById('dragint_elex').innerHTML = this.elex;
		document.getElementById('dragint_eley').innerHTML = this.eley;
		document.getElementById('dragint_dragobj').innerHTML = this.dragobj ? (this.dragobj.id ? this.dragobj.id : 'unnamed object') : '(null)';
	}
}

// global functions.  (Methods cannot be used with removeEventListener.)
dgrab = function(e) { Dragger().ongrab(e); }
ddrag = function(e) { Dragger().ondrag(e); }
ddrop = function(e) { Dragger().ondrop(e); }
