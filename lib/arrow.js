var countryArrows = {};

// draws arrows from a country for a single year
function drawCountryArrowsSingleYear(file, year) {
    'use strict';
    var jsonArrows = "";
    var dataByYear = file.data[year];

    for (var country in dataByYear) {

        var arrows = viewer.entities.add(new Cesium.Entity());
        arrows.show = false;
        countryArrows[country] = arrows;
        if (dataByYear[country].pos) {
            var countryLong = dataByYear[country].pos.long;
            var countryLat = dataByYear[country].pos.lat;
        }

        var countriesTo = dataByYear[country].to;

        for (var countryTo in countriesTo) {
            if (countriesTo[countryTo] > 0) {

                var toCountry = dataByYear[countryTo];
                if (toCountry) {
                    var pos = toCountry.pos;
                    if (pos) {


                        var toLong = dataByYear[countryTo].pos.long;
                        var toLat = dataByYear[countryTo].pos.lat;

                        viewer.entities.add({
                            name: 'Country arrow',
                            parent: arrows,
                            polyline: {
                                positions: Cesium.Cartesian3.fromDegreesArrayHeights([countryLong, countryLat, 500000,
                                                        toLong, toLat, 500000]),
                                width: 5,
                                material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.PURPLE),
                            }
                        });

                    }
                }
            }
        }
    }
}

function middleMan(file) {
    'use strict';
    dataJson = JSON.parse(file);
    drawCountryArrowsSingleYear(dataJson, 1960);
}

ajaxGet('data/data.json', middleMan);