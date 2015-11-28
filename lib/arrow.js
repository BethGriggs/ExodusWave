var arrow = function (startx, starty, starth, endx, endy, endh) {
    viewer.entities.add({
        name: 'Red line on the surface',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([startx, starty, starth,
                                                        endx, endy, endh]),
            width: 5,
            material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.PURPLE)
        }
    });
};

// Example 
arrow(-75, 35, 250000, -125, 35, 500000);