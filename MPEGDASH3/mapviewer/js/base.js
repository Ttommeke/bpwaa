var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight-4);
document.body.appendChild( renderer.domElement );
var TimeClock = new THREE.Clock();
var fpsCounter = new Stats();
fpsCounter.showPanel(0);
document.body.appendChild( fpsCounter.dom );

var mouseCube = Entity.createCube(0xCC0000,new THREE.Vector3(0.3,0.3,0.3),new THREE.Vector3(0,0.5,0),new THREE.Vector3(0,0,0));//var mouseCube =
scene.add(mouseCube);
var masterPlayer = undefined;

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

var moveMouseCubeAndSelectSoundCube = function() {
	var posLookMouse = MouseSelect.positionWhereMouseLooksOnYAxisFromCenterPoint(0.5,Events.mouse.position,Camera.camera.position, Camera.camera.fov);
	var cubeSelected = Entity.returnCubeFromListWhereCoordinatesAreIn(posLookMouse, soundCubes, { x: 1, y: 1, z: 1 });

	soundCubes.forEach(function(soundCube) {
		soundCube.material.color.setHex( 0x0020CC );
	});

	Utils.setXYZ(mouseCube.position, posLookMouse);

	if (cubeSelected != undefined) {
		cubeSelected.material.color.setHex( 0x99A9CC );
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

/**********************************
************** Audio **************
**********************************/

var getMpdFile = function(url) {
    return sr.mpdParser(url);
};

var periodSegmentReady = function(period) {

    period.getNextSegment().then(function() {
        periodSegmentReady(period);
        //console.log(stream.sourceBuffer.mode);
    }).catch(function() {
        console.log("all streams are loaded!");
    });
};

getMpdFile("/MPEGDASH2/song/output/stream.mpd").then(function(mpd) {

    var periods = mpd.manifestInfo.periodInfos;


    var period = new Period(periods[0], function() {
        //periodSegmentReady(period);
		period.startBufferProccess();

        masterPlayer = new MasterPlayer(period);

        masterPlayer.play();

		for (var i = 0; i < masterPlayer.metaDataStreamerPlayers.length; i++) {
			soundCubes[i] = Entity.createCube(0x0020CC,new THREE.Vector3(0.3,0.3,0.3),new THREE.Vector3(0,0.5,0),new THREE.Vector3(0,0,0));//function( myColor, scale, pos, rotation) {
			soundCubes[i].title = masterPlayer.metaDataStreamerPlayers[i].metaDataStreamer.initData.title;
			scene.add(soundCubes[i]);

			var callback = function(activeMetaData) {
				var soundCube = undefined;

				for (var j = 0; j < soundCubes.length; j++) {
					if (activeMetaData.initData.title == soundCubes[j].title) {

						soundCube = soundCubes[j];
					}
				}

				var currentTime = activeMetaData.currentTime;

		        var before = activeMetaData.before;

		        var after = activeMetaData.after;

		        var deltaT = after.moment - before.moment + 0.0000001;
		        var deltaBefore = currentTime - before.moment;
		        var deltaAfter = after.moment - currentTime;

		        var x = (before.x * (deltaT - deltaBefore) + after.x * (deltaT - deltaAfter)) / deltaT;
		        var y = (before.y * (deltaT - deltaBefore) + after.y * (deltaT - deltaAfter)) / deltaT;
		        var z = (before.z * (deltaT - deltaBefore) + after.z * (deltaT - deltaAfter)) / deltaT;

				soundCube.position.x = x;
				soundCube.position.y = y+0.5;
				soundCube.position.z = z;

				var extraScale = Math.abs(Math.sin(currentTime*8))/3 + 1;
				soundCube.scale.x = extraScale;
				soundCube.scale.y = extraScale;
				soundCube.scale.z = extraScale;
			};

			masterPlayer.metaDataStreamerPlayers[i].setOnUpdateCallback(callback);
		}
    });
});
