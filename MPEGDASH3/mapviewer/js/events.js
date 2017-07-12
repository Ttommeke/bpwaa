
var Events = {};

Events.generateKeyObject = function( pressed) {
    var keyObject = {};

    keyObject.setPressed = function(pressedUpdate) {
        if (keyObject.pressed != pressedUpdate) {
            keyObject.updated = true;
        }
        keyObject.pressed = pressedUpdate;
    }
    keyObject.isPressed = function() {
        return keyObject.pressed;
    };
    keyObject.readOutUpdate = function() {
        var toReturn = { "updated": keyObject.updated, "pressed": keyObject.pressed}

        keyObject.updated = false;

        return toReturn;
    };

    keyObject.pressed = pressed;
    keyObject.updated = false;

    return keyObject;
};

Events.mouseMove = function(e) {
    Events.mouse.position.x = e.clientX - window.innerWidth/2;
    Events.mouse.position.z = e.clientY - window.innerHeight/2;
};

Events.mouseDownEvent = function(e) {
    Events.mouse.leftMouseButton.setPressed(true);
    /*if (e.buttons % 2 >= 1) {
        Events.mouse.leftMouseButton.setPressed(true);
    } else if (e.buttons % 4 >= 2 ) {
        Events.mouse.rightMouseButton.setPressed(true);
    } else if (e.buttons % 8 >= 4 ) {
        Events.mouse.middleMouseButton.setPressed(true);
    }*/
};

Events.mouseUpEvent = function(e) {
    Events.mouse.leftMouseButton.setPressed(false);
    /*if (e.buttons % 2 < 1) {
        Events.mouse.leftMouseButton.setPressed(false);
    } else if (e.buttons % 4 < 2 ) {
        Events.mouse.rightMouseButton.setPressed(false);
    } else if (e.buttons % 8 < 4 ) {
        Events.mouse.middleMouseButton.setPressed(false);
    }*/
};

Events.scrollEvent = function(e) {
    console.log(e);
};

Events.keyDownEvent = function(e) {

    if (Events.keys[e.key] == undefined) {
        Events.keys[e.key] = Events.generateKeyObject(true);
    }
    Events.keys[e.key].setPressed(true);
};

Events.keyUpEvent = function(e) {

    if (Events.keys[e.key] == undefined) {
        Events.keys[e.key] = Events.generateKeyObject(false);
    }
    Events.keys[e.key].setPressed(false);

};

Events.keys = {
    "ArrowLeft": Events.generateKeyObject(false),
    "ArrowRight": Events.generateKeyObject(false),
    "ArrowUp": Events.generateKeyObject(false),
    "ArrowDown": Events.generateKeyObject(false),
    " ": Events.generateKeyObject(false),
    "a": Events.generateKeyObject(false)
};

Events.mouse = {
    "position": {
        "x": 0,
        "z": 0
    },
    "leftMouseButton" : Events.generateKeyObject(false),
    "middleMouseButton" : Events.generateKeyObject(false),
    "rightMouseButton" : Events.generateKeyObject(false)
};
