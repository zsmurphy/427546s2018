var line = // LINE OBJECT
{
	clickCount: 0, // click counter
	enableRubberBandDraw: false, // rubberbanding
	point1: {x: null, y: null}, // point 0
	point2: {x: null, y: null} // point 1
};

$(document).ready(function() // LINE MAIN
{
	var c = document.getElementById('lineCanvas');
	var ctx = c.getContext('2d');
	
	c.addEventListener('click', function(event)
	{
		var mousePosition = getMousePosition(c, event);
		
		if (line.clickCount === 0)
		{
			ctx.fillRect(mousePosition.x, mousePosition.y, 1, 1);
			line.point1.x = mousePosition.x;
			line.point1.y = mousePosition.y;
			line.clickCount++;
			line.enableRubberBandDraw = true;
		}
		else if (line.clickCount == 1)
		{
			line.clickCount++;
			line.enableRubberBandDraw = false;
		}
		else
		{
			ctx.clearRect(0, 0, c.width, c.height); // clear canvas
			line.clickCount = 0; // reset click count
		}
	}, false);

	$("#lineCanvas").mousemove(function(event)
	{
		var mousePosition = getMousePosition(c, event); // gets mouse hover position
		
		if (line.enableRubberBandDraw) // while enableRubberBandDraw = True
		{
			ctx.clearRect(0, 0, c.width, c.height); // clear canvas
			line.point2.x = mousePosition.x; // get new point2.x
			line.point2.y = mousePosition.y; // get new point2.y
			drawLine(ctx, line.point1, line.point2); // draw from point1 to point2
		}
	});
});

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
