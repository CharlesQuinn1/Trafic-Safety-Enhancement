
function init1() {
  // // Use D3 to select the dropdown menu
  // let dropdown = d3.select("#selDataset");
  
  // // Fetch data from your API endpoint
  // d3.json("/api/v1.0/date").then(data => {

  //       // Use D3 to select the dropdown menu
  //   let dropdown = d3.select("#selDataset");
   
  //   const dates = Object.keys(data);
  //   const morningValues = dates.map(date => data[date].morning || 0);
  //   const afternoonValues = dates.map(date => data[date].afternoon || 0);
  //   const eveningValues = dates.map(date => data[date].evening || 0);
  //   const nightValues = dates.map(date => data[date].night || 0);
  //   console.log(nightValues+"night");
  //   const morningTrace = {
  //     x: dates,
  //     y: morningValues,
  //     mode: 'lines',
  //     name: 'Morning'
  //   };
    
  //   const afternoonTrace = {
  //     x: dates,
  //     y: afternoonValues,
  //     mode: 'lines+markers',
  //     name: 'Afternoon'
  //   };
    
  //   const eveningTrace = {
  //     x: dates,
  //     y: eveningValues,
  //     mode: 'lines+markers',
  //     name: 'Evening'
  //   };
    
  //   const nightTrace = {
  //     x: dates,
  //     y: nightValues,
  //     mode: 'lines+markers',
  //     name: 'Night'
  //   };
    
  //   const traces = [morningTrace, afternoonTrace, eveningTrace, nightTrace];
  //   const layout = {
  //     title: `Accidents per Day for`,
  //     xaxis: { title: 'Date' },
  //     yaxis: { title: 'Number of Accidents' }
  // };
 
  //   Plotly.newPlot("bubble", traces, layout);
  //       });
    }
    init()
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
          traces.push({
            x: groupedData[year].hours,
            y: groupedData[year].counts,
            mode: 'lines',
            name: year
          });
        }
    
        // Layout settings
        var layout = {
          title: 'Traffic Report Count by Hour for Each Year',
          xaxis: { title: 'Hour' },
          yaxis: { title: 'Count' }
        };
    
        // Create a line chart using Plotly
        Plotly.newPlot('bubble', traces, layout);
      });
    }
    