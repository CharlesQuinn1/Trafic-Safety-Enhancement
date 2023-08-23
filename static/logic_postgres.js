// Store our API endpoint as queryUrl.
let url = '/geoData';

function createPlot() {
  const dataPromise = d3.json(url);
  console.log(dataPromise);

  dataset = d3.select("#Choice").property("value");
  if(dataset == '2') {

    // Creating the map object
    let map = L.map("map", {
      center: [30.266666, -97.733330],
      zoom: 14
    });

    // Adding the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Get the data with d3.
    d3.json(url).then(function(data) {
      console.log(data);
      // console.log(data[0][4]);

      // Create a new marker cluster group.
      let markers = L.markerClusterGroup({
        iconCreateFunction: function (cluster) {
          var childCount = cluster.getChildCount();
          var c = ' marker-cluster-';
          if (childCount < 100) {
            c += '100';
          } 
          else if (childCount < 500) {
            c += '500';
          } 
          else if (childCount < 1000) {
            c += '1000';
          } 
          else if (childCount < 2000) {
            c += '2000';
          } 
          else {
            c += 'large';
          }
         
          return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', 
           className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
          }
      });

      // Loop through the data.
      for (let i = 0; i < data.length; i++) {

        // Add a new marker to the cluster group, and bind a popup.
        markers.addLayer(L.marker([data[i][4], data[i][3]]).bindPopup('bob'));
        }

      // Add our marker cluster layer to the map.
      map.addLayer(markers);

    })

  }
    
}

d3.selectAll("#Choice").on("change",createPlot);