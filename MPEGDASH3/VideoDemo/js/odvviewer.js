var ODV = ODV || { VERSION: '1.0.0' };

ODV.MouseController = function(par, moveFunction, scrollFunction)
{
	var prevX = -1;
	var prevY = -1;
	var prnt = null;
	var onMoveIt = null;
	var onScrollWheel = null;
	var isFF = false;
	var haveListeners = false;

	var onMouseDown = function(e)
	{
		prevX = e.screenX;
		prevY = e.screenY;
	}

	var onMouseUp = function(e)
	{
		if (prevX >= 0 && prevY >= 0)
		{
			var diffX = e.screenX-prevX;
			var diffY = e.screenY-prevY;
			prevX = -1;
			prevY = -1;
			if (diffX != 0 || diffY != 0)
				onMoveIt(diffX, diffY);
		}
	}

	var onMouseMove = function(e)
	{
		if (prevX >= 0 && prevY >= 0)
		{
			var diffX = e.screenX-prevX;
			var diffY = e.screenY-prevY;

			prevX = e.screenX;
			prevY = e.screenY;

			if (diffX != 0 || diffY != 0)
				onMoveIt(diffX, diffY);
		}
	}

	var onMouseOut = function(e)
	{
		prevX = -1;
		prevY = -1;
	}

	var onMouseWheel = function(e)
	{
		var val = 0;

		if (e.wheelDelta > 0)
		{
			val = 1;
		}
		else if (e.wheelDelta < 0)
		{
			val = -1;
		}

		if (val != 0)
			onScrollWheel(val);

		e.preventDefault();
	}

	var onMouseWheelFF = function(e)
	{
		var val = 0;

		if (e.detail < 0)
		{
			val = 1;
		}
		else if (e.detail > 0)
		{
			val = -1;
		}

		if (val != 0)
			onScrollWheel(val);

		e.preventDefault();
	}

	this.addEventListeners = function(par, moveFunction, scrollFunction)
	{
		if (haveListeners)
			return;

		haveListeners = true;

		onMoveIt = moveFunction;
		onScrollWheel = scrollFunction;
		prnt = par;

		prevX = -1;
		prevY = -1;

		isFF = (/Firefox/i.test(navigator.userAgent));

		prnt.addEventListener("mousedown", onMouseDown, false);
		prnt.addEventListener("mouseup", onMouseUp, false);
		prnt.addEventListener("mousemove", onMouseMove, false);
		prnt.addEventListener("mouseout", onMouseOut, false);
		if (!isFF)
		{
			prnt.addEventListener("mousewheel", onMouseWheel, false);
		}
		else
		{
			prnt.addEventListener("DOMMouseScroll", onMouseWheelFF, false);
		}
	}

	this.removeEventListeners = function()
	{
		if (!haveListeners)
			return;

		haveListeners = false;

		prnt.removeEventListener("mousedown", onMouseDown, false);
		prnt.removeEventListener("mouseup", onMouseUp, false);
		prnt.removeEventListener("mousemove", onMouseMove, false);
		prnt.removeEventListener("mouseout", onMouseOut, false);
		if (!isFF)
		{
			prnt.removeEventListener("mousewheel", onMouseWheel, false);
		}
		else
		{
			prnt.removeEventListener("DOMMouseScroll", onMouseWheelFF, false);
		}
	}

	// Initialize stuff
	{
		this.addEventListeners(par, moveFunction, scrollFunction);
	}
}

