/**
 * Plug map logic into the app.
 * (Require this map-run.js file in functions.js)
 */
define([
    'jquery',
    'core/theme-app',
    'theme/js/map/map-engine-leaflet',
    ], function($,App,Map) {

        //Initialize leaflet map object with default values
        var southWest = L.latLng(50.34971801127329, 10.530405564491431),
        northEast = L.latLng(52.345956148393554, 12.126833777143432),
        bounds = L.latLngBounds(southWest, northEast);

		alert('map run executed');
        var MyMap = new Map({
            id:"map",
            default_data: {
                center: {lat: 51.63364850999728, lng: 11.553529500961305}, 
                zoom: 9,
                maxZoom: 18,
                minZoom: 8,
                maxBounds: bounds,
                maxBoundsViscosity: 1, 
            }
        });

        //Create a custom screen for our map, with id "map" and template "map.html":
        App.addCustomRoute( 'map', 'map' );

        //Display our map when map screen is showed:
        App.on( 'screen:showed', function( current_screen ) {

            if ( current_screen.item_id === 'map' ) {
                MyMap.update();

            }

        });

        //Unload the map when we leave the map screen:
        App.on( 'screen:leave', function ( current_screen, queried_screen  ) {

            if ( current_screen.item_id === 'map' ) {
                MyMap.remove();
            }

        } );

});
