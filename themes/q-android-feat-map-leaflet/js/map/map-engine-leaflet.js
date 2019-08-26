/**
 * Leaflet map management and interactions with DOM
 */


define(function (require) {

    "use strict";

    var Backbone = require('backbone');
    var App = require('core/theme-app');
    var _ = require('underscore');
    var Config = require('root/config');
    var $ = require('jquery');
    var L = require('theme/leaflet/leaflet');	
	// require('theme/js/map/search/leaflet-search');   
	require('theme/js/map/cluster/leaflet.markercluster');   
	// require('theme/js/map/locateControl/L.Control.Locate');
	


    var MapModel = require('theme/js/map/map-model');


    App.on('network:offline', function (event) {
        // Get the current network state
        var ns = TemplateTags.getNetworkState(true);
        // Display the current network state
        console.log('offline');
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



                function getMoreContent(id, notLocId, freitext) {
                    var readMoreText = document.createElement('a');
                    readMoreText.setAttribute('href', '#single/posts/' + id); //olg test 20190815
                    readMoreText.setAttribute('class', 'readmore');
                    readMoreText.setAttribute('data-id', notLocId);
                    readMoreText.innerText = 'mehr erfahren';
                    readMoreText.outerHTML.replace(/["]/g, "'");
                    readMoreText.onclick = function (e) {
                        e.preventDefault();
                    }

                    var wrapperPopupContent = document.getElementById(id);
                    //console.log(wrapperPopupContent)
                    //wrapperPopupContent.appendChild(readMoreText);

                    //document.body.apendChild(readMoreText);
                    return readMoreText.outerHTML.replace(/["]/g, "'");

                }


                function showElem(freitext) {
                    //console.log(freitext);
                    var test = document.getElementsByClassName('readmore' + id)

                }


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

                    //console.log(flattenedArray);

                    var toStore = JSON.stringify(flattenedArray)

                    localStorage.setItem("locationsJson", toStore);




                    flattenedArray.forEach(function (entry, index) {

                        let arrayId = Object.keys(entry)[0];
                        let location_id = entry[arrayId].locations.post_id;
                        let location_name = entry[arrayId].locations !== null ? entry[arrayId].title.replace(/["]/g, "'") : '';
                        let location_address = entry[arrayId].locations !== null ? entry[arrayId].locations.location_address.replace(/["]/g, "'") : '';
                        let location_postcode = entry[arrayId].locations !== null ? entry[arrayId].locations.location_postcode + ' ' : '';
                        let location_region = entry[arrayId].locations !== null ? entry[arrayId].locations.location_region + '<br />' : '';
                        let theTitle = entry[arrayId].title !== null ? entry[arrayId].title.replace(/["]/g, "'") : '';
                        let barrierefrei = entry[arrayId].barrierefrei === '1' ? 'barrierefrei <br />' : '';
                        let email = entry[arrayId].email !== "" ? '<br /> E-Mail: ' + entry[arrayId].email + '<br/>' : '';
                        //let email = entry[arrayId].email !== "" ? '<br /> <a href="mailto:' + entry[arrayId].email + '">Email</a><br/>' : '';
                        let telefonnummer = entry[arrayId].telefonnummer !== "" ? 'Telefon: ' + entry[arrayId].telefonnummer : '';
                        let freitext = entry[arrayId].freitext;
                        let frei = freitext ? getMoreContent(location_id, arrayId, entry[arrayId].freitext) : ''; //olg test 20190815
                        //let olggeo = ' <a href="https://maps.google.com/maps?daddr=' + entry[arrayId].locations.location_latitude + ',' + entry[arrayId].locations.location_longitude + '&amp;saddr=">Route</a> '; //olg test 20190820
                        //let olggeo = ' test ' + entry[arrayId].locations.location_latitude + ',' + entry[arrayId].locations.location_longitude + ' ende  '; //olg test 20190820b
//console.log (olggeo);
                        let popupContent = `<div id='${location_id}'><b>${theTitle}</b> <br /> ${location_address} <br /> ${location_postcode}${location_region}${barrierefrei}${telefonnummer} <br>${frei} </div>`; //olg test 20190815



                        obj_locations[index] = `{"type":"Feature","properties": {"name": "${location_name}", "popupContent": "${popupContent}" },
					   "geometry": {"type": "Point","coordinates": [${entry[arrayId].locations.location_longitude}, ${entry[arrayId].locations.location_latitude}]}}`;


                    })


                    var geojsonFeature = obj_locations;
                    geojsonFeature = '{"type": "FeatureCollection", "features": [' + geojsonFeature + ']}'

                    localStorage.setItem("geoJsonData", geojsonFeature);
                    var storedData = JSON.parse(localStorage.getItem("geoJsonData"));
                    //console.log('stored Data:' , storedData)

                    return geojsonFeature;


                }).then(data => {
                    // console.log('data' + data);
                    var obj = JSON.parse(data);

                    var mcg = L.markerClusterGroup({
                        chunkedLoading: true,
                        //singleMarkerMode: true,
                        spiderfyOnMaxZoom: true //olg test 20190815
                    });

                    mcg.addLayer(L.geoJSON(obj, {
                        onEachFeature: onEachFeature
                    }))
                    this.get('map_leaflet').addLayer(mcg)
                    //.addTo(this.get('map_leaflet'));
                    // marker.on('click', function(e) { console.log('click')})

			

                    mcg.on('popupopen', function (popup) {

                        var myModal = document.createElement('div');
                        myModal.setAttribute('class', 'modal');
                        myModal.setAttribute('id', 'my-modal');
                        var closeButton = document.createElement('div');
                        closeButton.setAttribute('id', 'close-button');
                        var modalContent = document.createElement('div');
                        modalContent.setAttribute('id', 'modal-content');

                        function toggleModal() {
                            myModal.classList.toggle("show-modal");
                            //console.log(toggleModal)
                        }

                        function addModal() {
                            myModal.classList.add("show-modal");
                        }

                        function removeModal() {
                            myModal.classList.remove("show-modal");
                        }



                        $(".readmore").click(function (event) {
                            event.preventDefault();
                            var locationsCached = JSON.parse(localStorage.getItem("locationsJson"));
                            var getId = $(this).data('id');

                            function windowOnClick(event) {
                                if (event.target === myModal) {
                                    removeModal();
                                }
                            }


                            locationsCached.forEach(function (entry, index) {
                                let arrayId = Object.keys(entry)[0];
                                //console.log(arrayId,getId)


                                closeButton.addEventListener("click", toggleModal);
                                window.addEventListener("click", windowOnClick);
                                if (arrayId == getId) {

                                    let text = entry[arrayId].freitext;
                        			let email = entry[arrayId].email !== "" ? '<a title="E-Mail" class="email" href="mailto:' + entry[arrayId].email + '"><i class="fa fa-envelope-o" aria-hidden="true"></i>' + entry[arrayId].email + '</a><br/>' : '';
                                    let linkname = entry[arrayId].linkname !== "" ? entry[arrayId].linkname : entry[arrayId].link_zum_produkt;
                                    let link = entry[arrayId].link_zum_produkt;
                                    let location_address = entry[arrayId].locations !== "" ? entry[arrayId].locations.location_address.replace(/["]/g, "'") : '';
                                    let location_postcode = entry[arrayId].locations !== "" ? entry[arrayId].locations.location_postcode + ' ' : '';
                                    let location_region = entry[arrayId].locations !== "" ? entry[arrayId].locations.location_region : '';
                                    let theTitle = entry[arrayId].title !== "" ? entry[arrayId].title.replace(/["]/g, "'") : '';
                                    let barrierefrei = entry[arrayId].barrierefrei === '1' ? 'barrierefrei <br />' : '';
                                    let telefonnummer = entry[arrayId].telefonnummer !== "" ? ' <a href=tel:"' + entry[arrayId].telefonnummer.replace(/[ ]/g, "") + '"> <i class="fa fa-phone-square" aria-hidden="true"></i>'+ entry[arrayId].telefonnummer + '</a>' : '';
                                    let olggeo = ' <a class="mapsgeolink text-center" href="https://maps.google.com/maps?daddr=' + entry[arrayId].locations.location_latitude + ',' + entry[arrayId].locations.location_longitude + '&amp;saddr="><i class="fa fa-map-marker" aria-hidden="true"></i> Route hierhin</a> '; //olg test 20190820

// kategorien
                                    // Name und addresse (strasse PLZ Ort)
                                    // Telefon
                                    // 


                                    if (link && link != '') {
                                        link = '<a href="' + link + '" target="_blank">' + linkname + '</a>';
                                    }


                                    modalContent.innerHTML = '<h3>' + theTitle + '</h3>';
                                    modalContent.innerHTML += location_address + '<br>';
                                    modalContent.innerHTML += location_postcode;
                                    modalContent.innerHTML += location_region + '<br>';
                                    modalContent.innerHTML += olggeo + '<br>';
                                    modalContent.innerHTML += text;
                                    modalContent.innerHTML += email;
                                    modalContent.innerHTML += telefonnummer + '<br>';
                                    modalContent.innerHTML += link + '<br>';
                                    modalContent.innerHTML += barrierefrei;
                                    modalContent.innerHTML += '<br>';

                                    addModal();
                                }

                                myModal.appendChild(closeButton);
                                myModal.appendChild(modalContent);
                                document.body.appendChild(myModal);

                            })




                        });

                    });

                }).then(data => {

                    console.log('ready')




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