ODV.CanvasElement = function()
{
	var container = null;
	var canvasIdentifier = null;
	var canvasElement = null;

	this.create = function(containerID, w, h)
	{
		if (canvasElement != null)
		{
			console.log("CanvasElement.create: canvas element was already created");
			return false;
		}

		container = document.getElementById(containerID);
		if (container == null)
		{
			console.log("CanvasElement.create: can't find container ID");
			return false;
		}

		canvasElement = document.createElement("canvas");
		canvasElement.width = w;
		canvasElement.height = h;

		var d = new Date();

		canvasIdentifier = "planar-canvas-";
		canvasIdentifier += d.getTime();

		canvasElement.id = canvasIdentifier;

		container.appendChild(canvasElement);

		return true;
	}

	this.destroy = function()
	{
		if (canvasElement == null)
		{
			console.log("CanvasElement.destroy: no canvas element exists yet");
			return false;
		}

		for (var i = 0; i < container.childNodes.length; i++ )
		{
			if (container.childNodes[i].id === canvasIdentifier)
			{
				container.removeChild(container.childNodes[i]);
				container = null;
				canvasIdentifier = null;
				canvasElement = null;
				return true;
			}
		}

		console.log("CanvasElement.destroy: couldn't find canvas element with identifier ", canvasIdentifier);
		return false;
	}

	this.getCanvas = function()
	{
		return canvasElement;
	}
}

// videoWidth and videoHeight of the video element must be known!
ODV.PlanarRenderer = function(canvasElem, videoElem, onMoveCallBack)
{
	var myVideo = videoElem;
	var myCanvas = canvasElem;
	var myContext = myCanvas.getContext("2d");
	var videoWidth = videoElem.videoWidth;
	var videoHeight = videoElem.videoHeight;

	var scrollScale = 100; 							// this is used to increase the scrolling resolution a bit, in case we're zoomed out
	var videoXstart = 0;							// X position of the view center
	var videoYstart = 0;							// Y position of the view center
	var zoomLevel = 0; // -Math.round(15*320/w);
	var windowWidth = -1;							// width of the video viewport that will be mapped to the canvas
	var windowHeight = -1;							// height of the video viewport that will be mapped to the canvas
	var windowScale = 1;							// scale used to calculate these sizes, will be used to calculate scroll offsets

	this.onMoveIt = function(dx, dy)
	{
		videoXstart -= Math.round((dx*scrollScale)*windowScale);
		videoYstart -= Math.round((dy*scrollScale)*windowScale);

		var centerX = videoXstart/scrollScale + windowWidth/2;
		var centerY = videoYstart/scrollScale + windowHeight/2;

		var lonPercantage = (centerX / videoWidth) - 0.5;
		var latPercentage = (centerY / videoHeight) - 0.5;

		onMoveCallBack(-lonPercantage * 360, latPercentage * 180);
	}

	this.onScrollIt = function(diff)
	{
		zoomLevel += diff;

		if (zoomLevel < -30)
		{
			zoomLevel = -30;
		}
		else if (zoomLevel > 40)
		{
			zoomLevel = 40;
		}

		if (zoomLevel == 0)
		{
			windowScale = 1;
			windowWidth = myCanvas.width;
			windowHeight = myCanvas.height;
		}
		else
		{
			windowScale = Math.pow(2, -1.0*zoomLevel/20.0);
			windowWidth = Math.round(myCanvas.width * windowScale);
			windowHeight = Math.round(myCanvas.height * windowScale);
		}
	}

	this.update = function()
	{
		var canvasWidth = myCanvas.width;
		var canvasHeight = myCanvas.height;
		var windowWidth2 = Math.round(windowWidth/2);
		var windowHeight2 = Math.round(windowHeight/2);
		var realXstart = Math.round(videoXstart/scrollScale) - windowWidth2;
		var realYstart = Math.round(videoYstart/scrollScale) - windowHeight2;

		if (videoHeight - realYstart  < windowHeight)
		{
			realYstart = videoHeight - windowHeight;
		}
		if (realYstart < 0)
		{
			realYstart = 0;
		}

		while (realXstart < 0)
		{
			realXstart += videoWidth;
		}

		while (realXstart >= videoWidth)
		{
			realXstart -= videoWidth;
		}

		videoXstart = (realXstart + windowWidth2)*scrollScale;
		videoYstart = (realYstart + windowHeight2)*scrollScale;

		var canvasPos = 0;
		var i = 0;
		var windowWidthLeft = windowWidth;
		var startPos = realXstart;
		var outputHeight = canvasHeight;
		var outputYPos = 0;

		if (windowHeight > videoHeight)
		{
			var frac = videoHeight/windowHeight;

			outputHeight = Math.round(outputHeight*frac);

			var diff = canvasHeight-outputHeight;

			outputYPos = Math.round(diff/2);
		}

		while (canvasPos < canvasWidth && i < 10)
		{
			var frameX0 = startPos%videoWidth;
			var frameX1 = frameX0+windowWidthLeft;
			var frameY0 = realYstart;
			var frameY1 = frameY0+windowHeight;
			var outputWidth = canvasWidth-canvasPos;

			if (frameY1 > videoHeight)
				frameY1 = videoHeight;
			if (frameX1 > videoWidth)
			{
				var frac = 1.0-(frameX1-videoWidth)/windowWidth;

				outputWidth = Math.round(frac*outputWidth);

				windowWidthLeft = frameX1-videoWidth;
				frameX1 = videoWidth;
				startPos = 0;
			}

			myContext.drawImage(myVideo, frameX0, frameY0, (frameX1-frameX0), (frameY1-frameY0),
					    canvasPos, outputYPos, outputWidth, outputHeight);

			canvasPos += outputWidth;
			i++;
		}

		if (outputYPos > 0)
		{
			myContext.fillRect(0, 0, canvasWidth, outputYPos);
		}
		if (outputYPos + outputHeight < canvasHeight)
		{
			myContext.fillRect(0, outputYPos + outputHeight, canvasWidth, canvasHeight - (outputYPos + outputHeight));
		}
	}

	this.clear = function()
	{
		// Nothing needs to be done here
	}

	videoXstart = Math.round(videoWidth/2*scrollScale);
	videoYstart = Math.round(videoHeight/2*scrollScale);

	this.onScrollIt(0);
}

