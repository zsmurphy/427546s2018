var ellipse = // ELLIPSE OBJECT
{
	clickCount: 0, // click counter
	enableRubberBandDraw: false, // rubberbanding
	point1: {x: null, y: null}, // point 1
	point2: {x: null, y: null} // point 2
}

$(document).ready(function() // ELLIPSE MAIN
{
	var c = document.getElementById('ellipseCanvas');
	var ctx = c.getContext('2d');
	
	c.addEventListener('click', function(event)
	{
		var mousePosition = getMousePosition(c, event);
		
		if (ellipse.clickCount === 0)
		{
			ctx.fillRect(mousePosition.x, mousePosition.y, 1, 1);
			ellipse.point1.x = mousePosition.x;
			ellipse.point1.y = mousePosition.y;
			ellipse.clickCount++;
			ellipse.enableRubberBandDraw = true;
		}
		else if (ellipse.clickCount === 1)
		{
			ctx.clearRect(0, 0, c.width, c.height);
			drawEllipse(ctx, ellipse.point1, ellipse.point2); // draw ellipse
			ellipse.clickCount++;
			ellipse.enableRubberBandDraw = false;
		}
		else
		{
			ctx.clearRect(0, 0, c.width, c.height);
			ellipse.clickCount = 0;
		}
	}, false);
	
	$("#ellipseCanvas").mousemove(function(event)
	{
		var mousePosition = getMousePosition(c, event); // gets mouse hover position
		
		if (ellipse.enableRubberBandDraw) // while enableRubberBandDraw = True
		{
			ctx.clearRect(0, 0, c.width, c.height); // clear canvas
			ellipse.point2.x = mousePosition.x; // get new point2.x
			ellipse.point2.y = mousePosition.y; // get new point2.y
			drawLine(ctx, ellipse.point1, ellipse.point2); // draw from point1 to point2
		}
	});
});

function drawEllipse(ctx, point1, point2) // DRAW ELLIPSE FUNCTION
{	
	var point1_x = ellipse.point1.x;
	var point1_y = ellipse.point1.y;
	var point2_x = ellipse.point2.x;
	var point2_y = ellipse.point2.y;
	
	var diameterX = Math.abs(point2_x - point1_x); // this is the diameter of the x axis
	var diameterY = Math.abs(point2_y - point1_y); // this is the diameter of the y axis
	var radiusX = diameterX / 2; // this is the radius of the x axis
	var radiusY = diameterY / 2; // this is the radius of the y axis
	
	if ((point2_x >= point1_x) && (point2_y >= point1_y))
	{	
		var centerPointX = ellipse.point1.x + radiusX;
		var centerPointY = ellipse.point1.y + radiusY;
	}
	else if ((point2_x >= point1_x) && (point2_y < point1_y))
	{
		var centerPointX = ellipse.point1.x + radiusX;
		var centerPointY = ellipse.point1.y - radiusY;
	}
	else if ((point2_x < point1_x) && (point2_y >= point1_y))
	{
		var centerPointX = ellipse.point1.x - radiusX;
		var centerPointY = ellipse.point1.y + radiusY;
	}
	else if ((point2_x < point1_x) && (point2_y < point1_y))
	{
		var centerPointX = ellipse.point1.x - radiusX;
		var centerPointY = ellipse.point1.y - radiusY;
	}
	
	// Bresenham's Procedure
	
	var x2 = Math.pow(diameterX, 2);
	var y2 = Math.pow(diameterY, 2);
	var sigmaX = 2 * y2 + x2 * (1 - 2 * diameterY);
	var sigmaY = 2 * x2 + y2 * (1 - 2 * diameterX);
	var x, y;
	
	for (x = 0, y = diameterY; y2 * x <= x2 * y; x++)
	{
		ctx.fillRect(centerPointX + x, centerPointY + y, 1, 1);
		ctx.fillRect(centerPointX - x, centerPointY + y, 1, 1);
		ctx.fillRect(centerPointX + x, centerPointY - y, 1, 1);
		ctx.fillRect(centerPointX - x, centerPointY - y, 1, 1);
		
		if (sigmaX >= 0)
		{
			sigmaX += 4 * x2 * (1 - y);
			y--;
		}
		sigmaX += y2 * ((4 * x) + 6);
	}
	for (x = diameterX, y = 0; x2 * y <= y2 * x; y++)
	{
		ctx.fillRect(centerPointX + x, centerPointY + y, 1, 1);
		ctx.fillRect(centerPointX - x, centerPointY + y, 1, 1);
		ctx.fillRect(centerPointX + x, centerPointY - y, 1, 1);
		ctx.fillRect(centerPointX - x, centerPointY - y, 1, 1);
		
		if (sigmaY >= 0)
		{
			sigmaY += 4 * y2 * (1 - x);
			x--;
		}
		sigmaY += x2 * ((4 * y) + 6);
	}
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
