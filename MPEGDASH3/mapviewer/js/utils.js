
var Utils = {

};

Utils.newVectorToNewVector = function(original, extra, direction) {
    var newV = new THREE.Vector3(0,0,0);
    newV.copy(original);
    var length = Math.sqrt(direction.x * direction.x + direction.z * direction.z) + 0.00000001;

    newV.x += extra * direction.x / length;
    newV.z += extra * direction.z / length;

    return newV;
}

Utils.setXYZ = function( toCopyTo, toCopy) {
    toCopyTo.x = toCopy.x;
    toCopyTo.y = toCopy.y;
    toCopyTo.z = toCopy.z;
};

Utils.stringHexToHex = function(stringHex) {
    return parseInt(stringHex, 16);
};
