/*jslint node:true */
var parse = require("../lib/popmerge");
parse({
    files: {
        population: "data/wdi.csv",
        meta: "data/wdi-meta.csv",
        migration: "data/migrant.csv",
        outfile: "dist/data.json"
    },
    spaces: 2
});
