
function analysis() {
  // Make the elements visible
  document.querySelector(".home-page").style.setProperty('display', 'none');
  document.querySelector(".container").style.display = "none";
  document.getElementById("line").style.display = "none";
  document.getElementById("stack").style.display = "none";
  document.getElementById("bar").style.display = "none";
  document.querySelector(".cluster-map").style.display = "none";
  document.getElementById("map").style.display = "none";
  document.querySelector(".issue-analysis").style.display = "block";
  document.getElementById("issue").style.display = "block";

  // Get the data with d3.
  d3.json("/analysis").then(data => {
    // Group data by year
    var groupedData = {};
    data.forEach(function(entry) {
      var issue_reported = entry.issue_reported;
      if (!groupedData[issue_reported]) {
        groupedData[issue_reported] = {"year": [], "count": []};
      }
      groupedData[issue_reported].year.push(entry.year);
      groupedData[issue_reported].count.push(entry.issue_count);
    });

    var issueData = [];
    data.forEach(function(entry) {
      issueData.push(entry.issue_reported);
    });

    // Function to get rush hour shaded regions
    function getRushHourShapes(groupedData) {
      var issueList = issueData; // Example rush hours
      var shapes = [];
      
        for (var issue of issueList) {
          shapes.push({
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: issue - 0.5,
            x1: issue + 0.5,
            y0: 0,
            y1: 1,
            fillcolor: 'rgba(255, 0, 0, 0.3)',
            opacity: 0.3,
            line: {
              width: 0
            }
          });
        }
      }
  

    // Create traces for each year
    var traces = [];
    for (var issue_reported in groupedData) {
      var trace = {
        x: groupedData[issue_reported].year,
        y: groupedData[issue_reported].count,
        mode: 'lines',
        name: issue_reported
      };
      traces.push(trace);
    };

            // Layout settings
    var layout = {
      title: 'Accident Distribution by Issue Reported 2018-2022',
      xaxis: {
        title: 'Year',
        tickmode: 'array',
        tickvals: [2018, 2019, 2020, 2021, 2022],
        ticktext: ['2018', '2019', '2020', '2021', '2022']
      },
      yaxis: { title: 'Issue Counts' },
      shapes: getRushHourShapes(groupedData)
    };

        // Create a line chart using Plotly
    Plotly.newPlot('issue', traces, layout);

  });

}
