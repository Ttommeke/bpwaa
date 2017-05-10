
var Light = {
    WHITE: 0xFFFFFF,
    FULL_STRENGTH: 1
};

Light.createDirectionalLight = function(color, strength, pos ) {
    var directionalLight = new THREE.DirectionalLight( color, strength );
    Utils.setXYZ(directionalLight.position, pos);
    return directionalLight;
}

Light.createHemisphereLight = function( colorSky, colorGround, strength) {
    var hemiLight = new THREE.HemisphereLight( colorSky, colorGround, strength);
    return hemiLight;
};

Light.generateLight = function(light) {

	if (light.type === "DirectionalLight") {
		return Light.createDirectionalLight(Light.WHITE, light.strength, new THREE.Vector3( light.position.x, light.position.y, light.position.z));
	} else if (light.type === "HemisphereLight") {
		return Light.createHemisphereLight(Utils.stringHexToHex( light.sky ), Utils.stringHexToHex( light.ground ), light.strength);
	}
};
