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