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

let locationIDs = JSON.parse(localStorage.getItem("Components-am-eisernen-band-orte"));
console.log(locationIDs.data.ids);
console.log(locationIDs.data.ids.length)
let OLGobj_locations = [],
OLGpopupContent = [];

//let angebote = '';
for(let i = 0; i < locationIDs.data.ids.length; i++){
console.log('----------------------------------------');
	let locationObj = JSON.parse(localStorage.getItem("Items-posts-"+locationIDs.data.ids[i]));
if (locationObj.angebote !== undefined && locationObj.angebote.length > 0 ) {
console.log(locationObj.title);
//console.log(locationObj.location);
console.log(locationObj.angebote.length + ' Angebote' );
	//console.log(locationObj.angebote);



	
		for(let c = 0; c < locationObj.angebote.length; c++){
console.log('++++++++++++++++++++++++');
	let angeboteObj = JSON.parse(localStorage.getItem("Items-posts-"+locationObj.angebote[c]));
if (angeboteObj) { //fängt ab, wenn ein zugeordnetes angebot gelöscht wurde
//console.log('angeboteObj: ' + c);
//console.log(angeboteObj);
console.log(angeboteObj.title + ' (Angebot ' + c + ')');

//OLGpopupContent.push(angeboteObj.title);
// OLGpopupContent.push.apply(OLGpopupContent, angeboteObj)
OLGpopupContent[i] += angeboteObj.title;
} }
    
    OLGobj_locations[i] = `{"type":"Feature","properties": {"name": "`+ locationObj.title + `", "popupContent": "`+ locationObj.angebote + ' ' + OLGpopupContent[i] + `" },
					   "geometry": {"type": "Point","coordinates": [` + locationObj.location.lon + `,` + locationObj.location.lat + `]}}`;
					   
					   console.log(OLGobj_locations[i]);
					   console.log(OLGpopupContent[i]);
					   
    }
	console.log('********************');

}

//-----------------------

                        
					   
/*
for(let i = 0; i < locationIDs.data.ids.length; i++){
	let locationObj = JSON.parse(localStorage.getItem("Items-posts-"+locationIDs.data.ids[i]));
	console.log(locationObj.angebote);
	
		for(let c = 0; c < locationObj.angebote.length; c++){
	let angeboteObj = JSON.parse(localStorage.getItem("Items-posts-"+angebote[c]));
console.log('angeboteObj: ');
console.log(angeboteObj);
console.log(locationObj.angebote.length);
} 
	
}
*/
 


/*
for(let i = 0; i < locationIDs.data.ids.length; i++){
	let locationObj = JSON.parse(localStorage.getItem("Items-posts-"+locationIDs.data.ids[i]));
	
	for(let c = 0; c < locationObj.angebote.length; c++){
	let angeboteObj = JSON.parse(localStorage.getItem("Items-posts-"+angeboteIDs[c]));
console.log('angeboteObj: ');
console.log(angeboteObj);
console.log(locationObj.angebote.length);
} 

console.log('locationObj: ' + locationObj.title);
} 
*/
/*
for(let i = 0; i < locationIDs.data.ids.length; i++) {
	console.log('-----------------------------------');
	let locationObj = JSON.parse(localStorage.getItem("Items-posts-"+locationIDs.data.ids[i]));
	
console.log('locationObj: ' + locationObj.title);
// if (locationObj.angebote.angeboteIDs) {
if (localStorage.getItem("Items-posts-"+locationObj.angebote.angeboteIDs)) {
	console.log('angebote.angeboteIDs: ' + locationObj.angebote.angeboteIDs);
	console.log('locationObj.angebote.length: ' + locationObj.angebote.length)
	//console.log(locationObj.angebote.angeboteIDs);
	let angeboteObj = JSON.parse(localStorage.getItem("Items-posts-"+locationObj.angebote.angeboteIDs));
console.log('angeboteObj: ');
console.log(angeboteObj);
if (typeof angeboteObj.categories != "undefined" &&
angeboteObj.categories != null) {
	console.log('locationObj.angebote.length: ' + locationObj.angebote.length)
}

	for(let c = 0; c < locationObj.angebote.length; c++){
console.log('***************');
	let angeboteObj = JSON.parse(localStorage.getItem("Items-posts-"+locationObj.angebote.angeboteIDs[c]));
console.log('angeboteObj: ');
console.log(angeboteObj);
//console.log(locationObj.angebote.length);
} //2nd for end
} //if end

} //for end
*/


