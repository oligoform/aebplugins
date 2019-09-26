/**
 * Leaflet map management and interactions with DOM
 */

define(function (require) {

    "use strict";

    var Backbone = require('backbone');
    var App = require('core/theme-app');
    var TemplateTags = require('core/theme-tpl-tags');
    var _ = require('underscore');
    var Config = require('root/config');
    var $ = require('jquery');
    var L = require('theme/leaflet/leaflet');
    //var L = require(['theme/leaflet/leaflet', 'theme/js/map/search/leaflet-search']);
    //require('theme/js/map/search/leaflet-search');   
    //var Locate = require('theme/js/map/locateControl/L.Control.Locate');
    //require('theme/js/map/locateControl/L.Control.Locate');

    require('theme/js/map/cluster/leaflet.markercluster');

    //require macht PWA Probleme; deshalb test inline js --> klappt auch nicht!



    var MapModel = require('theme/js/map/map-model');


    // test locate inline
    //test locate end


    App.on('network:online', function (event) {
        // Get the current network state
        var ns = TemplateTags.getNetworkState(true);
        //console.log(ns);
        // Display the current network state

    });


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


                var southWest = L.latLng(50.9997, 10.5304),
                    northEast = L.latLng(52.3459, 12.1268),
                    bounds = L.latLngBounds(southWest, northEast);
                //Initialize Leaflet map:

                var center = [this.get('map_data').get('center').lat, this.get('map_data').get('center').lng];
                this.set('map_leaflet', L.map(this.get('id')).setView(center, this.get('map_data').get('zoom')).setMaxBounds(bounds));
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    zoom: this.get('map_data').get('zoom'),
                    maxZoom: 18,
                    minZoom: 9,
                    //maxBounds: bounds,
                    // setMaxBounds: bounds,
                    //maxBoundsViscosity: 1,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(this.get('map_leaflet'));

                        var watchID;
                        function clearWatch() {
        if (watchID != null || watchID !== 'undefined') {
	        console.log(watchID); 
	        console.log('cleared watchID');
            navigator.geolocation.clearWatch(watchID);
            watchID = null;
            $('#olggeolocatebutton').html('<i class="fa fa-street-view" aria-hidden="true"></i>');
            }
        };
    
    this.get('map_leaflet').on('dragend', () => {
            clearWatch();
        });
        
        function onLocationFound(e) {
    var radius = e.accuracy / 2;
    L.marker(e.latlng)..addTo(this.get('map_leaflet'))
        .bindPopup("Standort innerhalb " + radius + " Metern").openPopup();
    L.circle(e.latlng, radius).addTo(this.get('map_leaflet'));
}
                        
                var extentControl = L.Control.extend({
                    options: {
                        position: 'topleft'
                    },
                    onAdd: function (map) {
                        //var llBounds = map.getBounds(); //nimmt ja immer nur die, die beim aktuellen Zoom gezeigt werden; ich will ALLE; deshalb 'bounds'
                        var container = L.DomUtil.create('div', 'extentControl');
                        $(container).css('cursor', 'all-scroll');//.css('width', '26px').css('height', '26px').css('outline', '1px black').css('box-shadow','0 1px 5px rgba(0,0,0,0.65)');
                        $(container).attr('title', 'alles anzeigen');
                        $(container).html('<i class="fa fa-map-o" aria-hidden="true"></i>');
                        $(container).on('click', function () {
	                        clearWatch();
	                        map.fitBounds(bounds);
                        });
                        return container;
                    }
                })






                this.get('map_leaflet').addControl(new extentControl());

                var extentControlGeo = L.Control.extend({
                    options: {
                        position: 'topleft'
                    },
                    onAdd: function (map) {
                        var container = L.DomUtil.create('div', 'extentControl');
                        $(container).css('cursor', 'pointer');
                        $(container).attr('title', 'Meine Position anzeigen');
                        $(container).attr('id', 'olggeolocatebutton');
                        $(container).html('<i class="fa fa-street-view" aria-hidden="true"></i>');
                        
/*
                                if (watchID != null || watchID !== 'undefined') {
	                        $('#olggeolocatebutton').html('<i class="fa fa-circle-o-notch fa-spin fa-fw" aria-hidden="true"></i>');
	                        }
	                      else {
		                      $('#olggeolocatebutton').html('<i class="fa fa-street-view" aria-hidden="true"></i>');
	                      };
*/
	                      
                        $(container).on('click', function () {
	                        console.log('geo click');
	                        $(container).html('<i class="fa fa-circle-o-notch fa-spin fa-fw" aria-hidden="true"></i>');

	                            var startPos;
    if (navigator.geolocation) {
	    console.log('geo enabled');
	    var options = {
  enableHighAccuracy: true,
  timeout: 60000,
  maximumAge: 500
};

function success(pos) {
  var crd = pos.coords;
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 14);
        onLocationFound(pos);
        console.log(watchID);
/*
        setTimeout(function() { 
        $(container).html('<i class="fa fa-street-view" aria-hidden="true"></i>');
    }, 2000);
*/

/*

  alert('Your current position is:');
  alert(`Latitude : ${crd.latitude}`);
  alert(`Longitude: ${crd.longitude}`);
  alert(`More or less ${crd.accuracy} meters.`);
*/
}

function error(err) {
//   alert(`ERROR(${err.code}): ${err.message}`);
  alert(`Position derzeit nicht verfügbar.`);
}

watchID = navigator.geolocation.watchPosition(success, error, options);
  }; //geolocation end

                        });
                        return container;
                    }
                })

                this.get('map_leaflet').addControl(new extentControlGeo());

                //L.control.watermark({ position: 'bottomleft' }).addTo(this.get('map_data'));

                function onEachFeature(feature, layer) {
                    // does this feature have a property named popupContent?
                    if (feature.properties && feature.properties.popupContent) {
                        layer.bindPopup(feature.properties.popupContent);
                    }
                    layer.setIcon(new L.DivIcon());
                }

                //Collect all Posts from orte

                let locationIDs = new Promise((resolve, reject) => {
                    let value = JSON.parse(localStorage.getItem("Components-am-eisernen-band-orte")).data.ids
                    resolve(value);
                })

                let getMoreContent = (id, notLocId) => {

                    var readMoreText = document.createElement('a');
                    readMoreText.setAttribute('href', '#single/posts/' + id); //olg test 20190815
                    readMoreText.setAttribute('class', 'readmore fa fa-window-restore');
                    readMoreText.setAttribute('data-id', notLocId);
                    readMoreText.innerText = '  ';
                    readMoreText.outerHTML.replace(/["]/g, "'");
                    readMoreText.onclick = function (e) {
                        e.preventDefault();
                    }

                    var wrapperPopupContent = document.getElementById(id);
                    return readMoreText.outerHTML.replace(/["]/g, "'" );

                }


                locationIDs.then(angeboteValues => {
                    let angebote = '[';

                    angeboteValues.forEach((element, index) => {
                        let angebotObj = JSON.parse(localStorage.getItem('Items-posts-' + element));
                        let angeboteOrte = Object.assign({}, angebotObj)


                        if (angebotObj.angebote) {
                            if (angebotObj.angebote.length === 1) { //ToDo: loop
                            
                                let angeboteAbfrage = JSON.parse(localStorage.getItem('Items-posts-' + angebotObj.angebote));
                                let angebotOrt = Object.assign(angeboteOrte, angeboteAbfrage);
                                angebote += `{"${angebotObj.angebote}": ${JSON.stringify(angebotOrt)}},`;
                            } else {

                                angebotObj.angebote.forEach (element => {
                                    let angeboteAbfrage = JSON.parse(localStorage.getItem('Items-posts-' + element));
                                    let angebotOrt = Object.assign(angeboteOrte, angeboteAbfrage);
                                    angebote += `{"${angebotObj.angebote}": ${JSON.stringify(angebotOrt)}},`;                                    
                                });
                            }
                        }
                    });

                    //del last ','
                    angebote = angebote.replace(/,\s*$/, "");
                    angebote += ']';
                    return JSON.parse(angebote);

                }).then(data => {
                    //console.log(data);
                    let geojsonString = ' {"type": "FeatureCollection", "features": [ ';
                    data.forEach(function (entry, index) {

                        if (index != 0) {

                            let arrayId = Object.keys(entry)[0];
                            let location_id = entry[arrayId].id;
                            let location_name = entry[arrayId].title !== null ? "<a href='#single/posts/" + entry[arrayId].id + "'>" + entry[arrayId].title + "</a>" : '';
                            let location_address = entry[arrayId].address.address !== null ? entry[arrayId].address.address : '';
                            let location_postcode = entry[arrayId].address.postcode !== null ? entry[arrayId].address.postcode : '';
                            let location_region = entry[arrayId].address.region !== null ? entry[arrayId].address.region + '<br />' : '';
                            let barrierefrei = entry[arrayId].barrierefrei === '1' ? "<i class='fa fa-wheelchair' aria-hidden='true'></i> barrierefrei <br />" : "";
                            let anfahrt = "<a title='Route von hier mit Google-Maps in neuem Fenster' target='_blank' href='https://maps.google.com/maps?daddr=" + entry[arrayId].location.lat + "," + entry[arrayId].location.lon + "&amp;saddr='> <i class='fa fa-map-signs' aria-hidden='true'></i> <span class='sr-only sr-only-focusable'> Route </span></a>";
                            
                            let category = entry[arrayId].categories !== null ? entry[arrayId].categories[0]/* .slug */ : ''; //ToDo: fix error & set first cat as class for popup - later as type for feature
                            // console.log(category);
                            // console.log(entry[arrayId].id + ' ID: ' + index);

                            let email = entry[arrayId].email !== "" ? ` <a href='mailto: ${entry[arrayId].email}'><i class='fa fa-envelope-o' aria-hidden='true'></i> <span class='sr-only sr-only-focusable'> Email</span> </a>` : ''; //TemplateString MM
                            let telefonnummer = entry[arrayId].telefonnummer !== "" ? "<a href='tel://"+ entry[arrayId].telefonnummer+"'><i class='fa fa-phone' aria-hidden='true'></i> <span class='sr-only sr-only-focusable'> Telefon: </span>" + entry[arrayId].telefonnummer + "</a>" : '';
                            let frei = getMoreContent(location_id, arrayId, entry[arrayId].freitext);
                            let popupContent = `<div id='${location_id}'><b>${location_name}</b> <br /> ${location_address} <br /> ${location_postcode} ${location_region}${barrierefrei}${telefonnummer} <footer>${email} ${anfahrt} ${frei}</footer> </div>`; //olg test 20190815

                            geojsonString += `{"type":"Feature","properties": {"name": "${location_name}", "popupContent": "${popupContent}" },
                       "geometry": {"type": "Point","coordinates": [${entry[arrayId].location.lon}, ${entry[arrayId].location.lat}]}},`;

                    }
                    })
                    geojsonString = geojsonString.replace(/,\s*$/, "");

                    geojsonString += ']}';
                            //console.log(geojsonString)

                   return geojsonString;

                }).then(data => {
                    var obj = JSON.parse(data);

                    var mcg = L.markerClusterGroup({
                        chunkedLoading: true,
                        //singleMarkerMode: true,
                        spiderfyOnMaxZoom: true //olg test 20190815
                    });

                    mcg.addLayer(L.geoJSON(obj, {
                        onEachFeature: onEachFeature
                    }))
                    this.get('map_leaflet').addLayer(mcg);

//                     mcg.on('popupopen', function (popup) );

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