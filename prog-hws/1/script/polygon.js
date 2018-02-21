var polygon = // POLYGON OBJECT
{
	clickCount: 0, // click counter
	enableRubberBandDraw: false, // rubberbanding
	point1: {x: null, y: null}, // point 1
	point2: {x: null, y: null}, // point 2
	point3: {x: null, y: null}, // point 3
	point4: {x: null, y: null}, // point 4
	point5: {x: null, y: null}, // point 5
	point6: {x: null, y: null} // point 6
};

$(document).ready(function() // POLYGON MAIN
{
	var c = document.getElementById('polygonCanvas');
	var ctx = c.getContext('2d');
	
	c.addEventListener('click', function(event)
	{
		var mousePosition = getMousePosition(c, event);
		
		if (polygon.clickCount === 0)
		{
			ctx.fillRect(mousePosition.x, mousePosition.y, 1, 1); // fill one pixel at mouse position
			polygon.point1.x = mousePosition.x; // get starting point x (point1.x)
			polygon.point1.y = mousePosition.y; // get starting point y (point1.y)
			polygon.clickCount++; // increment clickCount
			polygon.enableRubberBandDraw = true;
		}
		else if (polygon.clickCount === 1)
		{
			ctx.fillRect(mousePosition.x, mousePosition.y, 1, 1);
			polygon.point2.x = mousePosition.x; // get endpoint x (point2.x)
			polygon.point2.y = mousePosition.y; // get endpoint y (point2.y)
			polygon.clickCount++; // increment clickCount
			drawLine(ctx, polygon.point1, polygon.point2); // draw from point1 to point2
		}
		else if (polygon.clickCount === 2)
		{
			ctx.fillRect(mousePosition.x, mousePosition.y, 1, 1);
			polygon.point3.x = mousePosition.x; // get endpoint x (point3.x)
			polygon.point3.y = mousePosition.y; // get endpoint y (point3.y)
			polygon.clickCount++; // increment clickCount
			drawLine(ctx, polygon.point2, polygon.point3); // draw from point2 to point3
		}
		else if (polygon.clickCount === 3)
		{
			ctx.fillRect(mousePosition.x, mousePosition.y, 1, 1);
			polygon.point4.x = mousePosition.x; // get endpoint x (point4.x)
			polygon.point4.y = mousePosition.y; // get endpoint y (point4.y)
			polygon.clickCount++; // increment clickCount
			drawLine(ctx, polygon.point3, polygon.point4); // draw from point3 to point4
		}
		else if (polygon.clickCount === 4)
		{
			ctx.fillRect(mousePosition.x, mousePosition.y, 1, 1);
			polygon.point5.x = mousePosition.x; // get endpoint x (point5.x)
			polygon.point5.y = mousePosition.y; // get endpoint y (point5.y)
			polygon.clickCount++; // increment clickCount
			drawLine(ctx, polygon.point4, polygon.point5); // draw from point4 to point5
		}
		else if (polygon.clickCount === 5)
		{
			ctx.fillRect(mousePosition.x, mousePosition.y, 1, 1);
			polygon.point6.x = mousePosition.x; // get endpoint x (point6.x)
			polygon.point6.y = mousePosition.y; // get endpoint y (point6.y)
			polygon.clickCount++; // increment clickCount
			drawLine(ctx, polygon.point5, polygon.point6); // draw from point5 to point6
			polygon.enableRubberBandDraw = false;
			drawLine(ctx, polygon.point6, polygon.point1); // draw from point6 to point1 (finish polygon)
		}
		else
		{
			ctx.clearRect(0, 0, c.width, c.height); // clear canvas
			polygon.clickCount = 0; // reset click count
		}
	}, false);
	
	$("#polygonCanvas").mousemove(function(event)
	{
		var mousePosition = getMousePosition(c, event); // gets mouse hover position
		
		if (polygon.enableRubberBandDraw) // while enableRubberBandDraw = True
		{
			ctx.clearRect(0, 0, c.width, c.height); // clear canvas
			
			if (polygon.clickCount === 1)
			{
				polygon.point2.x = mousePosition.x; // get new point2.x
				polygon.point2.y = mousePosition.y; // get new point2.y
				drawLine(ctx, polygon.point1, polygon.point2); // draw from point1 to point2
			}
			if (polygon.clickCount === 2)
			{
				polygon.point3.x = mousePosition.x; // get new point3.x
				polygon.point3.y = mousePosition.y; // get new point3.y
				drawLine(ctx, polygon.point1, polygon.point2); // draw from point1 to point2
				drawLine(ctx, polygon.point2, polygon.point3); // draw from point2 to point3
			}
			if (polygon.clickCount === 3)
			{
				polygon.point4.x = mousePosition.x; // get new point4.x
				polygon.point4.y = mousePosition.y; // get new point4.y
				drawLine(ctx, polygon.point1, polygon.point2); // draw from point1 to point2
				drawLine(ctx, polygon.point2, polygon.point3); // draw from point2 to point3
				drawLine(ctx, polygon.point3, polygon.point4); // draw from point3 to point4
			}
			if (polygon.clickCount === 4)
			{
				polygon.point5.x = mousePosition.x; // get new point5.x
				polygon.point5.y = mousePosition.y; // get new point5.y
				drawLine(ctx, polygon.point1, polygon.point2); // draw from point1 to point2
				drawLine(ctx, polygon.point2, polygon.point3); // draw from point2 to point3
				drawLine(ctx, polygon.point3, polygon.point4); // draw from point3 to point4
				drawLine(ctx, polygon.point4, polygon.point5); // draw from point4 to point5
			}
			if (polygon.clickCount === 5)
			{
				polygon.point6.x = mousePosition.x; // get new point6.x
				polygon.point6.y = mousePosition.y; // get new point6.y
				drawLine(ctx, polygon.point1, polygon.point2); // draw from point1 to point2
				drawLine(ctx, polygon.point2, polygon.point3); // draw from point2 to point3
				drawLine(ctx, polygon.point3, polygon.point4); // draw from point3 to point4
				drawLine(ctx, polygon.point4, polygon.point5); // draw from point4 to point5
				drawLine(ctx, polygon.point5, polygon.point6); // draw from point5 to point6
			}
		}
	});
});

/* 
 * FAIL SAFES to implement:
 *
 * if line created on polygon intersects, dont create that line
 *
 * if line created on polygon touches another endpoint, dont create that line
 * unless implementation is done to create as many lines as a user wants until endpoints connect
 *
 * create a way to make line segments a variable instead of a constant (6)
 * then copy and paste code into polyline.js, remove line 70 and change the class name
 *
 */
 
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
