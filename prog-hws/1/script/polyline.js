var polyline = // POLYLINE OBJECT
{
	clickCount: 0, // click counter
	point1: {x: null, y: null}, // point 1
	point2: {x: null, y: null} // point 2
};

$(document).ready(function() // POLYLINE MAIN
{
	var c = document.getElementById('polylineCanvas');
	var ctx = c.getContext('2d');
	
	c.addEventListener('click', function(event)
	{
		var mousePosition = getMousePosition(c, event);
		
		if (polyline.clickCount === 0)
		{
			ctx.fillRect(mousePosition.x, mousePosition.y, 1, 1); // fill one pixel at mouse position
			polyline.point1.x = mousePosition.x; // get starting point x
			polyline.point1.y = mousePosition.y; // get starting point y
			polyline.clickCount++; // increment clickCount
		}
		else if (polyline.clickCount !== 0)
		{
			ctx.fillRect(mousePosition.x, mousePosition.y, 1, 1);
			polyline.point2.x = mousePosition.x; // get endpoint x
			polyline.point2.y = mousePosition.y; // get endpoint y
			polyline.clickCount++;
			drawLine(ctx, polyline.point1, polyline.point2);
			polyline.point1.x = polyline.point2.x; // make endpoint x new starting point x
			polyline.point1.y = polyline.point2.y; // make endpoint y new starting point y
		}
		else // program should never enter this statement
		{
			ctx.clearRect(0, 0, c.width, c.height); // clear canvas
			polyline.clickCount = 0; // reset click count
		}
	}, false);
	
	$("#polylineCanvas").mousemove(function(event)
	{
		var mousePosition = getMousePosition(c, event); // gets mouse hover position
	});
});

/*
 * FAIL SAFES to implement:
 *
 * if line created on polyline intersects, dont create that line
 *
 * if line created on polyline touches another endpoint, dont create that line
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
