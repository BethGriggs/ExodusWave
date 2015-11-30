/*jslint node:true */


//  import the json file and parse it into the json object 'data'
var data = require("data/data.min.json");


//  because why not
function traverseToCountry(data, year, country) {
    'use strict';
    
    if (data.hasOwnProperty('data')) {
        return traverseToCountry(data.data, year, country);
    } else if (data.hasOwnProperty(year)) {
        return traverseToCountry(data[year], year, country);
    } else if (data.hasOwnProperty(country)) {
        return data[country];
    } else {
        return null;
    }
}

function getPopulationOfCountry(data, year, country) {
    'use strict';
    
    var countryObj = data.data[year][country];
    
    if (countryObj.hasOwnProperty('population')) {
        return countryObj.population;
    } else {
        return null;
    }
}

function getTotalMigrationToCountry(data, year, country) {
    'use strict';

    var countryObj = data.data[year][country],
        allMigrants,
        incomingMigrants,
        totalMigrants = 0;
    
    if (countryObj.hasOwnProperty('to')) {
        // loop through key values and add up
        allMigrants = countryObj.to;
        
        for (incomingMigrants in allMigrants) {
            if (isNaN(parseInt(allMigrants[incomingMigrants], 10))) {
                // do nothing
            } else {
                // make sure they are numbers
                totalMigrants += parseInt(allMigrants[incomingMigrants], 10);
            }
        }
        
    } else {
        console.error('No data for migration to ' + country + ' found');
        return null;
    }
    console.log(totalMigrants);
    return totalMigrants;
}

function getMigrantPercentageIntoCountry(data, year, country) {
    'use strict';
    // getTotal / getPop
    var totalMigrants,
        totalPopulation,
        percentage;
    
    totalMigrants = getTotalMigrationToCountry(data, year, country);
    totalPopulation = getPopulationOfCountry(data, year, country);
    percentage = (totalMigrants / totalPopulation) * 100;
    
    return percentage;
}
