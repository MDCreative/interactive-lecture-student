/**
 * @file responsible for the triad behaviour and feedback mechanisms
 * @author Ben Williams <eeu222@bangor.ac.uk>
 * @author James Jackson <eeu203@bangor.ac.uk>
 * @author Liam Chapman <eeu239@bangor.ac.uk>
 */

/**
 * Builds the various elements of the view
 * @param id the id of the lecture that the student has logged into
 */
var Triad = function(id){
	var lastCoords;
	// prevent mobile bounce scrolling
	document.addEventListener("touchmove", function(event) {
		event.preventDefault();
	});
	// On some devices the top of the content is hidden by the address bar
	// this code scrolls the page up to ensure that it is all visible
	$('body').scrollTop(1);

	// Triad labels
	var labels = {
		top: "Confused",
		left: "Enlightened",
		right: "Too Fast"
	};
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var cursorRadius = 20;

	// work out the size that the canvas needed on each device by getting the 
	// minimum between height and width.
	var min = Math.min(screen.width - 20, screen.height - 20);
	var padding = cursorRadius / 2 + 10;

	ctx.canvas.width = ctx.canvas.height = min;

	$(canvas).css({
		width: min,
		margin: "0 auto"
	});

	// triad js object containing all of it's points and properties
	var triad = {
		top: {
			x: min / 2,
			y: padding,
			p: 0.33
		},
		left: {
			x: padding,
			y: getHeight(min) - padding,
			p: 0.33
		},
		right: {
			x: min - padding,
			y: getHeight(min) - padding,
			p: 0.34
		}
	};

	var point = {
		x: -1,
		y: -1
	};

	insideData = {
		x: 0.33,
		y: 0.33,
		z: 0.34
	}

	/**
	 * Draw the triangle on the canvas
	 */
	function drawTriangle() {
		shadowOn();
		triangle(triad.right.x, triad.right.y, triad.left.x, triad.left.y, triad.top.x, triad.top.y, "#333");
		shadowOff();
	}

	/**
	 * Turn shadows on for drawing
	 */
	function shadowOn() {
		ctx.shadowColor = '#000';
		ctx.shadowBlur = 6;
		ctx.shadowOffsetX = 1;
		ctx.shadowOffsetY = 1;
		ctx.beginPath();
	}

	/**
	 * Turn shadows off for drawing
	 */
	function shadowOff() {
		ctx.shadowColor = "rgba(0,0,0,0)";
		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
	}

	/**
	 * Clamps a value between and 0 and 1
	 * @param value to be clamped
	 */
	function clamp01(value)
	{
		if(value > 1)
			return 1;

		else if(value < 0)
			return 0;

		else
			return value;
	}

	/**
	 * Calculates the side of the tirangle
	 * @param from point from
	 * @param to point to
	 * @param mouse current mouse position
	 */
	var interpolateTriangleSide = function(from, to, mouse) 
	{
		var percentY = (mouse.y - to.y) / (from.y - to.y);

		var cX = to.x + (from.x - to.x) * percentY;

		return cX;
	};

	/**
	 * Get the barycentric coordinates of a point within a triangle
	 * @param p point to find
	 * @param p1 point one of triangle
	 * @param p2 point two of triangle
	 * @param p3 point three of triangle
	 */
	function getBarycentricCoords(p, p1, p2, p3)
	{
	//Can be calculated only once:
	var denom = (p1.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y);

	//These will be continously calculated
	var pResults = {
		x: (p.x - p3.x),
		y: (p.y - p3.y)
	};

	//The rest of these can be cached if the triangle never moves
	var a = ((p2.y - p3.y) * pResults.x + (p3.x - p2.x) * pResults.y) / denom;
	var b = ((p3.y - p1.y) * pResults.x + (p1.x - p3.x) * pResults.y) / denom;
	var c = 1.0 - a - b;

	return { a : a, b : b, c : c };
}

/**
 * Check to see if a point is inside a given triangle
 * @param p point to find
 * @param p1 point one of triangle
 * @param p2 point two of triangle
 * @param p3 point three of triangle
 */
var checkIfInside = function(p, p1, p2, p3) {
	//var p1 = triad.right, p2 = triad.left, p3 = triad.top;

	var bdata = getBarycentricCoords(p, p1, p2, p3);			

	//Test whether or not a, b and c are between 0 and 1 inclusive.
	var aNormalized = (0 <= bdata.a && bdata.a <= 1);
	var bNormalized = (0 <= bdata.b && bdata.b <= 1);
	var cNormalized = (0 <= bdata.c && bdata.c <= 1);


	if (aNormalized && bNormalized && cNormalized) {

		return {
			x: bdata.a,
			y: bdata.b,
			z: bdata.c
		};
	} else {
		return null;
	}
};

var insideData;

/**
 * Callback for the drag event on the canvas
 * @param ev the event that called the function
 */
var canvasDrag = function(ev) {
	var x = ev.changedTouches[0].pageX - canvas.offsetLeft;
	var y = ev.changedTouches[0].pageY - canvas.offsetTop;

	insideData = checkIfInside({
		"x": x,
		"y": y
	}, triad.right, triad.left, triad.top);

	if (insideData != null)
		point.x = x,
	point.y = y;
	else
	{
		var p = { x : x, y : y };

		var baseX = triad.right.x - triad.left.x;
		var baseY = triad.right.y;

		var left = p.x < triad.left.x + (baseX / 2);


		if(p.y > triad.left.y)
		{
		    //Bottom
		    
		    //Bottom, middle
		    if(p.x > triad.left.x && p.x < triad.right.x)
		    	p.y = triad.left.y;
		    
		    else
		    {
		        //Bottom, lock to either left or right
		        if(left)
		        	p = { x : triad.left.x, y : triad.left.y };
		        
		        else			        
		        	p = { x : triad.right.x, y : triad.right.y };    
		    }
		}

		//Top
		else if(p.y < triad.top.y)
			p = { x : triad.top.x, y : triad.top.y };

		else if(p.y <= triad.left.y)
		{
		    //Middle, interpolation
		    var cX;
		    
		    if(left)
		    	cX = interpolateTriangleSide(triad.left, triad.top, p);
		    
		    else
		    	cX = interpolateTriangleSide(triad.right, triad.top, p);
		    
		    p.x = cX;
		}

		point.x = p.x;
		point.y = p.y;
	}

	var bdata = getBarycentricCoords(point, triad.right, triad.left, triad.top);	

	triad.top.p   = clamp01(bdata.c);
	triad.left.p  = clamp01(bdata.b);
	triad.right.p = clamp01(bdata.a);

	currentStep = 0;
	currentEndAngle = 0;
	clearInterval(timer);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	draw();
}

//Adjust max step (> is slower, < is faster)
var timer, currentStep = 0, currentEndAngle, maxStep = 32;

/**
 * Legacy function: Update the progress bar
 */
var progressBarUpdate = function()
{
	currentStep++;
	angleIncrement = (Math.PI * 2) / maxStep;

	currentEndAngle = angleIncrement * currentStep;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	draw();

	if(currentStep > maxStep)
	{
		//When progress bar is full
		//..

		sendCoordData();
		
		clearInterval(timer);
		currentStep = 0;
		currentEndAngle = 0;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		draw();

		return;
	}

	
};

/**
 * Callback for the drag end event on the canvas
 * @param ev the event that called the function
 */
var canvasDragEnd = function(ev) {
	//resizeBar();
	var x = ev.changedTouches[0].pageX - canvas.offsetLeft;
	var y = ev.changedTouches[0].pageY - canvas.offsetTop;


	timer = window.setInterval(progressBarUpdate, 50);

}

/**
 * Legacy function: interpolate colours
 * @param from color object form
 * @param to color object to
 * @param position for the interpolated color
 */
var colourLerp = function(from, to, at)
{
	if(typeof from != "string" || typeof to != "string")
		throw "I expected strings."

	//We don't match a 24-bit css hex colour string, so throw an error
	if((!from.match(/^#[0-9a-f]{6,6}$/gi)) || (!to.match(/^#[0-9a-f]{6,6}$/gi)))
		throw "I expected 24-bit colour strings: (e.g. #ff0000 for red).";

	//Reassign from and to, to discount the '#'
	from = from.substr(1);
	to   = to.substr(1);
	
	//from object, extract triplets
	var f = 
	{
		r : (parseInt(from, 16) >> 16) & 0xff,
		g : (parseInt(from, 16) >>  8) & 0xff,
		b :  parseInt(from, 16)        & 0xff
	};
	
	//to object, extract triplets
	var t = 
	{
		r : (parseInt(to, 16) >> 16) & 0xff,
		g : (parseInt(to, 16) >>  8) & 0xff,
		b :  parseInt(to, 16)        & 0xff
	};
	
	//Calculated rgb lerp object, floor using linear interpolation between each triplet
	var c = 
	{
		r : Math.floor(f.r + (t.r - f.r) * at),
		g : Math.floor(f.g + (t.g - f.g) * at),
		b : Math.floor(f.b + (t.b - f.b) * at)
	};
	
	//Zero padd hex if needed to maintain 24 bit ordering
	var hexf = function(input) { return ("0" + input.toString(16)).substr(-2); };
	
	//And return a css 24 bit hex colour string
	return "#" + hexf(c.r) +  hexf(c.g) + hexf(c.b);
};
/**
 * Draw the selected point on the canvas
 */
function drawPoint() {
	var cSize = 5;
	if (point.x == -1 && point.y == -1)
		return;
	shadowOn();


		//Progress bar
		if(currentStep != 0)
		{
			ctx.beginPath();
			ctx.strokeStyle = colourLerp('#ffffff', '#e74c3c', currentStep / maxStep);
			ctx.lineWidth = 3;
			ctx.arc(point.x, point.y, 24, 0, currentEndAngle, false);
			ctx.stroke();
		}

		//Marker (orange)
		ctx.beginPath();
		ctx.fillStyle = "#e67e22"; 
		ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI, false);
		ctx.fill();
		shadowOff();

		//Crosshair
		ctx.beginPath();
		ctx.strokeStyle = "#000";
		//ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI, false);
		ctx.moveTo(point.x, point.y);
		ctx.lineTo(point.x + cSize, point.y);
		ctx.moveTo(point.x, point.y);
		ctx.lineTo(point.x, point.y + cSize);
		ctx.moveTo(point.x, point.y);
		ctx.lineTo(point.x - cSize, point.y);
		ctx.moveTo(point.x, point.y);
		ctx.lineTo(point.x, point.y - cSize);
		ctx.lineWidth = 1;
		ctx.stroke();
	}

	/**
	 * Draw the labels on the canvas
	 * @param labs the labels to be used on the canvas
	 */
	function drawLabels(labs) {
		ctx.fill();
		ctx.font = '9pt Verdana';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'white';
		ctx.fillText(labs.top, triad.top.x, triad.top.y - 5);
		ctx.textAlign = 'left';
		ctx.fillText(labs.left, triad.left.x, triad.left.y + 15);
		ctx.textAlign = 'right';
		ctx.fillText(labs.right, triad.right.x, triad.right.y + 15);
	}

	/**
	 * Legacy function: Resizes the progess bars
	 */
	function resizeBar() {
		document.getElementById("red").style.width = Math.round(99 * lastCoords.x) + "%";
		document.getElementById("green").style.width = Math.round(99 * lastCoords.y) + "%";
		document.getElementById("blue").style.width = Math.round(99 * lastCoords.z) + "%";
	}

/**
 * Draw the sub triangles in each corner
 */
function drawSubTriangles() {

	var a1 = Math.atan2(triad.left.y - triad.top.y, triad.left.x - triad.top.x);
	var a2 = Math.atan2(triad.right.y - triad.top.y, triad.right.x - triad.top.x);

	var a3 = Math.atan2(triad.right.y - triad.left.y, triad.right.x - triad.left.x);
	var a4 = Math.atan2(triad.top.y - triad.left.y, triad.top.x - triad.left.x);

	var a5 = Math.atan2(triad.top.y - triad.right.y, triad.top.x - triad.right.x);
	var a6 = Math.atan2(triad.left.y - triad.right.y, triad.left.x - triad.right.x);

	var d = getHeight(min) * 0.5;

	var px = triad.top.x + Math.cos(a1) * d * triad.top.p;
	var py = triad.top.y + Math.sin(a1) * d * triad.top.p;

	var px2 = triad.top.x + Math.cos(a2) * d * triad.top.p;
	var py2 = triad.top.y + Math.sin(a2) * d * triad.top.p;

	var px3 = triad.left.x + Math.cos(a3) * d * triad.left.p;
	var py3 = triad.left.y + Math.sin(a3) * d * triad.left.p;

	var px4 = triad.left.x + Math.cos(a4) * d * triad.left.p;
	var py4 = triad.left.y + Math.sin(a4) * d * triad.left.p;

	var px5 = triad.right.x + Math.cos(a5) * d * triad.right.p;
	var py5 = triad.right.y + Math.sin(a5) * d * triad.right.p;

	var px6 = triad.right.x + Math.cos(a6) * d * triad.right.p;
	var py6 = triad.right.y + Math.sin(a6) * d * triad.right.p;

	triangle(triad.top.x, triad.top.y, px, py, px2, py2, "rgb(46, 204, 113)");
	triangle(triad.left.x, triad.left.y, px3, py3, px4, py4, "rgb(52, 152, 219)");
	triangle(triad.right.x, triad.right.y, px5, py5, px6, py6, "rgb(155, 89, 182)");

	}
	/**
	 * Draws a triangle
	 * @param x1 the first point x
	 * @param y1 the first point y
	 * @param x2 the second point x
	 * @param y2 the second point y
	 * @param x3 the third point x
	 * @param y3 the first point y
	 * @param color the color of the triangle
	 * @param stroke the stroke for the triangle
	 */
	function triangle(x1, y1, x2, y2, x3, y3, color, stroke) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.lineTo(x3, y3);
		ctx.lineTo(x1, y1);
		ctx.fillStyle = color;
		ctx.fill();
	}

	
	/**
	 * Draws a stroke for a traingle
	 * @param x1 the first point x
	 * @param y1 the first point y
	 * @param x2 the second point x
	 * @param y2 the second point y
	 * @param x3 the third point x
	 * @param y3 the first point y
	 * @param stroke the stroke for the triangle
	 */
	function drawStroke(x1, y1, x2, y2, x3, y3, stroke){
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.lineTo(x3, y3);
		ctx.lineTo(x1, y1);
		ctx.lineWidth = 1;
		ctx.strokeStyle = stroke;
		ctx.stroke();
		ctx.fillStyle = "rgba(0, 0, 200, 0)";
		
	}

	/**
	 * Draw function invokes various methods to draw the triad
	 */
	function draw() {
		canvas.addEventListener('touchmove', canvasDrag, false);
		canvas.addEventListener('touchstart', canvasDrag, false);
		canvas.addEventListener('touchend', canvasDragEnd, false);
		if (insideData) {
			lastCoords = insideData;
		}
		drawTriangle();
		drawSubTriangles();
		drawStroke(triad.right.x, triad.right.y, triad.left.x, triad.left.y, triad.top.x, triad.top.y, "#666");
		drawPoint();
		drawLabels(labels);
	}


	/**
	 * Gets the height of an equalateral triangle
	 */
	function getHeight(num) 
	{
		return Math.sqrt(Math.pow(num, 2) - Math.pow(num / 2, 2));
	}


	/**
	 * Sends the triad data to firebase
	 */
	function sendCoordData()
	{
		var ref = new Firebase("https://interactive-lecture.firebaseio.com/Test/" + id);

		var child = ref.child("triad");
		var data = {
			time: Firebase.ServerValue.TIMESTAMP
		};
		$.extend(data, lastCoords);
		child.push(data);
	}



	// all done now we draw
	draw();

};
