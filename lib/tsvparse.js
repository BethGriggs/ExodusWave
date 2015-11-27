/*jslint node:true */
"use strict";
module.exports = function (opts) {
    var output = {
            "_v": "1.1.0", // Major version change means breaking update, minor version change means BC update, patch number means bug fix
            meta: {},
            data: {}
        },
        fs = require("fs"), // File system ops
        file = fs.readFileSync(opts.input).toString(), // Running from the command line, easier to just do it sync
        fileLines = file.split("\n"), // create array of lines using universal line seperator (we'll strip out carriage returns later)
        countryDef = fileLines[0], // CountryDef is the header row of the tsv file, it contains the x-axis labels of the table
        countryData = {},
        outputDataString,
        countryNumMap = [], // We're mapping array position to country code because we need a quick look up when determining
                            // which countries we're dealing with later
        countryDefElems; // An array of the individual labels in the header row (split by tab)

    fileLines = fileLines.splice(1); // remove the header row from the array of lines, we have that in a seperate var

    countryDefElems = countryDef.split("\t");
    countryDefElems.map(function (name, num) {
        if (num < 2) { // The first two elements are column names, not countries (check the data file to understand)
            return;
        }
        name = name.trim(); // Remove rogue whitespace
        countryData[name] = {}; // Prep the data object for later
        countryNumMap.push(name); // Map the array position to the country code
    });

    output.meta.countries = 0;  // We're keeping track of the number of countries we're processing because it might be
                                // an interesting piece of data

    fileLines.map(function (line, num) {
        if (line === "") { // Handles trailing blank line, otherwise it'll throw errors when the data can't be found
            return;
        }
        var elems = line.split("\t"), // Split the line into the individual elements
            longName = elems[0].trim(), // The full country name is the first element
            shortName = elems[1].trim(); // the country's code is the second element

        countryData[shortName].longName = longName;
        countryData[shortName].shortName = shortName;
        countryData[shortName].to = {}; // Prep the from->to map

        output.meta.countries += 1; // We're doing another country, go us!

        elems = elems.splice(2); // Remove the first two elements, we already dealt with those. This leaves us with just the numbers
        elems.map(function (data, num) {
            data = data.replace("\r", ""); // It's those gosh darned carriage returns!
            countryData[shortName].to[countryNumMap[num]] = data;
            /*              ^               ^        ^
             *              a               b        c
             *
             * Luckily the position of (a) in (b) is the same as its index in the element array (c),
             * allowing us to look it up quickly in the data array
             */
        });
    });

    output.data = countryData; // The From->To mapping is just one part of the output data set

    if (opts.spaces === 0) { // A spaces value of 0 is interpreted as no formatting, so the output will be much smaller but
                             // less human readable
        outputDataString = JSON.stringify(output);
    } else {
        outputDataString = JSON.stringify(output, null, opts.spaces); // Otherwise pass spaces as the formatting parameter of
                                                                      // JSON.stringify (Side note: More people need to know that
                                                                      //                 stringify has a whole bunch of parameters &
                                                                      //                 built in prettify)
    }

    fs.writeFileSync(opts.output, outputDataString);
};
