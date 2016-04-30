/**
	class VoycLogo
		@constructor
		singleton
		draws the voyc logo on a canvas
**/
function VoycLogo() {
	// is singleton
	if (VoycLogo._instance) return VoycLogo._instance;
	else VoycLogo._instance = this;

	this.logos = [];
}

VoycLogo.prototype = {
	attachAll: function(element) {
		var elem = element || document;
		var logos = elem.querySelectorAll('voyclogo');
		for (var i=0; i<logos.length; i++) {
			this.logos.push(logos[i]);
			logos[i].appendChild(document.createElement('canvas'));
		}
	},
	drawAll: function() {
		for (var i=0; i<this.logos.length; i++) {
			this.draw(this.logos[i]);
		}
	},
	draw: function(elem) {
		var canvas = elem.firstChild;

		// canvas.width is NOT equal to canvas.style.width
		// canvas.style.width is the size of the html element
		// canvas.width is the size of the drawing surface
		// By default, canvas.width=300px, canvas.height=150px.
		// The drawing surface is scaled into the size of the HTML element.

		// the following are in pixels

		var style = window.getComputedStyle(elem);
		var w = canvas.width  = parseInt(style.width,10);
		var h = canvas.height = parseInt(style.height,10);
		var color = style.color;

		// letter box
		var bw = w / 4;
		var bh = h * .75;
		var radius = parseInt(Math.min(bw, bh),10) * .4;
		var linewidth = radius * .5;

		// letter center
		var cx = bw / 2;
		var cy = bh / 2;

		var ctx = canvas.getContext('2d');
		ctx.lineWidth = linewidth;   
		ctx.lineCap = 'round';   
		ctx.strokeStyle = color;

		this.drawv(ctx, cx, cy, radius);
		this.drawo(ctx, cx + bw, cy, radius);
		this.drawy(ctx, cx + bw + bw, cy, radius);
		this.drawc(ctx, cx + bw + bw + bw, cy, radius);
	},
	
	drawo: function(ctx, x, y, radius) {
		var startAngle = .2;
		var endAngle = .19;
	    this.drawCircle( ctx, x, y, radius, startAngle, endAngle);
	},
	drawc: function(ctx, x, y, radius) {
		var startAngle = .20;
		var endAngle = 1.80;
	    this.drawCircle( ctx, x, y, radius, startAngle, endAngle);
	},
	drawCircle: function( ctx, x, y, radius, startAngle, endAngle){
		var counterClockwise = false;
		ctx.beginPath();
		ctx.arc( 
			x, 
			y, 
			radius, 
			startAngle * Math.PI, 
			endAngle * Math.PI, 
			counterClockwise );
		ctx.stroke();
	},

	drawv: function( ctx, x, y, radius) {
		ctx.beginPath();
		ctx.moveTo( x-radius, y-radius ); 
		ctx.lineTo ( x, y+radius );
		ctx.moveTo( x+radius, y-radius ); 
		ctx.lineTo ( x, y+radius );
		ctx.stroke();
	},
	drawy: function( ctx, x, y, radius) {
		ctx.beginPath();
		ctx.moveTo( x-radius, y-radius ); 
		ctx.lineTo ( x, y+radius );
		ctx.moveTo( x+radius, y-radius ); 
		ctx.lineTo ( x-(.5*radius), y+(2*radius) );
		ctx.stroke();
	},
}
addEventListener('load', function() {
	var logo = new VoycLogo();
	logo.attachAll(document);
	logo.drawAll();
}, false);
addEventListener('resize', function() {
	(new VoycLogo()).drawAll();
}, false);
