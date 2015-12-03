/*jslint node:true */

//FIXME: global data var
var dataJson;

function drawNode(country, long, lat, height, callback) {
    'use strict';
    var node = viewer.entities.add({
        "name" : country,
        id: country, 
        position: Cesium.Cartesian3.fromDegrees(long, lat, height),
        ellipsoid: {
            radii: new Cesium.Cartesian3(50000.0, 50000.0, 50000.0),
            material: Cesium.Color.fromCssColorString(dataJson.regions[dataJson.ref[country].region])
        }
    });
        
    callback(node);
}

function drawPin(long, lat, height) {
    'use strict';
    var mat = new Cesium.Material({
        fabric : {
            type : 'Stripe',
            uniforms : {
                horizontal: false,
                evenColor: new Cesium.Color(0, 0, 0, 1),
                oddColor : new Cesium.Color(1, 1, 1, 0),
                offset: 0,
                repeat: 2
            }
        }
    });
    var pin = viewer.entities.add({
        name : "pin",
        polyline : {
            positions : Cesium.Cartesian3.fromDegreesArrayHeights([
                long, lat, 0, long, lat, height
            ]),
            width : 1,
            material : mat
        }
    });
}

function drawCountryNode(country, long, lat, height, callback) {
    'use strict';
    
    drawNode(country, long, lat, height, callback);
    drawPin(long, lat, height);
}

function drawCountryNodesSingleYear(file, year) {
    'use strict';
    
    var countriesForYear = file.data[year],
        country,
        name,
        long,
        lat,
        height = 1000000,
        callback = function (entity) {
            console.log(entity.name);
        };
    
    for (country in countriesForYear) {
        if (countriesForYear[country].hasOwnProperty('long')) {
            name = countriesForYear[country].long;
        }
        if (countriesForYear[country].hasOwnProperty('pos')) {
            lat = countriesForYear[country].pos.lat;
            long = countriesForYear[country].pos.long;
        }
        drawCountryNode(country, long, lat, height, callback);
    }
}


function middleMan(data) {
    'use strict';
    dataJson = data;
    drawCountryNodesSingleYear(data, 1960);
}

dataHandler.listen(middleMan);
