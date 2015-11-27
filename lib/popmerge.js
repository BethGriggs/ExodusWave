/*jslint node: true */
"use strict";
module.exports = function (opts) {
    var fs = require("fs"),
        csvify = require("./csvparse"),

        shallowCopy = function (d) {return JSON.parse(JSON.stringify(d)); },

        popData = csvify(fs.readFileSync(opts.files.population).toString()),
        metaData = csvify(fs.readFileSync(opts.files.meta).toString()),
        migData = csvify(fs.readFileSync(opts.files.migration).toString()),

        popHeader = popData[0],
        metaHeader = metaData[0],
        migHeader = migData[0],

        countryData = {},
        outData = {
            "_v": "2.1.0",
            meta: {
                countries: 0,
                sources: {
                    population: "http://databank.worldbank.org/data/Pop-By-Decade/id/40d8a78",
                    metadata: "http://databank.worldbank.org/data/Total-Pop-By-Decade/id/3f1528ac",
                    migration: "http://databank.worldbank.org/data/Global-BiMigratory-Data/id/4d0b9157"
                }
            },
            data: {},
            ref: {}
        },

        data = {
            1960: {},
            1970: {},
            1980: {},
            1990: {},
            2000: {}
        };

    popData = popData.splice(1);
    metaData = metaData.splice(1);
    migData = migData.splice(1);

    metaData.map(function (line) {
        var short = line[line.length - 1],
            long = line[1],
            code = line[0],
            region = line[3];

        countryData[code] = {
            code: code,
            short: short,
            long: long,
            region: region
        };

        outData.ref[code] = countryData[code];
        outData.meta.countries += 1;
    });

    popData.map(function (line) {
        var code = line[3],
            YR1960 = line[4],
            YR1970 = line[5],
            YR1980 = line[6],
            YR1990 = line[7],
            YR2000 = line[8];

        if (countryData[code]) {
            data[1960][code] = shallowCopy(countryData[code]);
            data[1960][code].population = YR1960;
            data[1960][code].to = {};

            data[1970][code] = shallowCopy(countryData[code]);
            data[1970][code].population = YR1970;
            data[1970][code].to = {};

            data[1980][code] = shallowCopy(countryData[code]);
            data[1980][code].population = YR1980;
            data[1980][code].to = {};

            data[1990][code] = shallowCopy(countryData[code]);
            data[1990][code].population = YR1990;
            data[1990][code].to = {};

            data[2000][code] = shallowCopy(countryData[code]);
            data[2000][code].population = YR2000;
            data[2000][code].to = {};
        }
    });

    migData.map(function (line) {
        var fromCode = line[1],
            toCode = line[5],
            YR1960 = line[6],
            YR1970 = line[7],
            YR1980 = line[8],
            YR1990 = line[9],
            YR2000 = line[10];
        try {
            data[1960][fromCode].to[toCode] = YR1960;
            data[1970][fromCode].to[toCode] = YR1970;
            data[1980][fromCode].to[toCode] = YR1980;
            data[1990][fromCode].to[toCode] = YR1990;
            data[2000][fromCode].to[toCode] = YR2000;
        } catch (ex) {
            if (data[1960][fromCode] != null) {
                throw ex;
            }
        }
    });

    outData.data = data;

    if (opts.spaces === 0) {
        fs.writeFileSync(opts.files.outfile, JSON.stringify(outData));
    } else {
        fs.writeFileSync(opts.files.outfile, JSON.stringify(outData, null, opts.spaces));
    }
};
