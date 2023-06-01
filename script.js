// Initialize the map
var map = L.map('map').setView([50.8225, -0.1372], 13); // Coordinates for Brighton

// Add a tile layer (base map)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Define color scale
function getColor(score) {
    return score > 0.1 ? '#800026' :
           score > 0.08  ? '#BD0026' :
           score > 0.06  ? '#E31A1C' :
           score > 0.04  ? '#FC4E2A' :
           score > 0.02   ? '#FD8D3C' :
           '#FFEDA0';
}

// Style function
function style(feature) {
    return {
        fillColor: getColor(feature.properties['Income Score (rate)']),
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.4    
    };
}

// Highlight function
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

// Reset highlight function
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

// Zoom to feature function
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

// Define what happens on each feature
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// Info control
var info = L.control({position: 'topright'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
   this._div.innerHTML = '<h4>Income Score</h4> <h5>Lower number means High income</h5><h5>Higher number means Low income</h5>' +  (props ?
        '<b>' + props['Income Score (rate)']
        : 'Hover over an area');
};

info.addTo(map);

// Fetch GeoJSON data and add to map
fetch('brighton_merged_4326.geojson')
    .then(response => response.json())
    .then(data => {
        geojson = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    });
