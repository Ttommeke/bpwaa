
var MouseSelect = {

};

MouseSelect.whereDoesMouseLookOnDepth = function(depth, x, z) {
    var biggestSide = window.innerWidth;

    if (biggestSide < window.innerHeight) {
        biggestSide = window.innerHeight;
    }

    var fovInRadians = Camera.camera.fov * Math.PI / 180;

    var angleX = MouseSelect.relativeCoordinateToAngle(biggestSide/2, fovInRadians/2, x);
    var angleZ = MouseSelect.relativeCoordinateToAngle(biggestSide/2, fovInRadians/2, z);

    var relativeX = MouseSelect.generateRelativeCoordinateFromAngleAndDepth(angleX, depth);
    var relativeZ = MouseSelect.generateRelativeCoordinateFromAngleAndDepth(angleZ, depth);

    return {
        x: relativeX,
        z: relativeZ
    };
}

MouseSelect.generateRelativeCoordinateFromAngleAndDepth = function(angle, depth) {
    return depth * Math.tan(angle);
};

MouseSelect.relativeCoordinateToAngle = function(maxWitdh,maxAngle,width) {
    var tanOfMaxAngle = Math.tan(maxAngle);
    var depth = maxWitdh / tanOfMaxAngle;

    return Math.atan(width/depth);
};
