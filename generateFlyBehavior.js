"use strict";
const fs = require('fs');

let totalTimeToGenerate = process.argv[2];
let positionsPerFile = process.argv[3];
let secondsBetweenPositions = process.argv[4];
let outputFolder = process.argv[5];

let amountOfPositions = totalTimeToGenerate / secondsBetweenPositions;
let amountOfFiles = amountOfPositions / positionsPerFile;

let positions = [];

let lastPosition = {
    x: 7,
    y: 0,
    z: 7,
};

for (let i = 0; i < amountOfPositions; i++) {
    let generatedPos = {
            "x": Math.random() * 13,
            "y": lastPosition.y,
            "z": Math.random() * 13,
            "movementType": "lineair",
            "moment": i*secondsBetweenPositions
        };

    positions.push(generatedPos);

    lastPosition = positions[positions.length - 1];
}

for (let j = 0; j < amountOfFiles; j++) {
    fs.writeFile(outputFolder + "/seg-" + (j + 1) + ".json", JSON.stringify(positions.slice(j*positionsPerFile, (j+1)*positionsPerFile)), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file, " + outputFolder + "/seg-" + (j + 1) + ".json" + " was saved!");
    });
}
