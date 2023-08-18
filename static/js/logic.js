// Store our API endpoint as queryUrl.
let queryUrl = "https://data.austintexas.gov/resource/dx9v-zd7x.json?$$app_token=snzNQgy9iCYR2bChVFIJs40KH&$limit=10000";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  console.log(data);
  createFeatures(data);
});

function createFeatures(traficData) {

  // Get issue_reported codes
  issue = [];
  for (i=0; i < traficData.length; i++){
    issue.push(traficData[i].issue_reported);
  }

  // Remove duplicate issue_reported codes
  let result = [];
  issue.forEach(function(item) {
      if(result.indexOf(item) < 0) {
          result.push(item);
      }
  });

  //print to url
  console.log(result);

  function chooseColor(issue) {
    if (issue ==  "Crash Urgent" 
      || issue ==  "COLLISN/ LVNG SCN" 
      || issue ==  "Crash Service"
      || issue == "COLLISION" 
      || issue == "COLLISION WITH INJURY"
      || issue == "COLLISION") return "#ff5f65";
    else if (issue ==  "Traffic Hazard" 
      || issue ==  "TRFC HAZD/ DEBRIS" 
      || issue ==  "Traffic Impediment") return "#fca35d";
    else if (issue ==  "LOOSE LIVESTOCK") return "#fdb72a";
    else if (issue ==  "zSTALLED VEHICLE") return "#f7db11";
    else if (issue ==  "ICY ROADWAY") return "#dcf400"; 
    else if (issue ==  "BOAT ACCIDENT") return "#a3f600";
    else return "black";
  }

  coords = [];

  // Creates a GeoJSON layer containing the features array on the earthquakeData object.
  for (i=0; i < traficData.length; i++){
    if (!isNaN(parseFloat(traficData[i].latitude)) && !isNaN(parseFloat(traficData[i].longitude)) ) {
    coords.push(
      L.circleMarker([parseFloat(traficData[i].latitude),parseFloat(traficData[i].longitude)], {
          stroke: true,
          weight: .6,
          color: "black",
          fillColor: chooseColor(traficData[i].issue_reported),
          fillOpacity: 0.9,
          opacity: 0.9,
          // radius: feature.properties.mag*3
          radius: 5
        }).bindPopup(`<b>${traficData[i].issue_reported}<b/><hr>Date of incident: ${traficData[i].traffic_report_status_date_time}`))
    }
  }
  traffic = L.layerGroup(coords);

  // Send earthquakes layer to the createMap function
  createMap(traffic);
}

function createMap(traffic) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Traffic: traffic
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [30.266666, -97.733330],
    zoom: 11,
    layers: [street, traffic]
  });

  function getColor(d) {
    return d >= 6  ? "#a3f600" :
           d >= 5  ? "#dcf400" :
           d >= 4  ? "#f7db11" :
           d >= 3  ? "#fdb72a" :
           d >= 2  ? "#fca35d" :
           d >= 1  ? "#ff5f65" :
           d >= 0  ? "#FFEDA0" :
                     "#ffffff" ;
  }

  let legend = L.control({
      position: 'bottomright'
  });

  legend.onAdd = function (map) {
  
      let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6],
        labels = ['<strong>&nbspLEGEND&nbsp</strong>'],
        labels2 = ["Collision", "Traffic Hazard", "Loose Livestock", "Stalled Vehicle", "Icy Road", "Boat Accident", "Other"],
        from,
         to;

      for (var i = 0; i < grades.length; i++) {
          from = grades [i];
          to = grades[i+1];

      labels.push(
          '<i style="background:' + getColor(from + 1) + '"></i> ' + labels2[i]) //+
          //  (to ? to : ''));
          }
          div.innerHTML = labels.join('<br>');
          return div;    
  
      // return div;
  };
  
  legend.addTo(myMap);

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
