What’s Implemented:

1. Square Fractal with attribute controls (Exam 1 Question 1)
2. Wheel with attribute controls (Exam 1 Question 2)

Approach:

Wheel Implementation -- This implementation I thought was the easiest. First I created if statements for each type of wheel given the driver score restrictions. For the circle, I just drew a circle. For the ellipse, I made the Y radius scale depending on the driver score. For the polygon, I made a for loop that draws line segments at a calculated angle given the amount of sides the polygon has. Moreover, if the driver score is lower than 3, I drew text on the canvas that said the driver score is too low to make a wheel. 

Fractal Implementation -- This is the implementation I ran into problems with; stated in the "Problems" section (below). 

Problems:

I ran into problems when trying to create a function that creates a fractal with no restrictions to its iterations. I had to stop at four iterations max because I couldn’t wrap my head around a pattern that would work in a loop.

My secondIteration and thirdIteration functions look similar, but they are still not similar enough to merge the two togeter and throw a loop into the mix. Maybe if I had a little more time to brainstorm I would end up finding a way to do it.

I understood the fractal creation. I just couldn't think of a way to implement a function that created a fractal given the iteration parameter; each iteration called for more squares, this is what confused me.
