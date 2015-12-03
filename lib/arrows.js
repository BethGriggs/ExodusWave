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
    addArrowHoverEvent();
}

function middleMan(file) {
    'use strict';
    dataJson = JSON.parse(file);
    drawCountryArrowsSingleYear(dataJson, 1960);
}

ajaxGet('data/data.json', middleMan);


function addArrowHoverEvent() {
    // event handler for country nodes

    handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function (movement) {
                var pickedObject = scene.pick(movement.position);

                if (Cesium.defined(pickedObject)) {
                    var objectName = pickedObject.id.name;
                    if (dataJson.data["1960"].hasOwnProperty(objectName)) {
                        countryArrows[country].show = true;
                    } else {
                        countryArrows[country].show = false;
                    }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE});
}