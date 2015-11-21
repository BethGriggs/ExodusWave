/*jslint node:true */
"use strict";
module.exports = function (filename, jsonspace) {
    var fs = require("fs"),
        file = fs.readFileSync(filename + ".tsv").toString(),
        fileLines = file.split("\n"),
        countryDef = fileLines[0],
        countryData = {},
        countryDataString,
        countryNumMap = [],
        countryDefElems;

    fileLines = fileLines.splice(1);

    countryDefElems = countryDef.split("\t");
    countryDefElems.map(function (name, num) {
        if (num < 2) {
            return;
        }
        countryData[name] = {};
        countryNumMap.push(name);
    });

    fileLines.map(function (line, num) {
        if (line === "") { // Handles trailing blank line
            return;
        }
        var elems = line.split("\t"),
            longName = elems[0],
            shortName = elems[1];

        countryData[shortName].longName = longName;
        countryData[shortName].shortName = shortName;
        countryData[shortName].to = {};

        elems = elems.splice(2);
        elems.map(function (data, num) {
            countryData[shortName].to[countryNumMap[num]] = data;
        });
    });

    if (jsonspace === 0) {
        countryDataString = JSON.stringify(countryData);
    } else {
        countryDataString = JSON.stringify(countryData, null, jsonspace);
    }
    
    fs.writeFileSync(filename + ".json", countryDataString);
};