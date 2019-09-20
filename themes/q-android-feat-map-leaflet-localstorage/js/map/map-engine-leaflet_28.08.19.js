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
    require('theme/js/map/cluster/leaflet.markercluster');
    //require('theme/js/map/locateControl/L.Control.Locate');



    var MapModel = require('theme/js/map/map-model');





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
                    return readMoreText.outerHTML.replace(/["]/g, "'");

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
                let getStoredData = JSON.parse(localStorage.getItem("aLocationsJson"));

                let promiseData = new Promise((resolve, reject) => {

                    let getOnlineStatus = TemplateTags.getNetworkState(true);

                    if (!getStoredData) {
                        // if (getOnlineStatus == 'online') {
                        fetch(url).then(response => {
                            return response.json()
                        }).then(data => {
                            let flattenedArray = [].concat(...data);
                            console.log(flattenedArray)

                            //Indizee Array zum verarbeiten
                            let indexArray = []

                            flattenedArray.forEach(element => {
                                indexArray.push(Object.keys(element)[0]);
                            });

                            console.log(indexArray);

                            // Array in einzelne Informationen zerlegen
                            flattenedArray.forEach(entry => {
                                let arrayId = Object.keys(entry)[0];
                                let singleInformation = `{"id_1":${entry[arrayId].id_1},"ort_id":${entry[arrayId].ort_id},"ort_title":${entry[arrayId].ort_title},"title":${entry[arrayId].title},"freitext":${entry[arrayId].freitext},"email":${entry[arrayId].email},"link_zum_produkt":${entry[arrayId].link_zum_produkt},"linkname":${entry[arrayId].linkname},"telefonnummer":${entry[arrayId].telefonnummer},locations:{"post_id":${entry[arrayId].locations.post_id},"location_slug":${entry[arrayId].locations.location_slug},"location_name":${entry[arrayId].locations.location_name},"location_address":${entry[arrayId].locations.location_address},"location_town":${entry[arrayId].locations.location_town},"location_state":${entry[arrayId].locations.location_state},"location_postcode":${entry[arrayId].locations.location_postcode},"location_region":${entry[arrayId].locations.location_region},"location_latitude":${entry[arrayId].locations.location_latitude},"location_longitude":${entry[arrayId].locations.location_longitude}}}`
                                localStorage.setItem('aEntry_' + arrayId, singleInformation);
                            });


                            let toStore = JSON.stringify(flattenedArray);
                            //   localStorage.setItem("aLocationsJson", toStore);
                            return JSON.parse(toStore);
                        }).then(data => {
                            resolve(data);
                        });
                    } else {
                        resolve(getStoredData);
                    }

                });

                promiseData.then(data => {

                    data.forEach(function (entry, index) {

                        let arrayId = Object.keys(entry)[0];
                        let location_id = entry[arrayId].locations.post_id;
                        let location_name = entry[arrayId].locations !== null ? entry[arrayId].title.replace(/["]/g, "'") : '';
                        let location_address = entry[arrayId].locations !== null ? entry[arrayId].locations.location_address.replace(/["]/g, "'") : '';
                        let location_postcode = entry[arrayId].locations !== null ? entry[arrayId].locations.location_postcode + ' ' : '';
                        let location_region = entry[arrayId].locations !== null ? entry[arrayId].locations.location_region + '<br />' : '';
                        let theTitle = entry[arrayId].title !== null ? entry[arrayId].title.replace(/["]/g, "'") : '';
                        let barrierefrei = entry[arrayId].barrierefrei === '1' ? 'barrierefrei <br />' : '';
                        let email = entry[arrayId].email !== "" ? `<br /> <a href='mailto: ${entry[arrayId].email}'>Email</a><br/>` : ''; //TemplateString MM
                        let telefonnummer = entry[arrayId].telefonnummer !== "" ? 'Telefon: ' + entry[arrayId].telefonnummer : '';
                        let freitext = entry[arrayId].freitext;
                        let frei = freitext ? getMoreContent(location_id, arrayId, entry[arrayId].freitext) : '';
                        let popupContent = `<div id='${location_id}'><b>${theTitle}</b> <br /> ${location_address} <br /> ${location_postcode}${location_region}${barrierefrei}${telefonnummer} ${email} <br>${frei} </div>`; //olg test 20190815

                        obj_locations[index] = `{"type":"Feature","properties": {"name": "${location_name}", "popupContent": "${popupContent}" },
					   "geometry": {"type": "Point","coordinates": [${entry[arrayId].locations.location_longitude}, ${entry[arrayId].locations.location_latitude}]}}`;

                    })


                    var geojsonFeature = obj_locations;
                    geojsonFeature = '{"type": "FeatureCollection", "features": [' + geojsonFeature + ']}'

                    localStorage.setItem("geoJsonData", geojsonFeature);

                    return geojsonFeature;


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
                    this.get('map_leaflet').addLayer(mcg)

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
                        }

                        function addModal() {
                            myModal.classList.add("show-modal");
                        }

                        function removeModal() {
                            myModal.classList.remove("show-modal");
                        }



                        $(".readmore").click(function (event) {
                            event.preventDefault();
                            var locationsCached = JSON.parse(localStorage.getItem("aLocationsJson"));
                            var getId = $(this).data('id');

                            function windowOnClick(event) {
                                if (event.target === myModal) {
                                    removeModal();
                                }
                            }


                            locationsCached.forEach(function (entry, index) {
                                let arrayId = Object.keys(entry)[0];

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
                                    let telefonnummer = entry[arrayId].telefonnummer !== "" ? ' <a href=tel:"' + entry[arrayId].telefonnummer.replace(/[ ]/g, "") + '"> <i class="fa fa-phone-square" aria-hidden="true"></i>' + entry[arrayId].telefonnummer + '</a>' : '';
                                    let olggeo = ' <a class="mapsgeolink text-center" href="https://maps.google.com/maps?daddr=' + entry[arrayId].locations.location_latitude + ',' + entry[arrayId].locations.location_longitude + '&amp;saddr="><i class="fa fa-map-marker" aria-hidden="true"></i> Route hierhin</a> ';
                                    //olg test 20190820

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