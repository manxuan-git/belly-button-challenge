// read URL
function init() {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function (data) {
      console.log(data);
        var names = data.samples.map(x=>x.id)
        names.forEach(function(name) {
            d3.select('#selDataset')
                .append('option')
                .text(name)
            });
  
    // set 3 variables   
    var sample_values = data.samples.map(x=> x.sample_values);
    var otu_ids = data.samples.map(x=> x.otu_ids);
    var otu_label = data.samples.map(x=> x.otu_labels);
    
    // the top 10 OTU
    var sorted_test = sample_values.sort(function(a, b){return b-a});
    var top_ten = sorted_test.map(x => x.slice(0,10));
    var sorted_ids = otu_ids.sort(function(a, b){return b-a});
    var top_ids = sorted_ids.map(x =>x.slice(0,10));
    var sorted_labels = otu_label.sort(function(a, b){return b-a});
    var top_labels = sorted_labels.map(x =>x.slice(0,10));
  
    // the first ID 
    var firstID = data.metadata[0]
    var sampleMetadata1 = d3.select("#sample-metadata").selectAll('h1')
    
    // first ID's demographic information
    var sampleMetadata = sampleMetadata1.data(d3.entries(firstID))
    sampleMetadata.enter()
                  .append('h1')
                  .merge(sampleMetadata)
                  .text(d => `${d.key} : ${d.value}`)
                  .style('font-size','50%')
  
    sampleMetadata.exit().remove()
  
    // Create Bar Chart
    var trace1 = {
        x : top_ten[0],
        y : top_ids[0].map(x => "OTU" + x),
        text : top_labels[0],
        type : 'bar',
        orientation : 'h',
        transforms: [{
            type: 'sort',
            target: 'y',
            order: 'descending',
          }],
        marker: {
          color: 'rgb(10, 20,200)',
          opacity: 0.6,
          line: {
            color: 'rgb(10,20,200)',
            width: 1.5
          }
        }
    };
    // Create layout
    var layout1 = {};
    var data = [trace1];
    var config = {responsive:true}
    Plotly.newPlot('bar', data, layout1,config);
  
  

    // Create the trace for the bubble chart
    var trace2 = {
        x : otu_ids[0],
        y : sample_values[0],
        text : otu_label[0],
        mode : 'markers',
        marker : {
            color : otu_ids[0],
            size : sample_values[0]
        }
    };
  
    // Create buddle chart layout
    var layout2 = {
        title: '<b>Bubble Chart</b>',
        automargin: true,
        autosize: true,
        showlegend: false,
            margin: {
                l: 150,
                r: 50,
                b: 50,
                t: 50,
                pad: 4      
    }};
  
    // Draw the bubble chart
    var data2 = [trace2];
    var config = {responsive:true}
    Plotly.newPlot('bubble',data2,layout2,config);
  
    
    //Plot the weekly washing frequency in a gauge chart.
    // Get the first ID's washing frequency
    var firstWFreq = firstID.wfreq;
  
    // Calculations for gauge needle
    var firstWFreqDeg = firstWFreq * 20;
    var degrees = 180 - firstWFreqDeg;
    var radius = 0.5;
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(degrees * Math.PI / 180);
    var y = radius * Math.sin(degrees * Math.PI / 180);
  
    // Create path for gauge needle
    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
    var mainPath = path1,
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);
  
    // Create trace for gauge chart (both the chart and the pointer)
    var dataGauge = [
        {
          type: "scatter",
          x: [0],
          y: [0],
          marker: { size: 12, color: "(10,30,90,100)" },
          showlegend: false,
          name: "Freq",
          text: firstWFreq,
          hoverinfo: "text+name"
        },
        {
          values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
          rotation: 90,
          text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          textinfo: "text",
          textposition: "inside",
          marker: {
            colors: [
              'rgba(0,99,0,0)',
              'rgba(0,99,0,0.1)',
              'rgba(0,99,0,0.2)',
              'rgba(0,99,0,0.3)',
              'rgba(0,99,0,0.4)',
              'rgba(0,99,0,0.5)',
              'rgba(0,99,0,0.6)',
              'rgba(0,99,0,0.7)',
              'rgba(0,99,0,0.8)',
              'rgba(0,99,0,0)',]},

          labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          hoverinfo: "label",
          hole: 0.5,
          type: "pie",
          showlegend: false
        }
      ];
  
    // Create the layout for the gauge chart
    var layoutGauge = {
        shapes: [
          {
            type: "path",
            path: path,
            fillcolor: "rgba(0,55,34,1)",
            line: {
              color: "rgba(1,1,1,1)"
            }}],
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        height: 550,
        width: 550,
        xaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        },
        yaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        }};
      var config = {responsive:true}
      // Plot the gauge chart
      Plotly.newPlot('gauge', dataGauge,layoutGauge,config);
  });
  };
  
  
  // Call updatePlotly
  function optionChanged(id) {
    updatePlotly(id);
  };
  
  init();







  
//Dr.A's solution

// // function that populates the meta data
// function demoInfo(sample)
// {
//   console.log(sample);

//   d3,json("samples.json").then((data) => {
//     let metaData = data.metadata;

//     let result = metaData.filter(sampleResult => sampleResult.id == sample);

//     let resultData = result[0];
//     console.log(resultData);

//     Object.entries(resultData).forEach(([key,value]) => {
//       d3.select("#sample-metadata")
//         .append("<h5>").text('${key}:${value}');
//     });
//   });
// }

// //function that builds the graphs

// //function that initializes the dashboard
// function initialize()
// {
//   let data = d3.json("samples.json");
//   console.log(data);

//   //access the dropdown list
//   var select = d3.select("selDataset");

//   //use d3 to get data
//   d3.json("samples.json").then((data) => {
//     let samepleNames = data.names;
//     //console.log(sampleNames);

//     sampleNames.forEach((sample) => {
//       select.append("option")
//         .text(sample)
//         .property("value",sample);
//     });

//     let sample1 = sampleNames[0];
  
//     demoInfo(sample1);

//   });

// }

// //function that updates the dashboard
// function optionChanged(item)
// {
//   demoInfo(item);
// }



// //call initialize function
// initialize();