// videoWidth and videoHeight of the video element must be known!
ODV.SphereRenderer = function(canvasElem, videoElem, onMoveCallBack)
{
	var myCanvas = canvasElem;
	var myVideo = videoElem;
	var fovBase = 70;
	var fov = fovBase;
	var camera = null;
	var scene = null;
	var videoTexture = null;
	var sphereMesh = null;
	var renderer = null;

	var width3D = canvasElem.width;
	var height3D = canvasElem.height;
	var lon = 180, lat = 0;

	var zoomLevel = 0;
	var mouseController = null;

	this.onMoveIt = function(dx, dy)
	{
		lon -= 0.1 * dx;
		lat += 0.1 * dy;

		onMoveCallBack(lon, lat);
	}

	this.onScrollIt = function(diff)
	{
		zoomLevel += diff;

		if (zoomLevel < -8)
		{
			zoomLevel = -8;
		}
		else if (zoomLevel > 15)
		{
			zoomLevel = 15;
		}

		fov = -4*zoomLevel + fovBase;
		camera.projectionMatrix.makePerspective( fov, width3D/height3D, 1, 1100 );
	}

	this.update = function()
	{
		var phi, theta;

		videoTexture.needsUpdate = true;

		lat = Math.max( - 85, Math.min( 85, lat ) );
		phi = ( 90 - lat ) * Math.PI / 180;
		theta = lon * Math.PI / 180;

		camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
		camera.target.y = 500 * Math.cos( phi );
		camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

		camera.lookAt( camera.target );

		renderer.render( scene, camera );
	}

	this.clear = function()
	{
		// Do we need to do some deinitialization here?
	}

	{
		var material;
		var params = {};

		params.canvas = myCanvas;

		camera = new THREE.PerspectiveCamera( fov, width3D/height3D, 1, 1100 );
		camera.target = new THREE.Vector3(0, 0, 0);

		videoTexture = new THREE.Texture(myVideo);
		material = new THREE.MeshBasicMaterial( { map: videoTexture } );

		sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(500, 100, 100), material);
		sphereMesh.scale.x = -1;

		scene = new THREE.Scene();
		scene.add(sphereMesh);

		renderer = new THREE.WebGLRenderer(params);
		renderer.setSize(width3D, height3D);
	}
}

