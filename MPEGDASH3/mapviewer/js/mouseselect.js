
var MouseSelect = {

};

MouseSelect.positionWhereMouseLooksOnYAxisFromCenterPoint = function(yDepth, posMouse, posCenterPoint, fov) {
    var relativePosition = MouseSelect.whereDoesMouseLookOnDepth(posCenterPoint.y - yDepth, posMouse.x, posMouse.z, fov);

    return {
        x : relativePosition.x + posCenterPoint.x,
        y : yDepth,
        z : relativePosition.z + posCenterPoint.z
    };
};

MouseSelect.whereDoesMouseLookOnDepth = function(depth, x, z, fov) {
    var biggestSide = window.innerHeight;

    var fovInRadians = fov * Math.PI / 180;

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