/*
let z = 0;
for(let i = 0; i < locationIDs.data.ids.length; i++) {
	let locationObj = JSON.parse(localStorage.getItem("Items-posts-"+locationIDs.data.ids[i]));
	if (localStorage.getItem("Items-posts-"+locationObj.angebote)) {
		z++;
console.log('name: ' + locationObj.title);
console.log(locationObj.address);
console.log('coordinates: ');
console.log(locationObj.location);
	console.log('locationObj.angebote: ' + locationObj.angebote);
	console.log('locationObj.angebote.lenght: ' + locationObj.angebote.length);
	let angeboteObj = JSON.parse(localStorage.getItem("Items-posts-"+locationObj.angebote));

	console.log('popupContent: ' + angeboteObj.title);
	console.log(angeboteObj.freitext);
	console.log(angeboteObj.email);

	console.log('-----------------------------------');
} //if end
} //for end
console.log('-----------------------------------');
console.log('Anzahl Orte MIT Angebot: ' + z);
console.log('-----------------------------------');
*/

/*
geometry:
coordinates: Array(2)
0: 11.473067
1: 51.664883
type: "Point"
properties:
name: "Walbeck, Feuerwehrverein e.V."
popupContent: "<div id='1873'><b>Walbeck, Feuerwehrverein e.V.</b> <br /> Walbecker Dorfstraße 7 <br /> 06333 Mansfeld-Südharz<br /> <footer> <a href='#single/posts/1873' class='readmore fa fa-window-restore' data-id='989'> Info </a></footer> </div>"
type: "Feature"
*/






                function getMoreContent(id, notLocId, freitext) {
                    var readMoreText = document.createElement('a');
                    readMoreText.setAttribute('href', '#single/posts/' + id); //olg test 20190815
                    readMoreText.setAttribute('class', 'readmore fa fa-window-restore');
                    readMoreText.setAttribute('data-id', notLocId);
                    readMoreText.innerText = ' Info ';
                    readMoreText.outerHTML.replace(/["]/g, "'");
                    readMoreText.onclick = function (e) {
                        e.preventDefault();
                    }

                    var wrapperPopupContent = document.getElementById(id);
                    return readMoreText.outerHTML.replace(/["]/g, "'");

                }
                
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
   $(container).attr('title','alles anzeigen');
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

                const url = 'https://am-eisernen-band.de/wp-json/angebote/all';

                let obj_locations = [];
                // let getStoredData = JSON.parse(localStorage.getItem("indexArray"));


                let fetchedData;

                fetch(url).then(response => {
                    return response.json()
                }).then(response => {
                    fetchedData = response
                })

                let promiseData = new Promise((resolve, reject) => {

                    let getOnlineStatus = TemplateTags.getNetworkState(true);

                    // if (!getStoredData) {
                    // if (getOnlineStatus == 'online') {
                    fetch(url).then(response => {
                        return response.json()
                    }).then(data => {
                        let flattenedArray = [].concat(...data);
                        //console.log(flattenedArray)

                        //Indizee Array zum verarbeiten
                        let indexArray = []

                        flattenedArray.forEach(element => {
                            indexArray.push(Object.keys(element)[0]);
                        });

                        localStorage.setItem('indexArray', indexArray);


                        // Array in einzelne Informationen zerlegen
                        flattenedArray.forEach(entry => {
                            let arrayId = Object.keys(entry)[0];
                            let singleInformation = `{"id": ${entry[arrayId].id_1 ? entry[arrayId].id_1 : ''}, "ort_id": ${entry[arrayId].ort_id ? entry[arrayId].ort_id : ''}, "ort_title": "${entry[arrayId].ort_title ? entry[arrayId].ort_title.replace(/["]/g, "'") : ''}","title": "${entry[arrayId].title ? entry[arrayId].title.replace(/["]/g, "'") : ''}","freitext": "${entry[arrayId].freitext ? entry[arrayId].freitext : ''}","email": "${entry[arrayId].email ? entry[arrayId].email : ''}","link_zum_produkt": "${entry[arrayId].link_zum_produkt ? entry[arrayId].link_zum_produkt.replace(/["]/g, "'") : ''}","linkname": "${entry[arrayId].linkname ? entry[arrayId].linkname : ''}","telefonnummer": "${entry[arrayId].telefonnummer ? entry[arrayId].telefonnummer:''}","post_id": ${entry[arrayId].locations.post_id ? entry[arrayId].locations.post_id : ''},"location_slug": "${entry[arrayId].locations.location_slug ? entry[arrayId].locations.location_slug.replace(/["]/g, "'") : ''}","location_name": "${entry[arrayId].locations.location_name ? entry[arrayId].locations.location_name.replace(/["]/g, "'") : ''}","location_address": "${entry[arrayId].locations.location_address ? entry[arrayId].locations.location_address.replace(/["]/g, "'") : ''}","location_town": "${entry[arrayId].locations.location_town ? entry[arrayId].locations.location_town.replace(/["]/g, "'") : ''}","location_state": "${entry[arrayId].locations.location_state ? entry[arrayId].locations.location_state.replace(/["]/g, "'") : ''}","location_postcode": "${entry[arrayId].locations.location_postcode ? entry[arrayId].locations.location_postcode.replace(/["]/g, "'") : ''}","location_region": "${entry[arrayId].locations.location_region ? entry[arrayId].locations.location_region.replace(/["]/g, "'") : ''}","location_latitude": "${entry[arrayId].locations.location_latitude ? entry[arrayId].locations.location_latitude.replace(/["]/g, "'") : ''}","location_longitude": "${entry[arrayId].locations.location_longitude ? entry[arrayId].locations.location_longitude.replace(/["]/g, "'") : ''}"}`;
                            singleInformation = JSON.stringify(singleInformation);
                            localStorage.setItem('aEntry_' + arrayId, singleInformation);
                        });


                        let toStore = JSON.stringify(flattenedArray);
                        return JSON.parse(toStore);
                    }).then(data => {
                        resolve(data);
                    });

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
                        let barrierefrei = entry[arrayId].barrierefrei === '1' ? "<i class='fa fa-wheelchair' aria-hidden='true'></i> barrierefrei <br />" : "";
                        let email = entry[arrayId].email !== "" ? ` <a href='mailto: ${entry[arrayId].email}'><i class='fa fa-envelope-o' aria-hidden='true'></i> Email</a>` : ''; //TemplateString MM
                        let telefonnummer = entry[arrayId].telefonnummer !== "" ? "<i class='fa fa-phone' aria-hidden='true'></i> <span class='sr-only sr-only-focusable'> Telefon: </span>" + entry[arrayId].telefonnummer : '';
                        let freitext = entry[arrayId].freitext;
                        let frei = freitext ? getMoreContent(location_id, arrayId, entry[arrayId].freitext) : '';
                        let popupContent = `<div id='${location_id}'><b>${theTitle}</b> <br /> ${location_address} <br /> ${location_postcode}${location_region}${barrierefrei}${telefonnummer} <footer>${email} ${frei}</footer> </div>`; //olg test 20190815

                        obj_locations[index] = `{"type":"Feature","properties": {"name": "${location_name}", "popupContent": "${popupContent}" },
					   "geometry": {"type": "Point","coordinates": [${entry[arrayId].locations.location_longitude}, ${entry[arrayId].locations.location_latitude}]}}`;

                    })


                    var geojsonFeature = obj_locations;
                    geojsonFeature = '{"type": "FeatureCollection", "features": [' + geojsonFeature + ']}'

                    localStorage.setItem("geoJsonData", geojsonFeature);
//console.log(geojsonFeature);

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

                            var locationsCached = fetchedData;

//                             console.log(fetchedData)
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
                                    let email = entry[arrayId].email !== "" ? '<a title="E-Mail" class="email" href="mailto:' + entry[arrayId].email + '"><i class="fa fa-envelope-o" aria-hidden="true"></i> ' + entry[arrayId].email + '</a><br/>' : '';
                                    let linkname = entry[arrayId].linkname !== "" ? entry[arrayId].linkname : entry[arrayId].link_zum_produkt;
                                    let link = entry[arrayId].link_zum_produkt;
                                    let location_address = entry[arrayId].locations !== "" ? entry[arrayId].locations.location_address.replace(/["]/g, "'") : '';
                                    let location_postcode = entry[arrayId].locations !== "" ? entry[arrayId].locations.location_postcode + ' ' : '';
                                    let location_region = entry[arrayId].locations !== "" ? entry[arrayId].locations.location_region : '';
                                    let theTitle = entry[arrayId].title !== "" ? entry[arrayId].title.replace(/["]/g, "'") : '';
                                    let barrierefrei = entry[arrayId].barrierefrei === '1' ? 'barrierefrei <br />' : '';
                                    let telefonnummer = entry[arrayId].telefonnummer !== "" ? ' <a href=tel:"' + entry[arrayId].telefonnummer.replace(/[ ]/g, "") + '"> <i class="fa fa-phone-square" aria-hidden="true"></i> ' + entry[arrayId].telefonnummer + '</a>' : '';
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