// let url = "https://data.austintexas.gov/resource/dx9v-zd7x.json?$$app_token=snzNQgy9iCYR2bChVFIJs40KH&$limit=10000";
// Promise Pending
let url = "/api/v1.0/trafficdata";
function init() {
    // Use D3 to select the dropdown menu
    let dropdown = d3.select("#selDataset");
    // let demo = d3.select("#sample-metadata");
    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then(traficData => {
    // Set a variable for the sample names
    let issues = [];
    let report_ids = [];
    for (i=0; i < traficData.length; i++){
        issues.push(traficData[i].issue_reported);
        report_ids.push(traficData[i].traffic_report_id);
    }
    // Remove duplicate issue_reported codes
    let result = [];
    issues.forEach((item) => {
        if(result.indexOf(item) < 0) {
            result.push(item);
             console.log(item)
             dropdown.append("option").text(item).property("value");
    }
    });

        // let name = sample_names[0];
        // // Build the initial plots
        // loadMetadata(name);
        // loadBarChart(name);
        // loadBubbleChart(name);
        // loadGaugeChart(name);
        
    });
}

// // // Function to load metadata
// function loadMetadata(id) {

//     // Use D3 to retrieve all of the data
//     d3.json(url).then((data) => {

//         let metadata = data.metadata;
//         // create new arrary for the selected id
//         let value = metadata.filter(result => result.id == id);

//         // Get the first index from the array
//         let first_value = value[0];
//         d3.select("#sample-metadata").html("");
//         Object.entries(first_value).forEach(([key,value]) => {
//             d3.select("#sample-metadata").append("h6").text(`${key}: ${value}`);
//         });
//     });

// };

// // Function that builds the bar chart
// function loadBarChart(id) {

//     // Use D3 to retrieve all of the data
//     d3.json(url).then((data) => {

//         // Retrieve all sample data
//         let samples = data.samples;

//         // Filter based on the value of the sample
//         let value = samples.filter(result => result.id == id);

//         // Get the first index from the array
//         let first_value = value[0];

//         // Get the otu_ids, lables, and sample values
//         let otu_ids = first_value.otu_ids;
//         let otu_labels = first_value.otu_labels;
//         let sample_values = first_value.sample_values;

//         // Set top ten items to display in descending order
//         let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
//         let xticks = sample_values.slice(0,10).reverse();
//         let labels = otu_labels.slice(0,10).reverse();
        
//         // Set up the trace for the bar chart
//         let trace = {
//             x: xticks,
//             y: yticks,
//             text: labels,
//             type: "bar",
//             orientation: "h"
//         };

//         // // Setup the layout
//         let layout = {
//             title: ""
//         };

//         // Call Plotly to plot the bar chart
//         Plotly.newPlot("bar", [trace], layout)
//     });
// };

// // Function that builds the bubble chart
// function loadBubbleChart(id) {

//     // Use D3 to retrieve all of the data
//     d3.json(url).then((data) => {
        
//         // Retrieve all sample data
//         let sample = data.samples;

//         // Filter based on the value of the sample
//         let value = sample.filter(result => result.id == id);

//         // Get the first index from the array
//         let first_value = value[0];

//         // Get the otu_ids, lables, and sample values
//         let otu_ids = first_value.otu_ids;
//         let otu_labels = first_value.otu_labels;
//         let sample_values = first_value.sample_values;
        
//         // Set up the trace for bubble chart
//         let trace1 = {
//             x: otu_ids,
//             y: sample_values,
//             text: otu_labels,
//             mode: "markers",
//             marker: {
//                 size: sample_values,
//                 color: otu_ids,
//                 colorscale: "Earth"
//             }
//         };

//         // Set up the layout
//         let layout = {
//             title: "",
//             xaxis: {title: "OTU ID"},
//         };

//         // Call Plotly to plot the bubble chart
//         Plotly.newPlot("bubble", [trace1], layout)
//     });
// };
// function loadGaugeChart(id) {

//     // Use D3 to retrieve all of the data
//     d3.json(url).then((data) => {
        
//         // Retrieve all sample data
//         let sample = data.samples;
//         let metadata = data.metadata;
//         let gaugeValue = metadata.filter(result => result.id == id);
//         let first_value2 = gaugeValue[0].wfreq;

//         // Set up the trace for the gauge chart
//     let trace2 = {
//         type: "indicator",
//         mode: "gauge+delta",
//         value: first_value2,          // The value to display on the gauge
//         // title: { text: "Belly button washing frequency" },
//         gauge: {
//             axis: { range: [0, 9] },  // Adjust the range of the gauge
//             bar: { color: "darkblue" },
//             bgcolor: "white",
//             borderwidth: 2,
//             bordercolor: "gray",
//             shape: "angular",
//             dtick: 2, // Set the step between tick marks
//         tickangle: 45, // Angle of tick labels
//             steps: [
//                 { range: [0, 3], color: "red" },
//                 { range: [3, 6], color: "yellow" },
//                 { range: [6, 9], color: "green" }
//             ],
//             threshold: {
//                 line: { color: "red", width: 4 },
//                 thickness: 0.75,
//                 value: first_value2  // Set the value for the threshold line
//             }
//         }
//     };


//         // Set up the layout
//         let layout = {
//             title: "Belly button washing frequency",
//         };

//         // Call Plotly to plot the bubble chart
//         Plotly.newPlot("gauge", [trace2], layout)
//     });
// };

// Call the init function when the html page is loading first time
init();
