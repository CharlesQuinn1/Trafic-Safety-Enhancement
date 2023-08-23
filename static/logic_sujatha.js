init();

function init() {
  d3.json("/api/v1.0/date2").then(data => {
    // Group data by year
    var groupedData = {};
    data.forEach(function(entry) {
      var year = entry.year;
      if (!groupedData[year]) {
        groupedData[year] = {"hours": [], "counts": []};
      }
      groupedData[year].hours.push(entry.hour);
      groupedData[year].counts.push(entry.count);
    });

    // Create traces for each year
    var traces = [];
    for (var year in groupedData) {
      var trace = {
        x: groupedData[year].hours,
        y: groupedData[year].counts,
        mode: 'lines',
        name: year
      };
      traces.push(trace);
    }

    // Layout settings
    var layout = {
      title: 'Traffic Report Count by Hour for Each Year',
      xaxis: {
        title: 'Hour',
        tickvals: getTickValues(),
        ticktext: getTickLabels(),
      },
      yaxis: { title: 'Count' },
      shapes: getRushHourShapes(groupedData)
    };

    // Create a line chart using Plotly
    Plotly.newPlot('bubble', traces, layout);
  });
}

// Function to get rush hour shaded regions
function getRushHourShapes(groupedData) {
  var rushHours = [7, 8, 17, 18]; // Example rush hours
  var shapes = [];
  
  for (var hour of rushHours) {
    shapes.push({
      type: 'rect',
      xref: 'x',
      yref: 'paper',
      x0: hour - 0.5,
      x1: hour + 0.5,
      y0: 0,
      y1: 1,
      fillcolor: 'rgba(255, 0, 0, 0.3)',
      opacity: 0.3,
      line: {
        width: 0
      }
    });
  }
  
  return shapes;
}

// Function to get tick values (3-hour intervals)
function getTickValues() {
  var tickValues = [];
  for (var i = 0; i < 24; i += 3) {
    tickValues.push(i);
  }
  return tickValues;
}

// Function to get tick labels in 12-hour format
function getTickLabels() {
  var labels = [];
  for (var i = 0; i < 24; i += 3) {
    var hour = i % 12 || 12;
    var period = i < 12 ? 'AM' : 'PM';
    labels.push(`${hour} ${period}`);
  }
  return labels;
}
