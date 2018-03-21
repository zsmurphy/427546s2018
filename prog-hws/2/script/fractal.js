function fractal()
{	
	var fractal = // FRACTAL OBJECT
	{
		centerPoint: {x: null, y: null} // point 0
	};

	$(document).ready(function() // MAIN
	{
		var c = document.getElementById('fractalCanvas');
		var ctx = c.getContext('2d');
		
		ctx.canvas.width = 400;
		ctx.canvas.height = 400;
		
		ctx.clearRect(0, 0, c.width, c.height); // clear canvas
		
		// Attributes
		var ratio = document.getElementById("ratio").value;
		var iterations = document.getElementById("iterations").value;
		var sideLength = document.getElementById("sideLength").value;
		var fillColor = document.getElementById("fillColor").value;
		
		c.addEventListener('click', function(event)
		{
			var mousePosition = getMousePosition(c, event);
			
			ctx.clearRect(0, 0, c.width, c.height); // clear canvas
			fractal.centerPoint.x = mousePosition.x;
			fractal.centerPoint.y = mousePosition.y;
			drawFractal(ctx, fractal.centerPoint.x, fractal.centerPoint.y, ratio, iterations, sideLength, fillColor); // draw fractal
			
		}, false);

		$("#fractalCanvas").mousemove(function(event)
		{
			var mousePosition = getMousePosition(c, event); // gets mouse hover position
		});
	});

	function drawFractal(ctx, centerX, centerY, ratio, iterations, sideLength, fillColor)
	{
		centerX = centerX - (sideLength / 2);
		centerY = centerY - (sideLength / 2);
		
		var oSideLength = sideLength; // original sideLength
		
		if (iterations >= "1") // Base Square
		{
			ctx.beginPath();
			ctx.rect(centerX, centerY, sideLength, sideLength);
			ctx.fillStyle = fillColor;
			ctx.fill();
		}
		
		// Fractal
		
		if (iterations >= "2")
		{
			var iterationSideLength = sideLength / ratio;
			var sideLength = iterationSideLength * ratio;
			
			firstIteration(ctx, centerX, centerY, sideLength, iterationSideLength, fillColor);
		}
		
		if (iterations >= "3")
		{
			preSideLength = sideLength;
			iterationSideLength = iterationSideLength / ratio;
			sideLength = iterationSideLength * ratio;
			
			secondIteration(ctx, centerX, centerY, preSideLength, sideLength, iterationSideLength, fillColor);
		}
		
		if (iterations >= "4")
		{	
			preSideLength = sideLength;
			iterationSideLength = iterationSideLength / ratio;
			sideLength = iterationSideLength * ratio;
			
			thirdIteration(ctx, centerX, centerY, oSideLength, preSideLength, sideLength, iterationSideLength, fillColor);
		}
	}
	
	function firstIteration(ctx, centerX, centerY, sideLength, iterationSideLength, fillColor)
	{
		ctx.beginPath();
		ctx.rect(centerX + (sideLength / 2) - (iterationSideLength / 2), centerY - iterationSideLength, iterationSideLength, iterationSideLength);
		ctx.fillStyle = fillColor;
		ctx.fill();
		
		ctx.beginPath();
		ctx.rect(centerX + sideLength, centerY + (sideLength / 2) - (iterationSideLength / 2), iterationSideLength, iterationSideLength);
		ctx.fillStyle = fillColor;
		ctx.fill();
		
		ctx.beginPath();
		ctx.rect(centerX + (sideLength / 2) - (iterationSideLength / 2), centerY + sideLength, iterationSideLength, iterationSideLength);
		ctx.fillStyle = fillColor;
		ctx.fill();
		
		ctx.beginPath();
		ctx.rect(centerX - iterationSideLength, centerY + (sideLength / 2) - (iterationSideLength / 2), iterationSideLength, iterationSideLength);
		ctx.fillStyle = fillColor;
		ctx.fill();
	}
	
	function secondIteration(ctx, centerX, centerY, preSideLength, sideLength, iterationSideLength, fillColor)
	{
		centerX = centerX + (preSideLength / 2) - (sideLength / 2);
		centerY = centerY - sideLength;
		firstIteration(ctx, centerX, centerY, sideLength, iterationSideLength, fillColor);
		
		centerX = centerX + (preSideLength / 2) + (sideLength / 2);
		centerY = centerY + (preSideLength / 2) + (sideLength / 2);
		firstIteration(ctx, centerX, centerY, sideLength, iterationSideLength, fillColor);
		
		centerX = centerX - (preSideLength / 2) - (sideLength / 2);
		centerY = centerY + (preSideLength / 2) + (sideLength / 2);
		firstIteration(ctx, centerX, centerY, sideLength, iterationSideLength, fillColor);
		
		centerX = centerX - (preSideLength / 2) - (sideLength / 2);
		centerY = centerY - (preSideLength / 2) - (sideLength / 2);
		firstIteration(ctx, centerX, centerY, sideLength, iterationSideLength, fillColor);
	}
	
	function thirdIteration(ctx, centerX, centerY, oSideLength, preSideLength, sideLength, iterationSideLength, fillColor)
	{	
		centerX = centerX + (oSideLength / 2) - (preSideLength / 2);
		centerY = centerY - preSideLength;
		secondIteration(ctx, centerX, centerY, preSideLength, sideLength, iterationSideLength, fillColor);
		
		centerX = centerX + (oSideLength / 2) + (preSideLength / 2);
		centerY = centerY + (oSideLength / 2) + (preSideLength / 2);
		secondIteration(ctx, centerX, centerY, preSideLength, sideLength, iterationSideLength, fillColor);
		
		centerX = centerX - (oSideLength / 2) - (preSideLength / 2);
		centerY = centerY + (oSideLength / 2) + (preSideLength / 2);
		secondIteration(ctx, centerX, centerY, preSideLength, sideLength, iterationSideLength, fillColor);
		
		centerX = centerX - (oSideLength / 2) - (preSideLength / 2);
		centerY = centerY - (oSideLength / 2) - (preSideLength / 2);
		secondIteration(ctx, centerX, centerY, preSideLength, sideLength, iterationSideLength, fillColor);
	}
	
	/* 
	* to implement:
	*
	* No restriction on iterations
	*
	*/
	
	function getMousePosition(c, event)
	{
		var rect = c.getBoundingClientRect();
		return {x: event.clientX - rect.left, y: event.clientY - rect.top};
	}
}
