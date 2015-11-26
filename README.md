## DATAPROC
### Processing data and stuff

There are two different sets of data being processed; the legacy migration tsv data and the population csv data set that has superseeded it.

Node scaffolds are found in the `bin` directory

Processing scripts are found in the `lib` directory

* `tsvparse.js` parses the format of `MigrantData.json`
* `csvparse.js` is a generic parser for csv files that will turn one into a 2d array fo strings
* `popmerge.js` does the bulk of the csv processing and merging

Source data is stored in the `data` directory

Aggregated and processed data is output to the `dist` directory

### How to use (Simple) (OLD)

1. Open a CLI
2. Navigate to folder containing `run.js` and `parse.js`
3. Invoke "node run" to process a file called `MigrantData.tsv` in the current directory

### How to use (Advanced) (OLD)

1. Create your scaffold node file
2. Import parse.js with `var parse = require("./parse.js")`
3. Call `parse` with parameters `filename` and `jsonspaces`

_filename_ is the path to the migrant data file **without** a file extension (it expects .tsv, will print to .json)

_jsonspaces_ is the number of spaces to use while pretty printing to the json file, a value of 0 will not use pretty print

### Data Format

```JSON
{
  "_v": "$SEMVER",
  "meta": {
    "$METAKEY": "$METAVALUE",
    "...": "..."
  },
  "ref": {
    "$COUNTRYCODE": {
      "short": "$SHORTNAME",
      "long": "$LONGNAME",
      "code": "$COUNTRYCODE",
      "region": "$REGION",
    },
    "...": "..."
  },
  "data": {
    "$YEAR": {
      "$COUNTRYCODE": {
        "short": "$SHORTNAME",
        "long": "$LONGNAME",
        "code": "$COUNTRYCODE",
        "region": "$REGION",
        "population": "$POPULATION",
        "to": {
          "$COUNTRYCODE": 000,
          "$COUNTRYCODE": 000,
          "...": "..."
        }
      },
      "...": "..."
    },
    "...": "..."
  }
}
```
