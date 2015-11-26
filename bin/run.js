/*jslint node:true */
"use strict";
var parse = require("../lib/parse");
parse({
    input: "data/MigrantData.tsv",
    output: "dist/MigrantData.json",
    spaces: 2
});
