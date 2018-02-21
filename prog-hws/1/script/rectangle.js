var rectangle = // RECTANGLE OBJECT
{
	clickCount: 0, // click counter
	enableRubberBandDraw: false, // rubberbanding
	point1: {x: null, y: null}, // point 1
	point2: {x: null, y: null} // point 2
}

$(document).ready(function() // RECTANGLE MAIN
{
	var c = document.getElementById('rectangleCanvas');
	var ctx = c.getContext('2d');
	
	c.addEventListener('click', function(event)
	{
		var mousePosition = getMousePosition(c, event);
		
		if (rectangle.clickCount === 0)
		{
			ctx.fillRect(mousePosition.x, mousePosition.y, 1, 1);
			rectangle.point1.x = mousePosition.x;
			rectangle.point1.y = mousePosition.y;
			rectangle.clickCount++;
			rectangle.enableRubberBandDraw = true;
		}
		else if (rectangle.clickCount === 1)
		{
			ctx.clearRect(0, 0, c.width, c.height);
			drawRectangle(ctx, rectangle.point1, rectangle.point2); // draw rectangle
			rectangle.clickCount++;
			rectangle.enableRubberBandDraw = false;
		}
		else
		{
			ctx.clearRect(0, 0, c.width, c.height);
			rectangle.clickCount = 0;
		}
	}, false);
	
	$("#rectangleCanvas").mousemove(function(event)
	{
		var mousePosition = getMousePosition(c, event); // gets mouse hover position
		
		if (rectangle.enableRubberBandDraw) // while enableRubberBandDraw = True
		{
			ctx.clearRect(0, 0, c.width, c.height); // clear canvas
			rectangle.point2.x = mousePosition.x; // get new point2.x
			rectangle.point2.y = mousePosition.y; // get new point2.y
			drawLine(ctx, rectangle.point1, rectangle.point2); // draw from point1 to point2
		}
	});
});

function drawRectangle(ctx, point1, point2) // DRAW RECTANGLE FUNCTION
{	
	var point1_x = rectangle.point1.x;
	var point1_y = rectangle.point1.y;
	var point2_x = rectangle.point2.x;
	var point2_y = rectangle.point2.y;
	var rPoint1, rPoint2, rPoint3, rPoint4;
	
	var dx = Math.abs(point2_x - point1_x);
	var dy = Math.abs(point2_y - point1_y);
	
	if ((point2_x >= point1_x) && (point2_y >= point1_y))
	{	
		rPoint1 = {x: point1_x, y: point1_y};
		rPoint2 = {x: point1_x + dx, y: point1_y};
		rPoint3 = {x: point1_x + dx, y: point1_y + dy};
		rPoint4 = {x: point1_x, y: point1_y + dy};
	}
	else if ((point2_x >= point1_x) && (point2_y < point1_y))
	{
		rPoint1 = {x: point1_x, y: point1_y};
		rPoint2 = {x: point1_x + dx, y: point1_y};
		rPoint3 = {x: point1_x + dx, y: point1_y - dy};
		rPoint4 = {x: point1_x, y: point1_y - dy};
	}
	else if ((point2_x < point1_x) && (point2_y >= point1_y))
	{
		rPoint1 = {x: point1_x, y: point1_y};
		rPoint2 = {x: point1_x - dx, y: point1_y};
		rPoint3 = {x: point1_x - dx, y: point1_y + dy};
		rPoint4 = {x: point1_x, y: point1_y + dy};
	}
	else if ((point2_x < point1_x) && (point2_y < point1_y))
	{
		rPoint1 = {x: point1_x, y: point1_y};
		rPoint2 = {x: point1_x - dx, y: point1_y};
		rPoint3 = {x: point1_x - dx, y: point1_y - dy};
		rPoint4 = {x: point1_x, y: point1_y - dy};
	}
	
	drawLine(ctx, rPoint1, rPoint2);
	drawLine(ctx, rPoint2, rPoint3);
	drawLine(ctx, rPoint3, rPoint4);
	drawLine(ctx, rPoint4, rPoint1);
}

function getMousePosition(c, event)
{
    var rect = c.getBoundingClientRect();
    return {x: event.clientX - rect.left, y: event.clientY - rect.top};
}

function drawLine(ctx, point1, point2)
{    
	var midpoint =
	{
		x: Math.floor((point1.x + point2.x) / 2),
		y: Math.floor((point1.y + point2.y) / 2)
	};
    
	ctx.fillRect(midpoint.x, midpoint.y, 1, 1);
    
	if ((point1.x !== midpoint.x || point1.y !== midpoint.y) && (point2.x !== midpoint.x || point2.y !== midpoint.y))
	{
        drawLine(ctx, point1, midpoint);
        drawLine(ctx, midpoint, point2);
    }
}
