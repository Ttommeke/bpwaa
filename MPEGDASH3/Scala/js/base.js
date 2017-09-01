var scene = new THREE.Scene();

$.mobile.loading().hide();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight-4);
document.body.appendChild( renderer.domElement );
var TimeClock = new THREE.Clock();
var fpsCounter = new Stats();
fpsCounter.showPanel(0);
document.body.appendChild( fpsCounter.dom );

var masterPlayer = undefined;
var masterPlayerControls = undefined;
var soundCubes = [];

var setPositionAudioListener = function(x,y,z) {
	if (masterPlayer != undefined) {
		masterPlayer.audioContext.listener.setPosition(x,y,z);
	}
};

var render = function() {
	fpsCounter.begin();
	var deltaTime = TimeClock.getDelta();

	if (Player.player != undefined) {
		Player.executeKeys(Player.player, deltaTime);
		Player.turnTowardsVector(Player.player, Events.mouse.position);
		Camera.moveCamera(Camera.camera, Utils.newVectorToNewVector(Player.player.position,1,Events.mouse.position), deltaTime, Camera.speed);
	}

	moveMouseCubeAndSelectSoundCube();

	renderer.render( scene, Camera.camera );
	fpsCounter.end();

	//console.log(cubeSelected, posLookMouse, soundCubes);

	//console.log(MouseSelect.whereDoesMouseLookOnDepth(5,Events.mouse.position.x,Events.mouse.position.z, Camera.camera.fov));

	requestAnimationFrame( render );
};

var mouseCube = Entity.createCube(0xCC0000,new THREE.Vector3(0.3,0.3,0.3),new THREE.Vector3(0,0.5,0),new THREE.Vector3(0,0,0));//var mouseCube =
scene.add(mouseCube);

var draggingSoundCube = false;
var soundCubeBeingDragged = undefined;

var moveMouseCubeAndSelectSoundCube = function() {
	var posLookMouse = MouseSelect.positionWhereMouseLooksOnYAxisFromCenterPoint(0.5,Events.mouse.position,Camera.camera.position, Camera.camera.fov);
	var cubeSelected = SoundCube.returnCubeFromListWhereCoordinatesAreIn(posLookMouse, soundCubes, { x: 1, y: 1, z: 1 });

	soundCubes.forEach(function(soundCube) {
		soundCube.cube.material.color.setHex( 0x0020CC );
	});

	Utils.setXYZ(mouseCube.position, posLookMouse);

	if (cubeSelected != undefined) {
		cubeSelected.cube.material.color.setHex( 0x99A9CC );
	}

	var leftMouseButtonUpdate = Events.mouse.leftMouseButton.readOutUpdate();

	if (draggingSoundCube) {
		if (leftMouseButtonUpdate.pressed) {
			soundCubeBeingDragged.manualMove(posLookMouse);
		} else {
			draggingSoundCube = false;
			soundCubeBeingDragged = undefined;
		}
	} else {
		if (leftMouseButtonUpdate.pressed && leftMouseButtonUpdate.updated && cubeSelected != undefined) {
			draggingSoundCube = true;
			soundCubeBeingDragged = cubeSelected;
			soundCubeBeingDragged.setManualMode(true);
		}
	}
};



$.getJSON("map.json", function(data) {

	Camera.speed = data.cameraSpeed;
	Camera.setCameraPositionAndRotation(Camera.camera, data.cameras[0]);

	data.lights.forEach(function(light) {
		scene.add(Light.generateLight(light));
	});

	var emap = Map.generateMapFromNumberMap(data.map);
	Map.loadMapInScene(emap, scene);

	Map.map = emap;

	renderer.setClearColor( Utils.stringHexToHex( data.clearcolor ), 1 );

	var player = Living.generateLiving(data.player);
	scene.add(player);
	Player.player = player;

	TimeClock.getDelta();
	render();
});

$('#bodyId').on("vmousedown", function(event) {
	Events.mouseDownEvent(event);
});
$('#bodyId').on("vmousemove", function(event) {
	Events.mouseMove(event);
});
$('#bodyId').on("vmouseup", function(event) {
	Events.mouseUpEvent(event);
});

/**********************************
************** Audio **************
**********************************/

var getMpdFile = function(url) {
    return sr.mpdParser(url);
};

getMpdFile("/MPEGDASH3/Scala/output/stream.mpd").then(function(mpd) {

    var periods = mpd.manifestInfo.periodInfos;

    var period = new Period(periods[0], function() {

        masterPlayer = new MasterPlayer(period);
		masterPlayerControls = new MasterPlayerControls(masterPlayer);

		masterPlayerControls.generateControlsInDiv("forControls");

		for (var i = 0; i < masterPlayer.metaDataStreamerPlayers.length; i++) {
			soundCubes[i] = new SoundCube(masterPlayer.metaDataStreamerPlayers[i].metaDataStreamer.initData.title, masterPlayer.metaDataStreamerPlayers[i]);
			scene.add(soundCubes[i].cube);

			var callback = function(activeMetaData) {
				var soundCube = undefined;

				for (var j = 0; j < soundCubes.length; j++) {
					if (activeMetaData.initData.title == soundCubes[j].title) {

						soundCube = soundCubes[j];
					}
				}

				soundCube.update(activeMetaData);
			};

			masterPlayer.metaDataStreamerPlayers[i].setOnUpdateCallback(callback);
		}
    });
});
