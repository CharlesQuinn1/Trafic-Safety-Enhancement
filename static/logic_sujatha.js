// init();

function dashboard() {
  // Make the elements visible
  document.querySelector(".home-page").style.setProperty('display', 'none');
  document.querySelector(".container").style.setProperty('display', 'block');
  document.getElementById("line").style.display = "block";
  document.getElementById("stack").style.display = "block";
  document.getElementById("bar").style.display = "block";
  document.querySelector(".cluster-map").style.display = "none";
  document.getElementById("map").style.display = "none";
  document.querySelector(".issue-analysis").style.display = "none";
  document.getElementById("issue").style.display = "none";

// 
  d3.json("/api/v1.0/date").then(data => {
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
    createBarChart(groupedData);

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
    Plotly.newPlot('line', traces, layout);
    // Create a stacked area chart
    createStackedAreaChart(data);
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
      opacity: 0.35,
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
// // Function to create a bar chart for total report counts by year
function createBarChart(groupedData) {
  var years = Object.keys(groupedData);
  var counts = years.map(year => groupedData[year].counts.reduce((sum, count) => sum + count, 0));

  var barTrace = {
    x: years,
    y: counts,
    type: 'bar',
    marker: {
      color: 'blue' // Adjust color as needed
    }
  };

  var barData = [barTrace];

  // Layout settings for bar chart
  var barLayout = {
    title: 'Total Traffic Report Counts by Year',
    xaxis: { title: 'Year' },
    yaxis: { title: 'Total Count' }
  };

  // Create a bar chart using Plotly
  Plotly.newPlot('bar', barData, barLayout);
}
// Function to create a stacked area chart

function createStackedAreaChart(data) {
  // Group data by time period and year
  var groupedData = {
    "Morning": {"years": [], "counts": []},
    "Afternoon": {"years": [], "counts": []},
    "Evening": {"years": [], "counts": []},
    "Night": {"years": [], "counts": []}
  };
  
  data.forEach(function(entry) {
    var timePeriod = getTimePeriod(entry.hour);
    if (timePeriod) {
      // Check if the year is not already in the years array
      if (!groupedData[timePeriod].years.includes(entry.year)) {
        groupedData[timePeriod].years.push(entry.year);
        groupedData[timePeriod].counts.push(entry.count);
      }
      
    }
  });

  // Create traces for each time period
  var traces = [];
  for (var timePeriod in groupedData) {
    var trace = {
      x: groupedData[timePeriod].years,
      y: groupedData[timePeriod].counts,
      // fill: 'tozeroy', // Adjust the fill type as needed
      stackgroup: 'one',
      name: timePeriod
    };
    console.log( groupedData[timePeriod].years)
    console.log( groupedData[timePeriod].counts)
    traces.push(trace);
  }

  // Layout settings for stacked area chart
  var layout = {
    title: 'Traffic Report Counts by Time Period',
    xaxis: {
      title: 'Year',
    },
    yaxis: { title: 'Count' },
    showlegend: true
  };

  // Create a stacked area chart using Plotly
  Plotly.newPlot('stack', traces, layout);
}

function getTimePeriod(hour) {
  if (hour >= 0 && hour < 6) {
    return "Night";
  } else if (hour >= 6 && hour < 12) {
    return "Morning";
  } else if (hour >= 12 && hour < 18) {
    return "Afternoon";
  } else {
    return "Evening";
  }
}