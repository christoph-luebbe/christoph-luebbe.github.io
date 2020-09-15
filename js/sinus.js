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
    circ_width: 1.5,           // line width of sine and circle path
	circ_style: "Blue",        // color of cirle
    sine_width: 1.5,           // line width of sine and circle path
	sine_style: "Red",         // color of sine
    axis_width: 0.6,           // line width of axes
	axis_style: "Black",  // color of axes
    rad_width:  1.5,           // line width of radial in circle
	rad_style:  "Red",         // color of the circle radius  
    siny_width: 1.0,           // line width of sine value line
	siny_style: "green",   // color of the sine value line 
	canvas:null,               // calculated value: canvas object
	ctx:   null,               // calculated value: canvas context
	canw:  0,                  // calculated value: canvas width
	canh:  0,                  // calculated value: canvas height
	figw:  0,                  // calculated value: figure width
	ybase: 0,                  // calculated value: Y-axis position
	xmin:  0,                  // calculated value: X-bounday min
	xmax:  0,                  // calculated value: X boundary max: calculated value
	circx: 0,                  // calculated value: circle xpos (center)
	xposC: 0,                  // calculated value: current x pos circle-dot
	xposS: 0,                  // calculated value: current x pos sine-dot 
	t:     0,                  // calculated value: current t 
	ypos:  0                   // calculated value: current ypos dor all dots         	
};  

// get context and setup animation ////////////////////////////////
function init()
{
	gv.canvas = document.getElementById("canv");
	gv.ctx    = gv.canvas.getContext("2d");
	gv.canw   = gv.canvas.width;
	gv.canh   = gv.canvas.height;
	gv.ybase  = gv.canh / 2;
	gv.figw   = gv.padding * 3 + gv.ysize * 2 + gv.ysize*(gv.tmax - gv.tmin);
	gv.circx  = (gv.canw - gv.figw) / 2 + gv.padding + gv.ysize;
	gv.xmin   = gv.circx + gv.ysize + gv.padding;
	gv.xmax   = gv.xmin + gv.ysize*(gv.tmax - gv.tmin);
	gv.xpos   = gv.xmin;

	draw_figure(gv);     // draw figure once at the beginning
};

//callback function: called by mouseover event /////////////////////
function canv_animate(e)
{
    // get the mouse coordinates within the canvas
	var rect = gv.canvas.getBoundingClientRect();
	gv.xposS = e.clientX - rect.left;
	gv.ypos  = gv.ybase;                     // Y is not used in this animation

	draw_figure(gv);
}


//main draw function draws the figure based on mouseposition////////
function draw_figure(gv)
{

    // first check X-bounds
    if (gv.xposS < gv.xmin) gv.xposS = gv.xmin;
    if (gv.xposS > gv.xmax) gv.xposS = gv.xmax;

    // calculate t to be in the range of gv.tmin to gv.tmax
	gv.t    = (gv.xposS - gv.xmin) * (gv.tmax - gv.tmin)/(gv.xmax - gv.xmin);
	gv.ypos = gv.ybase - gv.ysize * Math.sin(gv.t);

	gv.ctx.clearRect(0, 0, gv.canw, gv.canh);

	// draw the axes
	gv.ctx.strokeStyle = gv.axis_style;
	gv.ctx.lineWidth   = gv.axis_width;

	path_line(gv, gv.circx-gv.ysize-25, gv.ybase,             gv.xmax+25,gv.ybase);
	path_line(gv, gv.circx,             gv.ybase-gv.ysize-25, gv.circx,gv.ybase+gv.ysize+25);
	path_line(gv, gv.xmin,              gv.ybase-gv.ysize-25, gv.xmin,gv.ybase+gv.ysize+25);

	path_circ(gv);               // main circle
	path_sine(gv);

	circ_dot(gv);
//	bounce_dot(gv);
	sine_dot(gv);
	
	gv.ctx.strokeStyle = gv.siny_style_style;
	gv.ctx.lineWidth   = gv.siny_width;
	path_line(gv, gv.xposC, gv.ypos, gv.xposS, gv.ypos);

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

	gv.ctx.strokeStyle = gv.sine_style;
	gv.ctx.lineWidth   = gv.sine_width;

	gv.ctx.beginPath();
	gv.ctx.moveTo(px, py);
   
	for (var i=0;i<N;i++)
	{
		if (t+dt <= gv.t) 
		{
			t += dt;
			y = Math.sin(t);

			px += dx;
			py = gv.ybase - gv.ysize*y;

			gv.ctx.lineTo(px, py);
		} else {
		  t = gv.t;
		  y = Math.sin(t);
		  py = gv.ybase - gv.ysize*y;
		  gv.ctx.lineTo(gv.xposS, py);
		}
	}
	gv.ctx.stroke(); 
	gv.ctx.closePath();
}

function path_circ(gv)
{
	gv.ctx.strokeStyle = gv.circ_style;
	gv.ctx.lineWidth   = gv.circ_width;
	gv.ctx.beginPath();
	gv.ctx.arc(gv.circx, gv.ybase,gv.ysize, 0, Math.PI*2, true);     //arc(x, y, radius, startAngle, endAngle, anticlockwise)
	gv.ctx.stroke(); 
	gv.ctx.closePath();
}

function circ_dot(gv)
{
	gv.xposC = gv.circx + gv.ysize * Math.cos(gv.t);

	path_dot(gv, gv.xposC, gv.ypos);

	gv.ctx.strokeStyle = gv.rad_style;
	gv.ctx.lineWidth   = gv.rad_width;
	path_line(gv, gv.circx, gv.ybase, gv.xposC, gv.ypos);                         //radial line

	gv.ctx.strokeStyle = gv.siny_style;
	gv.ctx.lineWidth   = gv.siny_width;
	path_line(gv, gv.xposC, gv.ybase, gv.xposC, gv.ypos);
}

function sine_dot(gv)
{
	gv.xposS = gv.xmin + (gv.t*gv.ysize - gv.tmin*gv.ysize);

	path_dot(gv,gv.xposS, gv.ypos);

	gv.ctx.strokeStyle = gv.siny_style;
	gv.ctx.lineWidth   = gv.siny_width;
	path_line(gv, gv.xposS, gv.ybase, gv.xposS, gv.ypos);
}

function bounce_dot(gv)
{

//	console.log("t="+t);

	path_dot(gv, gv.xmin, gv.ypos);

	gv.ctx.strokeStyle = gv.siny_style;
	gv.ctx.lineWidth   = gv.siny_width;
	path_line(gv, gv.xmin, gv.ybase, gv.xmin, gv.ypos);
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