// ********************************************************************
// script for an animated sine curve using HTML5 and a canvas container
//
// prerequisites: canvas container needs to have the id="canv"
//                canvas min size: width:600px height:250px
//                the function canv_animate needs to be bound to the mouseover event
// <canvas id="canv" onmousemove="canv_animate(event)" width="600px" height="250px">
//
// init(); needs to be called after load once.
//
// Copyright Christoph Luebbe
//
// History:
//
// 05.12.2013 Version 1.00 initial version
// 06.12.2013 Version 1.10 generic sizing based on ysize and padding
//
//***********************************************************************

// global vars  and settings /////////////////////////////////////////
var gv = {
	padding:    25,            // padding between cirle and sine 
	ysize:      70,            // Y-axis scaling factor & circle radius          
	tmin:       0.0*Math.PI,   // target min
	tmax:       2.0*Math.PI,   // target max
	dots_size:  4,             // size of the dots
	dots_style: "Orange",      // color of the dots
    path_width: 1.5,           // line width of sine and circle path
	path_style: "DimGray",     // color of sine and circle 
    axis_width: 0.6,           // line width of axes
	axis_style: "LightGreen",  // color of axes
    rad_width:  1.5,           // line width of radial in circle
	rad_style:  "Red",         // color of the circle radius  
    siny_width: 1.5,           // line width of sine value line
	siny_style: "LightBlue",   // color of the sine value line 
	canvas:null,               // calculated value: canvas object
	ctx:   null,               // calculated value: canvas context
	canw:  0,                  // calculated value: canvas width
	canh:  0,                  // calculated value: canvas height
	figw:  0,                  // calculated value: figure width
	ybase: 0,                  // calculated value: Y-axis position
	xmin:  0,                  // calculated value: X-bounday min
	xmax:  0,                  // calculated value: X boundary max: calculated value
	circx: 0                   // calculated value: circle xpos (center)	
};  

// get context and setup animation ////////////////////////////////
function init()
{
	gv.canvas = document.getElementById("canv");
	gv.ctx    = gv.canvas.getContext("2d");
	gv.canw   = gv.canvas.width;
	gv.canh   = gv.canvas.height;
	gv.ybase  = gv.canh / 2;
	gv.figw   = gv.padding * 2 + gv.ysize * 2 + gv.ysize*(gv.tmax - gv.tmin);
	gv.circx  = (gv.canw - gv.figw) / 2 + gv.padding + gv.ysize;
	gv.xmin   = gv.circx;
	gv.xmax   = gv.xmin + gv.ysize*(gv.tmax - gv.tmin);

	draw_figure(gv, gv.xmin, 0);     // draw figure once at the beginning
};

//callback function: called by mouseover event /////////////////////
function canv_animate(e)
{
    // get the mouse coordinates within the canvas
	var rect = gv.canvas.getBoundingClientRect();
	var X = e.clientX - rect.left;
	var Y = e.clientY - rect.top;    // Y is not used in this animation

	draw_figure(gv, X, Y);
}


//main draw function draws the figure based on mouseposition////////
function draw_figure(gv, X, Y)
{

    // first check X-bounds
    if (X < gv.xmin) X = gv.xmin;
    if (X > gv.xmax) X = gv.xmax;

    // calculate t to be in the range of gv.tmin to gv.tmax
	var t = (X - gv.xmin) * (gv.tmax - gv.tmin)/(gv.xmax - gv.xmin);

	gv.ctx.clearRect(0, 0, gv.canw, gv.canh);

	// draw the axes
	gv.ctx.strokeStyle = gv.axis_style;
	gv.ctx.lineWidth   = gv.axis_width;

	path_line(gv, gv.circx-gv.ysize-gv.padding, gv.ybase,             gv.xmax+gv.padding+gv.ysize,gv.ybase);
	path_line(gv, gv.xmin,              gv.ybase-gv.ysize-gv.padding, gv.xmin,gv.ybase+gv.ysize+gv.padding);

	path_circ(gv, t, X);               // main circle
	path_sine(gv);

	circ_dot(gv, t, X);
	bounce_dot(gv, t);
	sine_dot(gv, t);
}

function path_sine(gv)
{
	// sine path from 0 to rads radians scales by sx

	var N  = 30;                       // number of sections the path is partitioned
	var dt = (gv.tmax - gv.tmin)/N;
	var dx = (gv.xmax - gv.xmin)/N;
	var t  = gv.tmin;
	var px = gv.xmin;
	var py = gv.ybase;

	gv.ctx.strokeStyle = gv.path_style;
	gv.ctx.lineWidth   = gv.path_width;

	gv.ctx.beginPath();
	gv.ctx.moveTo(px, py);
   
	for (var i=0;i<N;i++)
	{
		t += dt;
		y = Math.sin(t);

		px += dx;
		py = gv.ybase - gv.ysize*y;

		gv.ctx.lineTo(px, py);
	}
	gv.ctx.stroke(); 
	gv.ctx.closePath();
}

function path_circ(gv, t, X)
{
    var xm = X + (gv.ysize * Math.cos(t));

	gv.ctx.strokeStyle = gv.path_style;
	gv.ctx.lineWidth   = gv.path_width;
	gv.ctx.beginPath();
	gv.ctx.arc(X, gv.ybase,gv.ysize, 0, Math.PI*2, true);     //arc(x, y, radius, startAngle, endAngle, anticlockwise)
	gv.ctx.stroke(); 
	gv.ctx.closePath();
}

function circ_dot(gv, t, X)
{
	var xm = X;
	var x = xm - gv.ysize * Math.cos(t);
	var y = gv.ybase - gv.ysize * Math.sin(t);

	path_dot(gv,x,y);

	gv.ctx.strokeStyle = gv.rad_style;
	gv.ctx.lineWidth   = gv.rad_width;
	path_line(gv, xm, gv.ybase, x,y);                         //radial line

	gv.ctx.strokeStyle = gv.siny_style;
	gv.ctx.lineWidth   = gv.siny_width;
	path_line(gv, x, gv.ybase, x,y);
}

function sine_dot(gv, t)
{
	var x = gv.xmin + (t*gv.ysize - gv.tmin*gv.ysize);
	var y = gv.ybase - gv.ysize*Math.sin(t);

	path_dot(gv,x,y);

	gv.ctx.strokeStyle = gv.siny_style;
	gv.ctx.lineWidth   = gv.siny_width;
	path_line(gv, x, gv.ybase, x, y);
}

function bounce_dot(gv, t)
{
	var x = gv.xmin;
	var y = gv.ybase - gv.ysize*Math.sin(t);

//	console.log("t="+t);

	path_dot(gv,x,y);

	gv.ctx.strokeStyle = gv.siny_style;
	gv.ctx.lineWidth   = gv.siny_width;
	path_line(gv, gv.xmin, gv.ybase, x, y);
}

function path_dot(gv, x,y)
{
	gv.ctx.fillStyle = gv.dots_style;
	gv.ctx.beginPath();
	gv.ctx.arc(x,y, gv.dots_size, 0, Math.PI*2, true);     //arc(x, y, radius, startAngle, endAngle, anticlockwise)
	gv.ctx.fill(); 
	gv.ctx.closePath();
}

function path_line(gv, x0,y0, x1,y1)
{
	gv.ctx.beginPath();
	gv.ctx.moveTo(x0, y0);
	gv.ctx.lineTo(x1, y1);
	gv.ctx.stroke(); 
	gv.ctx.closePath();
}

window.onload = function () {init(); }