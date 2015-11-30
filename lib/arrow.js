// draws arrows from a country for a single year
function drawCountryArrowsSingleYear(file, year, country) {
    'use strict';

    var dataByYear = file.data[year];
    var countryJson = dataByYear[country];
    console.log(countryJson);

    var countryToJson = countryJson.to;

    for (var country in countryToJson) {
        if (countryToJson[country] > 0) {

            var toCountry = dataByYear[country];
            if (toCountry) {
                console.log(toCountry);
                var pos = toCountry.pos;
                if (pos) {
                    var long = dataByYear[country].pos.long;
                    var lat = dataByYear[country].pos.lat;

                    viewer.entities.add({
                        name: 'Country arrow',
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights([countryJson.pos.long, countryJson.pos.lat, 500000,
                                                        long, lat, 500000]),
                            width: 5,
                            material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.PURPLE),
                            id: country + "Arrow"
                        }
                    });
                }
            }
        }
    }
}
