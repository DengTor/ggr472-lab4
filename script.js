/*--------------------------------------------------------------------
GGR472 LAB 4: Incorporating GIS Analysis into web maps using Turf.js 
--------------------------------------------------------------------*/


/*--------------------------------------------------------------------
Step 1: INITIALIZE MAP
--------------------------------------------------------------------*/
//Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVuZ3RvciIsImEiOiJjbGN2N2VueHowd2xuM3JwNWUwYmppYTg4In0.wS0qJyacGyqRQkNoP7fnmw'; //****ADD YOUR PUBLIC ACCESS TOKEN*****

//Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'map', //container id in HTML
    style: 'mapbox://styles/dengtor/clexm94ej000u01porlynijpv',  //****ADD MAP STYLE HERE *****
    center: [-79.39, 43.65],  // starting point, longitude/latitude
    zoom: 9 // starting zoom level for the map
});

/*--------------------------------------------------------------------
Step 2: VIEW GEOJSON POINT DATA ON MAP
--------------------------------------------------------------------*/
//HINT: Create an empty variable
//      Use the fetch method to access the GeoJSON from your online repository
//      Convert the response to JSON format and then store the response in your new variable

let degeojson; // empty variable

// Fetch GeoJSON from URL and store response
fetch('https://raw.githubusercontent.com/DengTor/ggr472-lab4/main/data/pedcyc_collision_06-21.geojson')
    .then(response => response.json())
    .then(response => {
        console.log(response); //Check response in console
        degeojson = response; // Store geojson as variable using URL from fetch response
        console.log(response)
    });

// /*--------------------------------------------------------------------
// LOAD DATA TO MAP USING GEOJSON VARIABLE
// --------------------------------------------------------------------*/
map.on('load', () => {

    //Add datasource using GeoJSON variable
    map.addSource('collision', {
        type: 'geojson',
        data: degeojson
        
    });

    map.addLayer({
        'id': 'collision-pnts',
        'type': 'circle',
        'source': 'collision',
        'paint': {
            'circle-radius': 5,
            'circle-color': 'blue'
        }
    });

});
/*--------------------------------------------------------------------
    Step 3: CREATE BOUNDING BOX AND HEXGRID
--------------------------------------------------------------------*/
//HINT: All code to create and view the hexgrid will go inside a map load event handler

let bboxgeojson; // This is an empty variable that will hold the new boundging box feature
let bbox;

document.getElementById('bboxbutton').addEventListener('click', () => {
    let bbox = turf.envelope(degeojson); // send point geojson to turf, creates a bounding box around points
    //put the resulting bounding box in geojson format FeatureCollection
    bboxgeojson = {
        "type": "FeatureCollection",
        "features": [bbox]
    };

    //add the bounding box created to the map
    map.addSource('collision-bbox', {
        "type": "geojson",
        "data": bboxgeojson.features[0], //use bbox geojson variable as data source
        
    });

    map.addLayer({ //This enables viewing of the bounding box
        "id": "bboxEnvelope",
        "type": "fill",
        "source": "collision-bbox",
        "paint": {
            'fill-color': "purple",
            'fill-opacity': 0.5,
            'fill-outline-color': "black"
        }
    });

    document.getElementById('bboxbutton').disabled = true; //disable button after click 

});

//      Access and store the bounding box coordinates as an array variable
//      Use bounding box coordinates as argument in the turf hexgrid function

console.log(bbox.geometry.coordinates[0][0][0])

/*--------------------------------------------------------------------
Step 4: AGGREGATE COLLISIONS BY HEXGRID
--------------------------------------------------------------------*/
//HINT: Use Turf collect function to collect all '_id' properties from the collision points data for each heaxagon
//      View the collect output in the console. Where there are no intersecting points in polygons, arrays will be empty



// /*--------------------------------------------------------------------
// Step 5: FINALIZE YOUR WEB MAP
// --------------------------------------------------------------------*/
//HINT: Think about the display of your data and usability of your web map.
//      Update the addlayer paint properties for your hexgrid using:
//        - an expression
//        - The COUNT attribute
//        - The maximum number of collisions found in a hexagon
//      Add a legend and additional functionality including pop-up windows
const legendlabels = [
    '0-400',
    '400-800',
    '800-1000',
    '1000-1200',
    '>1200'
];

const legendcolours = [
    '#800020',
    '#A52A2A',
    '#EE4B2B',
    '#AA4A44',
    '#880808',

];