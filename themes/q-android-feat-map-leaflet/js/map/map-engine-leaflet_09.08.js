/**
 * Leaflet map management and interactions with DOM
 */

define(function (require) {

    "use strict";


    var Backbone = require('backbone');
    var _ = require('underscore');
    var Config = require('root/config');
    var $ = require('jquery');
    var L = require('theme/leaflet/leaflet');
    var MapModel = require('theme/js/map/map-model');

    return Backbone.Model.extend({

        defaults: {
            id: "",
            default_data: {},
            map_data: null,
            map_leaflet: null,
        },

        /**
         * Backbone model initialization
         */
        initialize: function () {
            //Bind callback methods to this:
            _.bindAll(this, 'update', 'saveCurrentData');
        },

        /**
         * Initialize map data and leaflet map
         */
        initMap: function () {
            if (!this.isMapActive() && $('#' + this.get('id')).length) {

                //Instanciate new map model:
                this.set('map_data', new MapModel(_.extend({
                    id: this.get('id')
                }, this.get('default_data'))));

                //Fetch memorized map data (position, zoom etc):
                this.get('map_data').fetch();

                //Clear all previous map instances:
                this.remove();


                //Initialize Leaflet map:

                var center = [this.get('map_data').get('center').lat, this.get('map_data').get('center').lng];
                this.set('map_leaflet', L.map(this.get('id')).setView(center, this.get('map_data').get('zoom')));
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    zoom: this.get('map_data').get('zoom'),
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(this.get('map_leaflet'));

                function onEachFeature(feature, layer) {
                    // does this feature have a property named popupContent?
                    if (feature.properties && feature.properties.popupContent) {
                        layer.bindPopup(feature.properties.popupContent);
                    }
                }


                const url = 'https://am-eisernen-band.de/wp-json/angebote/all';

                let obj_locations = [];


                fetch(url).then(response => {
                    return response.json();
                }).then(data => {

                    const flattenedArray = [].concat(...data);

                    console.log(flattenedArray);

                    flattenedArray.forEach(function (entry, index) {

                        let location_id = entry.locations.post_id;
                        let location_name = entry.locations !== null ? entry.title.replace(/["]/g, "'") : '';

                        function getMoreContent(content, param) {

                            //console.log(entry.locations.post_id, content)
                           function cntFunction(evt){
                            evt.preventDefault();
                            console.log(content) 
                            return false;

                           }
                           var wrapper = document.createElement('div');
                           wrapper.innerHTML = content;

                           var readMoreText = document.createElement('a');

                           readMoreText.setAttribute('class', 'readmore');
                           //readMoreText.setAttribute('href','#');
                           
                           //readMoreText.onclick = cntFunction;
                           readMoreText.setAttribute('onclick', 'cntFunction');

                           readMoreText.setAttribute('onclick','cntFunction(evt);'); // for FF
                           readMoreText.onclick = function() {cntFunction(evt);}; // for IE
                            
                           //readMoreText.onclick = cntFunction
                           readMoreText.innerText='mehr erfahren';

                          

                           var bubble = document.getElementById(location_id);


                           //link öffnet div mit content
                           //
                           // console.log(param)
                            //Lightbox
                            //add wrapper
                            //closeButton
                            //load content
                            return readMoreText.outerHTML.replace(/["]/g, "'");
                        }

                        let location_address = entry.locations !== null ? entry.locations.location_address.replace(/["]/g, "'") : '';
                        let location_postcode = entry.locations !== null ? entry.locations.location_postcode + ' ' : '';
                        let location_region = entry.locations !== null ? entry.locations.location_region + '<br />' : '';
                        let theTitle = entry.title !== null ? entry.title.replace(/["]/g, "'") : '';
                        let barrierefrei = entry.barrierefrei === "1" ? 'barrierefrei <br />' : '';
                        let email = entry.email !== "" ? '<br /> E-Mail: ' + entry.email + '<br/>' : '';
                        let telefonnummer = entry.telefonnummer !== "" ? 'Telefonnummer: ' + entry.telefonnummer : '';
                        let freitext = entry.freitext ? getMoreContent(entry.freitext , index) : '';



                        let popupContent = `<p id='${location_id}'>${theTitle} <br /> ${location_address} <br /> ${location_postcode}${location_region}${barrierefrei}${email}${telefonnummer} <br> ${freitext}</p>`;



                        obj_locations[index] = `{"type":"Feature","properties": {"name": "${location_name}", "popupContent": "${popupContent}" },
					   "geometry": {"type": "Point","coordinates": [${entry.locations.location_longitude}, ${entry.locations.location_latitude}]}}`;


                    })

                    var geojsonFeature = obj_locations;
                    geojsonFeature = '{"type": "FeatureCollection", "features": [' + geojsonFeature + ']}'

                    return geojsonFeature;


                }).then(data => {
                    // console.log('data' + data);
                    var obj = JSON.parse(data);



                    L.geoJSON(obj, {
                        onEachFeature: onEachFeature
                    }).addTo(this.get('map_leaflet'));
                    // marker.on('click', function(e) { console.log('click')})
                }).catch(err => {
                    // // Do something for an error here
                    console.log('error')
                });

                //Memorize map position and zoom when zooming, moving and leaving the map:
                this.get('map_leaflet').on('zoomend', this.saveCurrentData);
                this.get('map_leaflet').on('moveend', this.saveCurrentData);
                this.get('map_leaflet').on('unload', this.saveCurrentData);
            }
        },

        /**
         * Update Leaflet map with current map data (position, zoom etc)
         */
        update: function () {

            if (!this.isMapActive()) {
                this.initMap();
            }

            var newLatLng = new L.LatLng(this.get('map_data').get('center').lat, this.get('map_data').get('center').lng);
            this.get('map_leaflet').panTo(newLatLng);
            this.get('map_leaflet').setZoom(this.get('map_data').get('zoom'));

        },

        /**
         * Remove Leaflet map and empty map element
         */
        remove: function () {

            var $map = $('#' + this.get('id'));
            if ($map.length && $map.html().length) {
                this.get('map_leaflet').remove();
                $map.html('');
            }

            this.set('map_leaflet', null);
        },

        /**
         * Save current map data into local storage
         */
        saveCurrentData: function () {
            var current_center = this.get('map_leaflet').getCenter();
            this.get('map_data').set('center', {
                lat: current_center.lat,
                lng: current_center.lng
            });
            this.get('map_data').set('zoom', this.get('map_leaflet').getZoom());
            this.get('map_data').save();
        },

        /**
         * Check if the map is currently active
         */
        isMapActive: function () {
            var $map = $('#' + this.get('id'));
            return this.get('map_leaflet') !== null && $map.length && $map.html().length;
        }
    });

});