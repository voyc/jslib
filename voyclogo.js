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
		var logos = elem.querySelectorAll('.voyclogo');
		for (var i=0; i<logos.length; i++) {
			// save style information
			var w = logos[i].offsetWidth;
			var h = logos[i].offsetHeight;
			var color = window.getComputedStyle(logos[i]).color;
			var resizeable = logos[i].classList.contains('resizeable');

			// replace all children with one canvas
			logos[i].innerHTML = '';
			var canvas = document.createElement('canvas');
			logos[i].appendChild(canvas);

			// save for drawing
			this.logos.push({elem:logos[i], canvas:canvas, w:w, h:h, color:color, resizeable:resizeable});
		}
	},
	drawAll: function() {
		for (var i=0; i<this.logos.length; i++) {
			this.draw(this.logos[i]);
		}
	},
	draw: function(o) {
		var canvas = o.canvas;
		var w = o.w;
		var h = o.h;
		var color = o.color;

		// adjust to size of container
		if (o.resizeable) {
			w = o.elem.offsetWidth;
			h = o.elem.offsetHeight;
		}

		// By default, canvas.width is NOT equal to canvas.style.width
		canvas.width  = w;
		canvas.height = h;
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';

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
