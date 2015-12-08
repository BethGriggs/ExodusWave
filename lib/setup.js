 // geolocation json
 // to space positional
 // make into plains onto cesium
 // expand plains to wrap globe
 var viewer = new Cesium.Viewer('cesiumContainer', {
     homeButton: false,
     fullscreenButton: false,
     baseLayerPicker: false,
     geocoder: false,
     timeline: false
 });

 var scene = viewer.scene;

 viewer.dataSources.add(Cesium.GeoJsonDataSource.load('data/testdata.json', {
     fill: Cesium.Color.TRANSPARENT,
     outlineColor: Cesium.Color.HOTPINK,
     outlineWidth: 2000
 }));