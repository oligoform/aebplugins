/**
 * Map model used to memorize map current data into local storage
 */
define(function (require) {

    "use strict";

    var Backbone = require('backbone');
    var Config = require( 'root/config' );
    require('localstorage');

    var MapModel = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage( "Map-" + Config.app_slug ),
        defaults: {
            id : "",
            center: {lat: 51.63364850999728, lng: 11.553529500961305}, 
                zoom: 9
        }
    });

    return MapModel;
});
