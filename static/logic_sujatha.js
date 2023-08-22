
function init() {
  // Use D3 to select the dropdown menu
  let dropdown = d3.select("#selDataset");
  
  // Fetch data from your API endpoint
  d3.json("/api/v1.0/date").then(data => {

        // Use D3 to select the dropdown menu
    let dropdown = d3.select("#selDataset");
   
    const dates = Object.keys(data);
    const morningValues = dates.map(date => data[date].morning || 0);
    const afternoonValues = dates.map(date => data[date].afternoon || 0);
    const eveningValues = dates.map(date => data[date].evening || 0);
    const nightValues = dates.map(date => data[date].night || 0);
    console.log(nightValues+"night");
    const morningTrace = {
      x: dates,
      y: morningValues,
      mode: 'lines',
      name: 'Morning'
    };
    
    const afternoonTrace = {
      x: dates,
      y: afternoonValues,
      mode: 'lines+markers',
      name: 'Afternoon'
    };
    
    const eveningTrace = {
      x: dates,
      y: eveningValues,
      mode: 'lines+markers',
      name: 'Evening'
    };
    
    const nightTrace = {
      x: dates,
      y: nightValues,
      mode: 'lines+markers',
      name: 'Night'
    };
    
    const traces = [morningTrace, afternoonTrace, eveningTrace, nightTrace];
    const layout = {
      title: `Accidents per Day for`,
      xaxis: { title: 'Date' },
      yaxis: { title: 'Number of Accidents' }
  };
 
    Plotly.newPlot("bubble", traces, layout);
        });
    }
    
    // Call the init function to initialize the dropdown and chart
    init();
