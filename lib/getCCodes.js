var request = require("request"),
    cheerio = require("cheerio"),
    fs = require("fs");

var bigger = {},
    smaller = {};

request("http://www.worldatlas.com/aatlas/ctycodes.htm", function(error, response, body) {
    if (!error) {
        var $ = cheerio.load(body);
        $("body > div.content > main > div.mainContent > article > div.miscTxt > table:nth-child(5) > tbody > tr")
                    .each(function(i, el) {
                        if(i == 0) {
                            return;
                        }
                        var elem = $(this),
                            twoL = elem.children(".cell02").first().text(),
                            threeL = elem.children(".cell03").first().text();
                        bigger[twoL.trim()] = threeL.trim();
                        smaller[threeL.trim()] = twoL.trim();
        });

        $("body > div.content > main > div.mainContent > article > div.miscTxt > table:nth-child(7) > tbody > tr")
                    .each(function(i, elem) {
                        if(i == 0) {
                            return;
                        }
                        var elem = $(this),
                            twoL = elem.children(".cell02").first().text(),
                            threeL = elem.children(".cell03").first().text();
                        bigger[twoL.trim()] = threeL.trim();
                        smaller[threeL.trim()] = twoL.trim();
        });
        fs.writeFileSync("dist/countryMap.json", JSON.stringify({smaller: smaller, bigger: bigger}, null, 2));
    }


});

