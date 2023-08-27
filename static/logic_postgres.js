// Store our API endpoint as queryUrl.
let url = '/geoData';
let homeUrl = '/';

function returnHome() {
  
  document.querySelector(".home-page").style.setProperty('display', 'block');
  document.querySelector(".container").style.display = "none";
  document.getElementById("line").style.display = "none";
  document.getElementById("stack").style.display = "none";
  document.getElementById("bar").style.display = "none";
  document.querySelector(".cluster-map").style.display = "none";
  document.getElementById("map").style.display = "none";
  document.querySelector(".issue-analysis").style.display = "none";
  document.getElementById("issue").style.display = "none";
   // Get the data with d3.
  const dataPromise = d3.json(homeUrl);
  console.log(dataPromise);

}

function createPlot() {

  document.querySelector(".home-page").style.setProperty('display', 'none');
  document.querySelector(".container").style.display = "none";
  document.getElementById("line").style.display = "none";
  document.getElementById("stack").style.display = "none";
  document.getElementById("bar").style.display = "none";
  document.getElementById("issue").style.display = "none";
  document.querySelector(".issue-analysis").style.display = "none";
  document.getElementById("issue").style.display = "none";
  document.querySelector(".cluster-map").style.display = "block";
  document.getElementById("map").style.display = "block";

  const dataPromise = d3.json(url);
  console.log(dataPromise);

  // Get the data with d3.
  d3.json(url).then(function(data) {
    console.log(data);

    var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
    }),
    latlng = L.latLng(30.266666, -97.733330),
    fullCount = data.length,
    quarterCount = Math.round(fullCount / 4);


    var map = L.map('map', {center: latlng, zoom: 13, layers: [tiles]});

    // var map = L.map('map', {center: latlng, zoom: 13, layers: [tiles]});

    var mcg = L.markerClusterGroup(),
        group1 = L.featureGroup.subGroup(mcg),
        group2 = L.featureGroup.subGroup(mcg),
        group3 = L.featureGroup.subGroup(mcg),
        group4 = L.featureGroup.subGroup(mcg),
        control = L.control.layers(null, null, { collapsed: false }),
        i, a, title, marker;
    
    mcg.addTo(map);
    
    for (let i = 0; i < data.length; i++) {
      title = data[i]['issue_reported'];
      marker = L.marker([data[i]['latitude'], data[i]['longitude']], { title: title });
      marker.bindPopup(title);
    
      marker.addTo(i < quarterCount ? group1 : i < quarterCount * 2 ? group2 : i < quarterCount * 3 ? group3 : group4);
    }
    
    control.addOverlay(group1, `Less than ${quarterCount}`);
    control.addOverlay(group2, `Less than ${quarterCount*2}`);
    control.addOverlay(group3, `Less than ${quarterCount*3}`);
    control.addOverlay(group4, `Less than ${quarterCount*4}`);
    control.addTo(map);
    
    group1.addTo(map); // Adding to map now adds all child layers into the parent group.
    group2.addTo(map);
    group3.addTo(map);
    group4.addTo(map);
    
    
    // Set-up buttons.
    
    document.getElementById("add").addEventListener("click", function () {
      map.addLayer(mcg);
    });
    
    document.getElementById("remove").addEventListener("click", function () {
      map.removeLayer(mcg);
    });

  })
    
}