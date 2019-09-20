/**
 * Map model used to memorize map current data into local storage
 */
define(function (require) {

    "use strict";

    var Backbone = require('backbone');
    var Config = require( 'root/config' );
    require('localstorage');
    
/*
                        var southWest = L.latLng(50.34971801127329, 10.530405564491431),
                        northEast = L.latLng(52.345956148393554, 12.126833777143432),
                        bounds = L.latLngBounds(southWest, northEast);
*/


    var MapModel = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage( "Map-" + Config.app_slug ),
        defaults: {
            id : "",
            center: {lat: 51.63364850999728, lng: 11.553529500961305}, 
                zoom: 9,
                maxZoom: 18,
                minZoom: 8,
                //maxBounds: bounds,
                //maxBoundsViscosity: 1, 



        }
    });
    return MapModel;
});