ODV.Viewer = function(videoElement, containerID, delayMsec, w, h, use3D, onMoveCallBack)
{
	var videoWidth = 0;
	var videoHeight = 0;

	var myCanvasElement = null;
	var myCanvas = null;
	var myVideo = videoElement;
	var myTimer = null;
	var mouseController = null;
	var myRenderer = null;

	var useWebGL = use3D !== undefined ? use3D:true;
	var containerWidth = w !== undefined ? w:320;
	var containerHeight = h !== undefined ? h:240;
	var updateMSec = delayMsec !== undefined ? delayMsec:50;

	var update = function()
	{
		if (videoWidth > 0 && videoHeight > 0)
		{
			if (myRenderer != null)
				myRenderer.update();
		}
		else
		{
			if (myVideo.videoWidth > 0 && myVideo.videoHeight > 0)
			{
				videoWidth = myVideo.videoWidth;
				videoHeight = myVideo.videoHeight;

				if (useWebGL)
				{
					try
					{
						myRenderer = new ODV.SphereRenderer(myCanvas, myVideo, onMoveCallBack);
					}
					catch(error)
					{
						console.log("Couldn't create WebGL based viewer: ", error);
						myRenderer = new ODV.PlanarRenderer(myCanvas, myVideo, onMoveCallBack);
					}
				}
				else
				{
					myRenderer = new ODV.PlanarRenderer(myCanvas, myVideo, onMoveCallBack);
				}

				mouseController = new ODV.MouseController(myCanvas, myRenderer.onMoveIt, myRenderer.onScrollIt);
			}
		}
	}

	this.clear = function()
	{
		if (myRenderer != null)
		{
			myRenderer.clear();
		}
		myRenderer = null;

		if (myTimer != null)
		{
			clearInterval(myTimer);
		}
		myTimer = null;

		if (mouseController != null)
		{
			mouseController.removeEventListeners();
		}
		mouseController = null;

		if (myCanvasElement != null)
		{
			myCanvasElement.destroy();
		}

		myCanvasElement = null;
		myCanvas = null;
		myContext = null;
		myVideo = null;
	}

	if (containerWidth < 32)
		containerWidth = 32;
	if (containerHeight < 32)
		containerHeight = 32;
	if (updateMSec < 10)
		updateMSec = 10;

	myCanvasElement = new ODV.CanvasElement();
	if (myCanvasElement.create(containerID, containerWidth, containerHeight))
	{
		myCanvas = myCanvasElement.getCanvas();
		if (myVideo != null)
		{
			if (myVideo.width == 0) // we'll get an error otherwise in the WebGL case
				myVideo.width = 10;

			if (myVideo.height == 0)
				myVideo.height = 10;

			myTimer = setInterval(update, updateMSec);
		}
		else
		{
			console.log("ODVViewer: can't get video element");
		}
	}
	else
	{
		console.log("ODVViewer: can't create canvas");
	}
}

ODV.odvViewerInstance = null;

ODV.initViewer = function(videoID, containerID, updateMsec, containerWidth, containerHeight, use3D, onMoveCallBack)
{
	if (ODV.odvViewerInstance != null)
		return;

	ODV.odvViewerInstance = new ODV.Viewer(videoID, containerID, updateMsec, containerWidth, containerHeight, use3D, onMoveCallBack);
}

ODV.clearViewer = function()
{
	if (ODV.odvViewerInstance == null)
		return;

	ODV.odvViewerInstance.clear();
	ODV.odvViewerInstance = null;
}
