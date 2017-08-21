"use strict";
const fs = require('fs');

let totalTimeToGenerate = process.argv[2];
let positionsPerFile = process.argv[3];
let secondsBetweenPositions = process.argv[4];
let outputFolder = process.argv[5];

let amountOfPositions = totalTimeToGenerate / secondsBetweenPositions;
let amountOfFiles = amountOfPositions / positionsPerFile;

let positions = [];

let yPosition = 0;

for (let i = 0; i < amountOfPositions; i++) {
    let generatedPos = {
            "x": Math.random() * 13,
            "y": yPosition,
            "z": Math.random() * 13,
            "movementType": "lineair",
            "moment": i*secondsBetweenPositions
        };

    positions.push(generatedPos);
}

for (let j = 0; j < amountOfFiles; j++) {
    fs.writeFile(outputFolder + "/seg-" + (j + 1) + ".json", JSON.stringify(positions.slice(j*positionsPerFile, (j+1)*positionsPerFile)), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file, " + outputFolder + "/seg-" + (j + 1) + ".json" + " was saved!");
        console.log("----", (j+1)*positionsPerFile - j*positionsPerFile, "positions saved.");
    });
}
