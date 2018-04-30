"use strict"; // strict mode
 
(function()
{ 
	/* private variables */
	var scr;
	var canvas;
	var cubes;
	var faces;
	var nx;
	var ny;
	var nw;
	var nh;
	var xm = 0;
	var ym = 0;
	var cx = 50;
	var cy = 50;
	var cz = 0;
	var cxb = 0;
	var cyb = 0;
	var white;
	//var fps = 0;
	var faceOver;
	var drag;
	var moved;
	var startX = 0;
	var startY = 0;
	var cosX;
	var sinX;
	var cosY;
	var sinY;
	var cosZ;
	var sinZ;
	var minZ;
	var angleX = 0;
	var angleY = 0;
	var angleZ = 0;
	var bkgColor = "rgba(0, 0, 0, 0.1)";
	var autorotate = false;
	var running = true;
	var translation = false;
	
	/* field of view */
	var fl = 250;
	var zoom = 0;
	
	/** Canvas Constructor **/
	var Canvas = function(id)
	{
		this.container = document.getElementById(id);
		this.ctx = this.container.getContext("2d");
		
		this.resize = function(w, h)
		{
			this.container.width = w;
			this.container.height = h;
		}
	};
	
	/** Vertex Constructor **/
	var Point = function(parent, xyz, project)
	{ 
		this.project = project;
		this.xo = xyz[0];
		this.yo = xyz[1];
		this.zo = xyz[2];
		this.cube = parent;
	};
	
	Point.prototype.projection = function()
	{ 
		/* 3D rotation */
		var x = cosY * (sinZ * this.yo + cosZ * this.xo) - sinY * this.zo;
		var y = sinX * (cosY * this.zo + sinY * (sinZ * this.yo + cosZ * this.xo)) + cosX * (cosZ * this.yo - sinZ * this.xo);
		var z = cosX * (cosY * this.zo + sinY * (sinZ * this.yo + cosZ * this.xo)) - sinX * (cosZ * this.yo - sinZ * this.xo);
		
		this.x = x;
		this.y = y;
		this.z = z;
		
		if (this.project)
		{
			/* point visible */
			if (z < minZ) minZ = z;
			this.visible = (zoom + z > 0);
			
			/* 3D to 2D projection */
			this.X = (nw * 0.5) + x * (fl / (z + zoom));
			this.Y = (nh * 0.5) + y * (fl / (z + zoom));
		}
	};
	
	/** Polygon Constructor **/
	var Face = function(cube, index, normalVector)
	{
		/* parent cube */
		this.cube = cube;
		
		/* coordinates */
		this.p0 = cube.points[index[0]];
		this.p1 = cube.points[index[1]];
		this.p2 = cube.points[index[2]];
		this.p3 = cube.points[index[3]];
		
		/* normal vector */
		this.normal = new Point(this, normalVector, false)
	};
	
	Face.prototype.pointerInside = function()
	{ 
		/* Is Point Inside Triangle? REXX Algorithm */
		
		var fAB = function(p1, p2, p3) { return (ym - p1.Y) * (p2.X - p1.X) - (xm - p1.X) * (p2.Y - p1.Y); };
		var fCA = function(p1, p2, p3) { return (ym - p3.Y) * (p1.X - p3.X) - (xm - p3.X) * (p1.Y - p3.Y); };
		var fBC = function(p1, p2, p3) { return (ym - p2.Y) * (p3.X - p2.X) - (xm - p2.X) * (p3.Y - p2.Y); };
		
		if (fAB(this.p0, this.p1, this.p3) * fBC(this.p0, this.p1, this.p3) > 0 && fBC(this.p0, this.p1, this.p3) * fCA(this.p0, this.p1, this.p3) > 0)
		{
			return true;
		}
		else if (fAB(this.p1, this.p2, this.p3) * fBC(this.p1, this.p2, this.p3) > 0 && fBC(this.p1, this.p2, this.p3) * fCA(this.p1, this.p2, this.p3) > 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	};
	
	Face.prototype.faceVisible = function()
	{ 
		/* points visible */
		if (this.p0.visible && this.p1.visible && this.p2.visible && this.p3.visible)
		{
			/* back face culling */
			if ((this.p1.Y - this.p0.Y) / (this.p1.X - this.p0.X) < (this.p2.Y - this.p0.Y) / (this.p2.X - this.p0.X) ^ this.p0.X < this.p1.X == this.p0.X > this.p2.X)
			{
				/* face visible */
				this.visible = true;
				return true;
			}
		}
		
		/* face hidden */
		this.visible = false;
		this.distance = -99999;
		return false;
	};
	
	Face.prototype.distanceToCamera = function()
	{
		/* distance to camera */
		var dx = (this.p0.x + this.p1.x + this.p2.x + this.p3.x) * 0.25;
		var dy = (this.p0.y + this.p1.y + this.p2.y + this.p3.y) * 0.25;
		var dz = (zoom + fl) + (this.p0.z + this.p1.z + this.p2.z + this.p3.z) * 0.25;
		this.distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
	};
	
	Face.prototype.draw = function()
	{
		/* shape face */
		canvas.ctx.beginPath();
		canvas.ctx.moveTo(this.p0.X, this.p0.Y);
		canvas.ctx.lineTo(this.p1.X, this.p1.Y);
		canvas.ctx.lineTo(this.p2.X, this.p2.Y);
		canvas.ctx.lineTo(this.p3.X, this.p3.Y);
		canvas.ctx.closePath();
		
		/* light */
		/*if (this == faceOver)
		{
			var r = 255;
			var g = 184;
			var b = 28;
		}
		else { }*/
		
		/* flat (lambert) shading */
		this.normal.projection();
		var r = (white ? this.normal.y + this.normal.z * 0.5 : this.normal.z) * 256;
		var g = (white ? this.normal.y + this.normal.z * 0.5 : this.normal.z) * 256;
		var b = (white ? this.normal.y + this.normal.z * 0.5 : this.normal.z) * 256;
		
		/* fill */
		canvas.ctx.fillStyle = "rgb(" + Math.round(r) + ", " + Math.round(g) + ", " + Math.round(b) + ")";
		canvas.ctx.fill();
	};
	
	/** Cube constructor **/
	var Cube = function(parent, nx, ny, nz, x, y, z, w)
	{ 
		if (parent)
		{ 
			/* translate parent points */
			this.w = parent.w;
			this.points = [];
			var i = 0;
			var p;
			
			while (p = parent.points[i++])
			{
				this.points.push(new Point(parent, [p.xo + nx, p.yo + ny, p.zo + nz], true));
			}
		}
		else
		{
			/* create points */
			this.w = w;
			this.points = [];
			
			var p = [
				[x - w, y - w, z - w],
				[x + w, y - w, z - w],
				[x + w, y + w, z - w],
				[x - w, y + w, z - w],
				[x - w, y - w, z + w],
				[x + w, y - w, z + w],
				[x + w, y + w, z + w],
				[x - w, y + w, z + w]
			];
			
			for (var i in p)
			{
				this.points.push(new Point(this, p[i], true));
			}
		}
		
		/* faces coordinates */
		var f = [
			[0, 1, 2, 3],
			[0, 4, 5, 1],
			[3, 2, 6, 7],
			[0, 3, 7, 4],
			[1, 5, 6, 2],
			[5, 4, 7, 6]
		];
		
		/* faces normals */
		var nv = [
			[0, 0, 1],
			[0, 1, 0],
			[0, -1, 0],
			[1, 0, 0],
			[-1, 0, 0],
			[0, 0, -1]
		];
		
		/* push faces */
		for (var i in f)
		{
			faces.push(new Face(this, f[i], nv[i]));
		}
		
		//ncube++;
	};
	
	var resize = function()
	{ 
		/* screen resize */
		nw = scr.offsetWidth;
		nh = scr.offsetHeight;
		
		var o = scr;
		
		for (nx = 0, ny = 0; o != null; o = o.offsetParent)
		{
			nx += o.offsetLeft;
			ny += o.offsetTop;
		}
		
		canvas.resize(nw, nh);
	};
	
	var createCube = function()
	{
		/* create cube */
		cubes = [];
		faces = [];
		//ncube = 0;
		cubes.push(new Cube(false, 0, 0, 0, 0, 0, 0, 50));
	};
	
	var detectFaceOver = function()
	{
		/* detect pointer over face */
		var j = 0;
		var f;
		
		faceOver = false;
		
		while (f = faces[j++])
		{
			if (f.visible)
			{
				if (f.pointerInside())
				{
					faceOver = f;
				}
			}
			else
			{
				break;
			}
		}
	};
	
	var init = function()
	{
		/* init script */
		scr = document.getElementById("screen"); 
		canvas = new Canvas("canvas"); 
		
		/** unified touch/mouse events handler **/
		scr.ontouchstart = scr.onmousedown = function(e)
		{
			if (!running)
			{
				return true;
			}
			
			/* touchstart */
			if (e.target !== canvas.container)
			{
				return;
			}
			
			e.preventDefault(); // prevents scrolling
			
			if (scr.setCapture)
			{
				scr.setCapture();
			}
			
			moved = false;
			drag = true;
			
			startX = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX) - nx;
			startY = (e.clientY !== undefined ? e.clientY : e.touches[0].clientY) - ny;
		};
		
		scr.ontouchmove = scr.onmousemove = function(e)
		{
			if (!running)
			{
				return true;
			}
			
			/* touchmove */
			e.preventDefault();
			
			xm = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX) - nx;
			ym = (e.clientY !== undefined ? e.clientY : e.touches[0].clientY) - ny;
			
			detectFaceOver();
			
			if (drag)
			{
				cx = cxb + (xm - startX);
				cy = cyb - (ym - startY);
			}
			
			if (Math.abs(xm - startX) > 10 || Math.abs(ym - startY) > 10)
			{
				moved = true; // if pointer moves then cancel the tap/click
			}
		};
		
		scr.ontouchend = scr.onmouseup = function(e)
		{
			if (!running)
			{
				return true;
			}
			
			/* touchend */
			e.preventDefault();
			
			if (scr.releaseCapture)
			{
				scr.releaseCapture();
			}
			
			drag = false;
			cxb = cx;
			cyb = cy;
			
			if (!moved)
			{
				/* click/tap */
				xm = startX;
				ym = startY;
				//click();
			}
		};
		
		scr.ontouchcancel = function(e)
		{
			if (!running)
			{
				return true;
			}
			
			/* reset */
			/*if (scr.releaseCapture)
			{
				scr.releaseCapture();
			}*/
			
			moved = false;
			drag = false;
			
			cxb = cx;
			cyb = cy;
			
			startX = 0;
			startY = 0;
		};
		
		/* Z axis rotation (mouse wheel) */
		scr.addEventListener('DOMMouseScroll', function(e)
		{
			if (!running)
			{
				return true;
			}
			
			cz += e.detail * 12;
			return false;

		}, false);
		
		scr.onmousewheel = function()
		{
			if (!running)
			{
				return true;
			}
			
			cz += event.wheelDelta / 5;
			return false;
		}
		
		/* multi-touch gestures */
		document.addEventListener('gesturechange', function(e)
		{
			if (!running)
			{
				return true;
			}
			
			e.preventDefault();
			
			/* Z axis rotation */
			cz = event.rotation;
		
		}, false);
		
		/* screen size */
		resize();
		window.addEventListener('resize', resize, false);
		
		/* fps count */
		/*setInterval(function()
		{
			document.getElementById('fps').innerHTML = fps * 2;
			fps = 0;
			
		}, 500); // update every 500 miliseconds (0.5 seconds)*/
		
		/** console log **/
		setInterval(function()
		{
			console.clear();
			console.log("nw:", nw, " nh:", nh, " xm:", xm, " ym:", ym, );
			console.log("cx:", cx, " cy:", cy, " cz:", cz, " cxb:", cxb, " cyb:", cyb);
			console.log("startX:", startX, " startY:", startY);
			console.log("cosX:", cosX, " cosY:", cosY, " cosZ:", cosZ);
			console.log("sinX:", sinX, " sinY:", sinY, " sinZ:", sinZ);
			console.log("minZ:", minZ, " zoom:", zoom);
			console.log("angleX:", angleX, " angleY:", angleY, " angleZ:", angleZ);
			console.log("autorotate:", autorotate, " running:", running, " translation:", translation, " drag:", drag, " moved:", moved);
			
		}, 500);
		
		/* UI option: dimetric projection */
		document.getElementById("dimetric").onclick = function()
		{
			cx = 77;
			cy = 43;
			cz = 0;
			cxb = 77;
			cyb = 43;
			startX = 505;
			startY = 459; 
			cosX = 0.9089657496748854;
			sinX = 0.4168708024292101;
			cosY = 0.7179106696109424;
			sinY = 0.6961352386273578;
			cosZ = 1;
			sinZ = 0;
			minZ = -85;
			angleX = 43;
			angleY = 77;
			angleZ = 0;
		}
		
		/* UI option: trimetric projection */
		document.getElementById("trimetric").onclick = function()
		{
			cx = 50;
			cy = 50;
			cz = 0;
			cxb = 0;
			cyb = 0;
			startX = 0;
			startY = 0;
			cosX = 0.8775825618903731;
			sinX = 0.4794255386042024;
			cosY = 0.8775825618903731;
			sinY = 0.4794255386042024;
			cosZ = 1;
			sinZ = 0;
			minZ = -83.51560919711103;
			angleX = 50;
			angleY = 50;
			angleZ = 0;
		}
		
		/* UI option: isometric projection */
		document.getElementById("isometric").onclick = function()
		{
			cx = 78;
			cy = 62;
			cz = 0;
			cxb = 78;
			cyb = 62;
			startX = 328;
			startY = 317;
			cosX = 0.8138784566625343;
			sinX = 0.5810351605373045;
			cosY = 0.7109135380122763;
			sinY = 0.7032794192004113;
			cosZ = 1;
			sinZ = 0;
			minZ = -86.60081709882961;
			angleX = 62;
			angleY = 78;
			angleZ = 0;
		}
		
		/* UI option: orthographic projection */
		document.getElementById("orthographic").onclick = function()
		{
			cx = 0;
			cy = 0;
			cz = 0;
			cxb = 0;
			cyb = 0;
			startX = 328;
			startY = 250;
			cosX = 1;
			sinX = 0;
			cosY = 1;
			sinY = 0;
			cosZ = 1;
			sinZ = 0;
			minZ = -50;
			angleX = 4.4e-323;
			angleY = 4.4e-323;
			angleZ = 0;
		}
		
		/* UI option: sheering*/
		document.getElementById("sheering").onclick = function()
		{
			//Not Implemented
		}
		
		/* UI option: translation*/
		document.getElementById("translation").onclick = function()
		{
			translation = !translation
			
			document.getElementById("translation").value = !translation ? "Start Translation" : "Stop Translation";
		}
		
		/* UI option: stop/start */
		document.getElementById("stopstart").onclick = function()
		{
			running = !running;
			
			document.getElementById("stopstart").value = running ? "Stop Animation" : "Start Animation";
			
			if (running)
			{
				run();
			}
		}
		
		/* UI option: autorotation */
		document.getElementById("autorotate").onclick = function()
		{
			autorotate = !autorotate
			
			document.getElementById("autorotate").value = !autorotate ? "Start Autorotation" : "Stop Autorotation";
		}
		
		/* start */
		createCube();
		run();
	}
	
	/*** MAIN LOOP ***/
	
	var run = function()
	{
		/* screen background */
		canvas.ctx.fillStyle = bkgColor;
		canvas.ctx.fillRect(0, 0, nw, nh);
		
		/* easing rotations */
		angleX += ((cy - angleX) * 0.05);
		angleY += ((cx - angleY) * 0.05);
		angleZ += ((cz - angleZ) * 0.05);
		
		if (autorotate)
		{
			cx += 0.5;
			cy += 0.5;
			cz += 0.5;
		}
		
		if (translation)
		{
			document.onkeypress = function(e)
			{
				e = e || window.event;
				
				var charCode = e.charCode || e.keyCode;
				var character = String.fromCharCode(charCode);
				
				//console.log(character, charCode);

				if (character === "D" || character === "d") // "D" = 68 || "d" = 100
				{
					nw += 4;
				}
				
				if (character === "A" || character === "a") // "A" = 65 || "a" = 97
				{
					nw -= 4;
				}
				
				if (character === "S" || character === "s") // "S" = 83 || "s" = 115
				{
					nh += 4;
				}
				
				if (character === "W" || character === "w") // "W" = 87 || "w" = 119
				{
					nh -= 4;
				}
				
				if (character === "B" || character === "b") // "B" = 66 || "b" = 98
				{
					zoom++;
				}
				
				if (character === "F" || character === "f") // "F" = 70 || "f" = 102
				{
					zoom--;
				}
			}
		}
		
		/* pre-calculating trigo */
		cosX = Math.cos(angleX * 0.01);
		sinX = Math.sin(angleX * 0.01);
		cosY = Math.cos(angleY * 0.01);
		sinY = Math.sin(angleY * 0.01);
		cosZ = Math.cos(angleZ * 0.01);
		sinZ = Math.sin(angleZ * 0.01);
		
		/* points projection */
		minZ = 0;
		var i = 0;
		var	c;
		
		while (c = cubes[i++])
		{
			var j = 0
			var p;
			
			while (p = c.points[j++])
			{
				p.projection();
			}
		}
		
		/* adapt zoom */
		if (!translation)
		{
			var d = -minZ + 100 - zoom;
			zoom += (d * ((d > 0) ? 0.05 : 0.01));
		}
		
		/* faces light */
		var j = 0;
		var f;
		
		while (f = faces[j++])
		{
			if (f.faceVisible())
			{
				f.distanceToCamera();
			}
		}
		
		/* faces depth sorting */
		faces.sort(function(p0, p1)
		{
			return p1.distance - p0.distance;
		});
		
		/* painting faces */
		j = 0;
		while (f = faces[j++])
		{
			if (f.visible)
			{
				f.draw();
			}
			else
			{
				break;
			}
		}
		
		/* animation loop */
		//fps++;
		if (running)
		{
			setTimeout(run, 10);
		}
	}
	
	return { /* onload event */
	
		load : function()
		{
			window.addEventListener('load', function()
			{
				init();
				
			}, false);
		}
	}
})().load(); /** (function() {}) ().load(); **/