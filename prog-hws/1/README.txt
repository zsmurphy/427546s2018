What’s Implemented:

1. Midpoint algorithm for line
2. Midpoint algorithm for circle
3. Midpoint algorithm for ellipse
4. Algorithm to draw rectangles
5. Algorithm to draw polygons (closed)
6. Algorithm to draw polylines (open)
7. “Rubber banding” added to each algorithm (except polylines)

Approach:

Attempt 1 -- My first attempt at this project, I tried using buttons (stated in the project description). I quickly came to the conclusion that this wouldn’t work out (however I kept trying to brainstorm ways).

I created a canvas, a button (for each shape), and a JavaScript function (for each shape) that will run when the button is clicked using the onclick event. Nothing drew on the canvas. Even if something was drawn on the canvas, I wasn’t going to be able to click on the canvas and have the canvas read my clicks. I would have had to created textboxes where the user would be able to enter in points and then use those points to create a line segment, circle, ellipse, etc. 

Attempt 2 -- I quickly changed my approach and implemented a script for each shape (line, circle, ellipse, rectangle, polygon, polyline). I created a class for each shape in its given script including a click counter, points, and a boolean to enable rubber banding.

Each script has its main “$(document).ready(function(){ });” were the corresponding canvas is selected and is constantly looking for click events. In addition, each starts the same way, starting with one point (first click), and rubber banding to a second point (second click). After both points are created, I use midpoint algorithms and math to create the corresponding shape for that canvas.

Each shape has this same implementation, except for the polyline canvas. This is because the way I implemented it I only had two points to work with. After every mouse click (after the initial one), I make point2 equal to point1. Making the newly created endpoint of the line just drawn the new start point. I did this because I wanted the user to be able to create an endlessly long polyline, for usability purposes. And because if I removed a line of code (line 70) in the polygon script, a polyline would be created with rubber banding (at the set limit of 5 lines).

The polygon and polyline algorithms are extremely similar. A polygon is just a polyline where its endpoint is connected to the start point with another line segment.  Due to time constraints, I just settled with making it have a set number of sides so I could close off the “polyline” easier; making a polygon. I did not implement any fail-safes. For instance, you can just cross over an already created line segment.

Problems:

The algorithm that gave me the most difficulty was the ellipse. I started google searching methods to implement the ellipse algorithm, and I ran into something called the Bresenham’s procedure. I tried using that procedure to draw my ellipse, but my ellipse algorithm still didn’t work. This is because I forgot to re initialize the radii for X and Y. I just changed the definition to diameter and forgot I was still using radius to find my center point; thank god for console logs.
