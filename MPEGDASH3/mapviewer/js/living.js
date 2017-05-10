
var Living = {};

Living.checkCollision = function(living, map) {
    var x = living.position.x;
    var z = living.position.z;
    var xLow = Math.floor(x);
    var zLow = Math.floor(z);
    var xHigh = xLow + 1;
    var zHigh = zLow + 1;

    if (
        zLow < 0 ||
        xLow < 0 ||
        zHigh >= map.length ||
        xHigh >= map[zHigh].length ||
        map[zLow][xLow].id == 3 ||
        map[zLow][xHigh].id == 3 ||
        map[zHigh][xLow].id == 3 ||
        map[zHigh][xHigh].id == 3
    ) {
        return true;
    } else {
        return false;
    }
}

Living.moveLivingWithCollisionCheck = function(living, deltaTime, direction, speed, map) {
    var length = direction.length() + 0.00000001;

    var oriPos = living.position;
    oriPos.x += direction.x/length * speed * deltaTime;
    if (Living.checkCollision(living, map)) {
        oriPos.x -= direction.x/length * speed * deltaTime;
    }
    oriPos.y += direction.y/length * speed * deltaTime;
    if (Living.checkCollision(living, map)) {
        oriPos.y -= direction.y/length * speed * deltaTime;
    }
    oriPos.z += direction.z/length * speed * deltaTime;
    if (Living.checkCollision(living, map)) {
        oriPos.z -= direction.z/length * speed * deltaTime;
    }
/*
    Living.moveLiving(living, deltaTime, new THREE.Vector3(direction.x/length, 0, 0), speed);
    if (Living.checkCollision(living, map)) {
        Living.moveLiving(living, deltaTime, new THREE.Vector3(direction.x/length, 0, 0), -speed);
    }
    Living.moveLiving(living, deltaTime, new THREE.Vector3(0, direction.y/length, 0), speed);
    if (Living.checkCollision(living, map)) {
        Living.moveLiving(living, deltaTime, new THREE.Vector3( 0, direction.y/length, 0), -speed);
    }
    Living.moveLiving(living, deltaTime, new THREE.Vector3( 0, 0, direction.z/length), speed);
    if (Living.checkCollision(living, map)) {
        Living.moveLiving(living, deltaTime, new THREE.Vector3( 0, 0, direction.z/length), -speed);
    }*/
}

Living.moveLiving = function(living, deltaTime, direction, speed) {
    var length = direction.length() + 0.00000001;

    var oriPos = living.position;
    oriPos.x += direction.x/length * speed * deltaTime;
    oriPos.y += direction.y/length * speed * deltaTime;
    oriPos.z += direction.z/length * speed * deltaTime;
}

Living.generateLiving = function(living) {
    if (living.type = "human") {
        var human = Entity.createCube( 0xFF0099, new THREE.Vector3(0.8,1.4,0.8), living.position, living.rotation);
        human.position.y = 0.7;
        human.speed = living.speed;

        return human;
    }
}
