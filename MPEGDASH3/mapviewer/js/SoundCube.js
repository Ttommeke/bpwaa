var SoundCube = function (title, metaDataStreamerPlayer) {
    this.cube = Entity.createCube(0x0020CC,new THREE.Vector3(0.3,0.3,0.3),new THREE.Vector3(0,0.5,0),new THREE.Vector3(0,0,0));
    this.title = title;
    this.metaDataStreamerPlayer = metaDataStreamerPlayer;
};

SoundCube.returnCubeFromListWhereCoordinatesAreIn = function(position, cubes, hitbox) {
    for (var i = 0; i < cubes.length; i++) {
        if (Entity.areCoordinatesInCube(position, cubes[i].cube, hitbox)) {
            return cubes[i];
        }
    };

    return undefined;
};

SoundCube.prototype.setManualMode = function(value) {
    this.metaDataStreamerPlayer.setManualMode(value);
};

SoundCube.prototype.manualMove = function(position) {
    if (this.metaDataStreamerPlayer.isInManualMode()) {
        Utils.setXYZ(this.cube.position,position);
        this.metaDataStreamerPlayer.manualMove(position);
    }
};

SoundCube.prototype.update = function (activeMetaData) {

    var soundCube = this.cube;

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
