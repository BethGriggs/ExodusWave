/*jslint node:true */
"use strict";
module.exports = function (filename, jsonspace) {
    var output = {
            "_v": "1.1.0",
            meta: {},
            data: {}
        },
        fs = require("fs"),
        file = fs.readFileSync(filename + ".tsv").toString(),
        fileLines = file.split("\n"),
        countryDef = fileLines[0],
        countryData = {},
        outputDataString,
        countryNumMap = [],
        countryDefElems;

    fileLines = fileLines.splice(1);

    countryDefElems = countryDef.split("\t");
    countryDefElems.map(function (name, num) {
        if (num < 2) {
            return;
        }
        name = name.trim();
        countryData[name] = {};
        countryNumMap.push(name);
    });

    output.meta.countries = 0;

    fileLines.map(function (line, num) {
        if (line === "") { // Handles trailing blank line
            return;
        }
        var elems = line.split("\t"),
            longName = elems[0].trim(),
            shortName = elems[1].trim();

        countryData[shortName].longName = longName;
        countryData[shortName].shortName = shortName;
        countryData[shortName].to = {};

        output.meta.countries += 1;

        elems = elems.splice(2);
        elems.map(function (data, num) {
            data = data.replace("\r", "");
            countryData[shortName].to[countryNumMap[num]] = data;
        });
    });

    output.data = countryData;

    if (jsonspace === 0) {
        outputDataString = JSON.stringify(output);
    } else {
        outputDataString = JSON.stringify(output, null, jsonspace);
    }
    
    fs.writeFileSync(filename + ".json", outputDataString);
};
