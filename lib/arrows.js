var countryArrows = {},
    arrowsToValues = {},
    previousCountry = null,
    clickedCountries = [],
    infoDisplay = document.getElementById("infoDisplay"); // Cache element to prevent repetative DOM lookups

// draws arrows from a country for a single year
function drawCountryArrowsSingleYear(file, year) {
    'use strict';
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
                        var name = country + 'to' + countryTo;
                        var entity = {
                            name: name,
                            parent: arrows,
                            polyline: {
                                positions: Cesium.Cartesian3.fromDegreesArrayHeights([countryLong, countryLat, 1000000,
                                                        toLong, toLat, 1000000]),
                                width: 5,
                                material: new Cesium.PolylineArrowMaterialProperty(
                                    Cesium.Color.fromCssColorString(file.regions[file.ref[countryTo].region])
                                ),
                            }
                        };
                        viewer.entities.add(entity);

                        arrowsToValues[name] = countriesTo[countryTo];
                    }
                }
            }
        }
    }
    addArrowHoverEvent();
    addArrowClickEvent();
}

function addArrowClickEvent() {
    mouseClickEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    mouseClickEventHandler.setInputAction(function (click) {
        var pickedObject = scene.pick(click.position);

        var alreadyClicked = false;

        if (Cesium.defined(pickedObject)) {

            var objectName = pickedObject.id.name;
            if (dataJson.data["1960"].hasOwnProperty(objectName)) {
                if (objectName == previousCountry) {
                    previousCountry = null;
                }
                // loop through clicked countries
                for (var i = 0; i < clickedCountries.length; i++) {
                    if (clickedCountries[i] == objectName) {
                        alreadyClicked = true;
                        countryArrows[objectName].show = false;
                        clickedCountries.splice(i, 1);
                    }
                }

                if (!alreadyClicked) {
                    countryArrows[objectName].show = true;
                    clickedCountries.push(objectName);
                }
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

}

function addTestSecondEventListner() {
    var mouseMoveHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    mouseMoveHandler.setInputAction(function (movement) {
        if (Cesium.defined(pickedObject)) {
            var objectName = pickedObject.id.name;

            if (dataJson.data["1960"].hasOwnProperty(objectName)) {
                countryArrows[objectName].show = true;
                previousCountry = objectName;
            }

        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


}

document.body.addEventListener("mousemove", function (e) {
    var x = e.clientX + 20,
        y = e.clientY + 20;
    infoDisplay.style.top = y + "px";
    infoDisplay.style.left = x + "px";
});

function addArrowHoverEvent() {

    var mouseMoveHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    mouseMoveHandler.setInputAction(function (movement) {
        var endPos = movement.endPosition,
            pickedObject = scene.pick(movement.endPosition),
            countryClicked = false,
            objectName,
            countries;

        // if there is a previous country
        if (previousCountry != null) {
            // loop through clicked countries
            for (var i = 0; i < clickedCountries.length; i++) {

                if (clickedCountries[i] == previousCountry) {
                    countryClicked = true;
                }
            }
            if (!countryClicked) {
                countryArrows[previousCountry].show = false;
            }
        }

        infoDisplay.style.visibility = "hidden";
        if (Cesium.defined(pickedObject)) {
            objectName = pickedObject.id.name;
            if (dataJson.data["1960"].hasOwnProperty(objectName)) {
                countryArrows[objectName].show = true;
                previousCountry = objectName;
            } else if (arrowsToValues.hasOwnProperty(objectName)) {
                infoDisplay.style.visibility = "visible";
                infoDisplay.style.zIndex = 9999;
                countries = objectName.split("to");
                document.getElementById("infoDisplay-from").textContent = countries[0];
                document.getElementById("infoDisplay-to").textContent = countries[1];
                document.getElementById("infoDisplay-value").textContent = arrowsToValues[objectName];
            }

        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

}

function middleMan(data) {
    'use strict';
    dataJson = data;
    drawCountryArrowsSingleYear(dataJson, 1960);
}

dataHandler.listen(middleMan);
