/*jslint node:true */
"use stict";
module.exports = function csvparse(file) {
    var escape = false,
        inquotes = false,
        char = 0,
        cur = "",
        data = "",
        rows = file.split("\n"),
        dataset = [],
        curRow = [];

    rows.map(function(e) {
        curRow = [];
        char = 0;
        while(char < e.length) {
            cur = e.charAt(char);
            if (cur === "\"") {
                if (escape) {
                    data += cur;
                } else if (inquotes) {
                    inquotes = false;
                } else {
                    inquotes = true;
                }
            } else if (cur === ",") {
                if (inquotes) {
                    data += cur;
                } else if (escape) {
                    data += cur;
                    escape = false;
                } else {
                    data = data.trim();
                    curRow.push(data);
                    data = "";
                }
            } else if(escape) {
                escape = false;
            }else {
                data += cur;
            }
            char += 1;
        }
        if(data.length > 0) {
            data = data.trim();
            curRow.push(data);
            data = "";
        }
        dataset.push(curRow);
    });

    return dataset;
}
