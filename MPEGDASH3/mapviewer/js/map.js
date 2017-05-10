
var Map = {
    map: []
};

Map.loadMapInScene = function(map, scene) {
    for (var x = 0; x < map.length; x++) {
        for (var z = 0; z < map[x].length; z++) {
            scene.add(map[x][z].entity);
        }
    }
};

Map.generateMapFromNumberMap = function(numMap) {
    var bufMap = [];

    for (var z = 0; z < numMap.length; z++) {
        bufMap.push([]);
        for (var x = 0; x < numMap[z].length; x++) {
            bufMap[z].push({ id: numMap[z][x], entity: Entity.generateEntity(numMap[z][x], x, z) });
        }
    }

    return bufMap;
};
