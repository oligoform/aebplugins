/**
 * Leaflet map management and interactions with DOM
 */

define(function (require) {

    "use strict";

    var Backbone = require('backbone');
    var _ = require('underscore');
    var $ = require('jquery');
    var L = require('leaflet');
    var LeafletSearch = require("leaflet-search");

    require('theme/js/map/cluster/leaflet.markercluster');


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
                //console.log(L);
                //this.get('map_leaflet').fitBounds(obj_locations.getBounds());

                /*
                                L.control.locate({
                                        strings: {
                                                    title: "Zeige meine Position"
                                                    }
                                                    }).addTo(this.get('map_leaflet'));
                */

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
                            map.fitBounds(bounds);
                        });
                        return container;
                    }
                })

                this.get('map_leaflet').addControl(new extentControl());

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
                    //get all Ids
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

                    return readMoreText.outerHTML.replace(/["]/g, "'");

                }


                locationIDs.then(angeboteValues => {
                    let angebote = '[';

                    angeboteValues.forEach((element, index) => {
                        let angebotObj = JSON.parse(localStorage.getItem('Items-posts-' + element));
                        let angeboteOrte = Object.assign({}, angebotObj)


                        if (angebotObj.angebote) {
                            if (angebotObj.angebote.length === 1) {

                                let angeboteAbfrage = JSON.parse(localStorage.getItem('Items-posts-' + angebotObj.angebote));
                                let angebotOrt = Object.assign(angeboteOrte, angeboteAbfrage);
                                angebote += `{"${angebotObj.angebote}": ${JSON.stringify(angebotOrt)}},`;
                            } else {

                                angebotObj.angebote.forEach(element => {
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
                            let telefonnummer = entry[arrayId].telefonnummer !== "" ? "<a href='tel://" + entry[arrayId].telefonnummer + "'><i class='fa fa-phone' aria-hidden='true'></i> <span class='sr-only sr-only-focusable'> Telefon: </span>" + entry[arrayId].telefonnummer + "</a>" : '';
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
                    this.get('map_leaflet').addLayer(mcg)

                    var dataLayer = L.layerGroup(markers).addTo(this.get('map_leaflet'));

                    new LeafletSearch({
                        layer: dataLayer,
                        initial: false,
                        zoom: 12
                    }).addTo(this.get('map_leaflet'));



                    mcg.on('popupopen', function (popup) {
                        let myModalString = `<div class="modal" id="my-modal"><div id="close-button"></div></div>`
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