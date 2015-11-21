## TSV Parse

Loads migrant data tsv file, prints to json file that can be used in javascript / extended later on when more data is available.

### How to use (Simple)

1. Open a CLI
2. Navigate to folder containing `run.js` and `parse.js`
3. Invoke "node run" to process a file called `MigrantData.tsv` in the current directory

### How to use (Advanced)

1. Create your scaffold node file
2. Import parse.js with `var parse = require("./parse.js")`
3. Call `parse` with parameters `filename` and `jsonspaces`

_filename_ is the path to the migrant data file **without** a file extension (it expects .tsv, will print to .json)

_jsonspaces_ is the number of spaces to use while pretty printing to the json file, a value of 0 will not use pretty print

### Data Format
Notes:
* A given shortname will appear three times in the entry keyed by itself (It appears as the key, as the value of
  property `shortName` and once as a key in the `to` object, where its value will be 0)
* Every shortname will appear as a key in every `to` property
* a given longname only appears once in the data file, as the `longName` property of the corresponding entry
* Migrant flow is denoted by ParentKey > ChildValue (`data[homeCountry].to[destinationCountry];`)

```JSON
{
    "$SHORTNAME" : {
        "shortName" : "$SHORTNAME",
        "longName" : "$LONGNAME",
        "to" : {
            "$SHORTNAME" : 000,
            "$SHORTNAME" : 000
        }
    }
}
```
