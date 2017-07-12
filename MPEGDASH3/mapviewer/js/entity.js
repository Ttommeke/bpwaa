
var Entity = {

};

Entity.createCube = function( myColor, scale, pos, rotation) {

    pos = pos || new THREE.Vector3( 0, 0, 0 );
    rotation = rotation || new THREE.Vector3( 0, 1, 0 );

    var geometry = new THREE.BoxGeometry( scale.x, scale.y, scale.z );
    var material = new THREE.MeshLambertMaterial( { color: myColor } );
    var cube = new THREE.Mesh( geometry, material );
    Utils.setXYZ(cube.position, pos);
    Utils.setXYZ(cube.rotation, rotation);

    return cube;
};

Entity.areCoordinatesInCube = function(position, cube, hitbox) {
    var xLess = cube.position.x - hitbox.x/2;
    var xMore = cube.position.x + hitbox.x/2;
    var yLess = cube.position.y - hitbox.y/2;
    var yMore = cube.position.y + hitbox.y/2;
    var zLess = cube.position.z - hitbox.z/2;
    var zMore = cube.position.z + hitbox.z/2;

    if (
        xLess <= position.x && xMore >= position.x &&
        yLess <= position.y && xMore >= position.y &&
        zLess <= position.z && xMore >= position.z
    ) {
        return true;
    } else {
        return false;
    }
};

Entity.returnCubeFromListWhereCoordinatesAreIn = function(position, cubes, hitbox) {
    for (var i = 0; i < cubes.length; i++) {
        if (Entity.areCoordinatesInCube(position, cubes[i], hitbox)) {
            return cubes[i];
        }
    };

    return undefined;
};

Entity.generateEntity = function(id, x, z) {

    if (id === 1) {
        return Entity.createCube(0x00FF00, new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( x, -0.5, z ), new THREE.Vector3(0,0,0));
    } else if (id === 2) {
        return Entity.createCube(0x0000FF, new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( x, -0.5, z ), new THREE.Vector3(0,0,0));
    } else if (id === 3) {
        return Entity.createCube(0xf9ec2c, new THREE.Vector3( 1, 3, 1 ), new THREE.Vector3( x, 0.5, z ), new THREE.Vector3(0,0,0));
    } else {
        return undefined;
    }
}
