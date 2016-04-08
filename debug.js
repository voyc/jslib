/**  (c) Copyright 2005,2006,2008 MapTeam, Inc.
 * --------------------------------------------------------------
 *	class Debug()
 *      When debugging is on, this object opens a separate debugging window.
 *      You can write debugging messages into this window without interfering
 *      with the UI in the window you are testing.
 *
 *      Create one global Debug object named gdebug
 *      Most of our classes require this.
 *         var gdebug = new Debug(debug);    * where debug is true or false
 *
 *      Usage:
 *         gdebug.toggle(debug);  // where debug is true or false
 *         gdebug.alert(msg);     // where msg is a string
 *         gdebug.dumpElement(e); // where e is a DOM element
 *         gdebug.dumpObject(o);  // where o is a javascript object
 * --------------------------------------------------------------
 */
function Debug( debug) {
	this.debug = debug;
	this.w = null;
	this.toggle(debug);
	this.indent = 0;
}

Debug.prototype = {
	toggle : function(debug) {
		this.debug = debug;
		if (this.debug) {
			this.width = 250;
			this.height = 600;
			this.x = window.screenX - 300;
			this.y = window.screenY;
			this.w = window.open( "", "debugwindow", "width="+this.width+",height="+this.height+",screenX="+this.x+",screenY="+this.y+",scrollbars=yes,resizable=yes");
			this.w.document.close();
			this.w.document.open();
			// this.w.document.title = "Debug";   // this breaks IE
			this.alert( "Debug");
		}
		else {
			if (this.w) {
				this.w.document.close();
				this.w = null;
			}
		}
	},
	
	alert :function( msg) {
		if (this.debug && this.w) {
			this.w.document.write( msg + "<br/>");
		}
	},
	
	dumpElement : function(e) {
		if (this.debug && this.w) {
	
			if (typeof(e) == "undefined") {
				this.alert("DumpElement: undefined");
				return;
			}
	
			this.alert("DumpElement id="+e.id);
	
			if (e.hasAttributes) {
				this.alert("attributes:");
				var a = e.attributes;
				var num = a.length;
				var s = '';
				for (var i=0; i<num; i++) {
					s = i+") "+a[i].name+" = "+a[i].value;
					this.alert(s);
				}
			}
			else {
				this.alert("attributes: none");
			}
	
			if (e.hasChildNodes()) {
				this.alert("children:");
				var a = e.childNodes;
				var num = e.childNodes.length;
				var s = '';
				for (var i=0; i<num; i++) {
					//s = i+") id="+a[i].getAttribute('id')+" visibility="+a[i].style.visibility+" z="+a[i].style.zIndex;
					s = i+") "+a[i].nodeName+" id="+a[i].id;
					this.alert(s);
				}
			}
			else {
				this.alert( "children: none");
			}
		}
	},
	


	dumpObject : function(obj,depth) {
		this.maxdepth = depth ? depth : 10;
		this.s = '';
		this.dumpObjectR(obj);
		return this.s;
	},
	
	dumpObjectR : function(obj) {
		var s = '';
		for (var i=0; i<this.indent; i++) {
			s += "&nbsp;&nbsp;&nbsp;"
		}
		this.s += s+"<br/>";
		if (true) {
			for (x in obj) {
				this.s +=  s+x+"="+obj[x]+"<br/>";
				if (typeof(obj[x]) == "object" && this.indent < this.maxdepth-1) {
					this.indent++;
					this.dumpObjectR(obj[x]);
					this.indent--;
				}
			}
		}
	}
}
//  (c) Copyright 2005,2006,2008 MapTeam, Inc.
