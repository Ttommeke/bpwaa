
var Player = {};

Player.turnTowardsVector = function(player, lookVector) {
    var mouseVector = new THREE.Vector3(lookVector.x, 0, lookVector.z);
    var angleToMouse = mouseVector.angleTo(new THREE.Vector3(1,0,0));

    if (isNaN(angleToMouse)) {
        angleToMouse = 0;
    }
    if (lookVector.z > 0) {
        angleToMouse *= -1;
    }

    player.rotation.y = angleToMouse;
}

Player.executeKeys = function(player, deltaTime) {

    var direction = new THREE.Vector3(0,0,0);

    if (Events.keys.ArrowUp.isPressed()) {
        direction.z -= 1;
    }
    if (Events.keys.ArrowDown.isPressed()) {
        direction.z += 1;
    }
    if (Events.keys.ArrowLeft.isPressed()) {
        direction.x -= 1;
    }
    if (Events.keys.ArrowRight.isPressed()) {
        direction.x += 1;
    }

    direction.applyAxisAngle(new THREE.Vector3(0,1,0), player.rotation.y - 3.1415/2);

    Living.moveLivingWithCollisionCheck(player, deltaTime, direction, player.speed, Map.map);

    setPositionAudioListener(player.position.x,player.position.y,player.position.z);
}
