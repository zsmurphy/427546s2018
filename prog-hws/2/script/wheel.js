function wheel()
{
	var wheel = // WHEEL OBJECT
	{
		centerPoint: {x: null, y: null} // center point
	};

	$(document).ready(function() // MAIN
	{
		var c = document.getElementById('wheelCanvas');
		var ctx = c.getContext('2d');
		
		ctx.canvas.width = 400;
		ctx.canvas.height = 400;
		
		ctx.clearRect(0, 0, c.width, c.height); // clear canvas
		
		// Attributes	
		var driverScore = document.getElementById("driverScore").value;
		var radius = document.getElementById("radius").value;
		var lineWidth = document.getElementById("lineWidth").value;
		var strokeColor = document.getElementById("strokeColor").value;
		
		c.addEventListener('click', function(event)
		{
			var mousePosition = getMousePosition(c, event);
			
			ctx.clearRect(0, 0, c.width, c.height); // clear canvas
			wheel.centerPoint.x = mousePosition.x;
			wheel.centerPoint.y = mousePosition.y;
			drawWheel(ctx, wheel.centerPoint.x, wheel.centerPoint.y, driverScore, radius, lineWidth, strokeColor); // draw wheel
			
		}, false);
		
		$("#wheelCanvas").mousemove(function(event)
		{
			var mousePosition = getMousePosition(c, event); // gets mouse hover position
		});
	});

	function drawWheel(ctx, centerX, centerY, driverScore, radius, lineWidth, strokeColor) // DRAW WHEEL FUNCTION
	{	
		if (driverScore >= 100) // DRAW CIRCLE
		{
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = strokeColor;
			ctx.stroke();
		}
		else if (driverScore < 100 && driverScore >= 80) // DRAW ELLIPSE
		{
			var scaleY = driverScore / 100;
			
			var radiusX = radius;
			var radiusY = radius * scaleY;
			
			ctx.beginPath();
			ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI, false);
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = strokeColor;
			ctx.stroke();
		}
		else if (driverScore < 80 && driverScore > 2) // DRAW POLYGON
		{
			var sides = driverScore;
			var step = 2 * Math.PI / sides;
			var shift = (Math.PI / 180.0) * -18;
			
			ctx.beginPath();
			
			for (var i = 0; i <= sides; i++)
			{
				var curStep = i * step + shift;
				ctx.lineTo(centerX + radius * Math.cos(curStep), centerY + radius * Math.sin(curStep));
			}
			
			ctx.strokeStyle = strokeColor;
			ctx.lineWidth = lineWidth;
			ctx.stroke();
		}
		else // NO WHEEL
		{
			ctx.font = "bold 15px Arial"
			ctx.fillStyle = strokeColor;
			ctx.textAlign = "center";
			ctx.fillText("Your driver score is too", centerX, centerY - 8);
			ctx.fillText("low, you dont get a wheel.", centerX, centerY + 8);
		}
	}

	function getMousePosition(c, event)
	{
		var rect = c.getBoundingClientRect();
		return {x: event.clientX - rect.left, y: event.clientY - rect.top};
	}
}
