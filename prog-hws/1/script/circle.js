var circle = // CIRCLE OBJECT
{
	clickCount: 0, // click counter
	enableRubberBandDraw: false, // rubberbanding
	point1: {x: null, y: null}, // point 0
	point2: {x: null, y: null} // point 1
}

$(document).ready(function() // CIRCLE MAIN
{
	var c = document.getElementById('circleCanvas');
	var ctx = c.getContext('2d');
	
	c.addEventListener('click', function(event)
	{
		var mousePosition = getMousePosition(c, event);
		
		if (circle.clickCount === 0)
		{
			ctx.fillRect(mousePosition.x, mousePosition.y, 1, 1);
			circle.point1.x = mousePosition.x;
			circle.point1.y = mousePosition.y;
			circle.clickCount++;
			circle.enableRubberBandDraw = true;
		}
		else if (circle.clickCount === 1)
		{
			ctx.clearRect(0, 0, c.width, c.height);
			drawCircle(ctx, circle.point1, circle.point2); // draw circle
			circle.clickCount++;
			circle.enableRubberBandDraw = false;
		}
		else
		{
			ctx.clearRect(0, 0, c.width, c.height);
			circle.clickCount = 0;
		}
	}, false);
	
	$("#circleCanvas").mousemove(function(event)
	{
		var mousePosition = getMousePosition(c, event); // gets mouse hover position
		
		if (circle.enableRubberBandDraw) // while enableRubberBandDraw = True
		{
			ctx.clearRect(0, 0, c.width, c.height); // clear canvas
			circle.point2.x = mousePosition.x; // get new point2.x
			circle.point2.y = mousePosition.y; // get new point2.y
			drawLine(ctx, circle.point1, circle.point2); // draw from point1 to point2
		}
	});
});

function drawCircle(ctx, point1, point2) // DRAW CIRCLE FUNCTION
{	
	/* 
	
	var point1_x = ellipse.point1.x;
	var point1_y = ellipse.point1.y;
	var point2_x = ellipse.point2.x;
	var point2_y = ellipse.point2.y;
	
	if ((point2_x >= point1_x) && (point2_y >= point1_y))
	{	
		var centerPointX = ellipse.point1.x + radius;
		var centerPointY = ellipse.point1.y + radius;
	}
	else if ((point2_x >= point1_x) && (point2_y < point1_y))
	{
		var centerPointX = ellipse.point1.x + radius;
		var centerPointY = ellipse.point1.y - radius;
	}
	else if ((point2_x < point1_x) && (point2_y >= point1_y))
	{
		var centerPointX = ellipse.point1.x - radius;
		var centerPointY = ellipse.point1.y + radius;
	}
	else if ((point2_x < point1_x) && (point2_y < point1_y))
	{
		var centerPointX = ellipse.point1.x - radius;
		var centerPointY = ellipse.point1.y - radius;
	}
	
	// Bresenham's procedure
	
	var delta = 2 - 2 * radius;
	var error = 0;
	var x, y;
	
	while (radius >= 0)
	{	
		ctx.fillRect(centerPointX + x, centerPointY + y, 1, 1);
		ctx.fillRect(centerPointX - x, centerPointY + y, 1, 1);
		ctx.fillRect(centerPointX + x, centerPointY - y, 1, 1);
		ctx.fillRect(centerPointX - x, centerPointY - y, 1, 1);
		
		error = 2 * (delta + y) - 1;
		
		if (delta > 0 && error <= 0)
		{
			x++;
			delta += 2 * x + 1;
		}
		
		error = 2 * (delta - x) - 1;
		
		if (delta > 0 && error > 0)
		{
			y--;
			delta += 1 - 2 * y;
		}
		
		x++;
		delta += 2 * (x - y);
		y--;
	}
	
	*/
	
	var midpoint =
	{
		x: Math.floor((point1.x + point2.x) / 2),
		y: Math.floor((point1.y + point2.y) / 2)
	};
	
	var radius = Math.sqrt(Math.pow(point1.x - midpoint.x, 2) + Math.pow(point1.y - midpoint.y, 2));
	var x, y, dx, dy, distance;
	
	for (x = midpoint.x - radius; x <= midpoint.x + radius; x++)
	{
		for (y = midpoint.y - radius; y <= midpoint.y + radius; y++)
		{
			dx = midpoint.x - x; // dx = change in x
			dy = midpoint.y - y; // dy = change in y                            _____________
			distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)); // return √ dx^2 + dy^2
			
			if ((distance > (radius - 1)) && (distance <= radius))
			{
				ctx.fillRect(x, y, 1, 1);
			}
		}
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
