
var Camera = {
    "camera": new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 ),
    "speed": 4
};

Camera.moveCamera = function(camera, positionToMoveTo, deltaTime, speed) {
    var difference = new THREE.Vector3(0,0,0);
    difference.subVectors(positionToMoveTo, camera.position);
    difference.y = 0;

    camera.position.addScaledVector(difference, speed * deltaTime);
}

Camera.setCameraPositionAndRotation = function(cameraToSet, cameraJson) {
    Utils.setXYZ(cameraToSet.position, cameraJson.position);
	Utils.setXYZ(cameraToSet.rotation, cameraJson.rotation);
}
