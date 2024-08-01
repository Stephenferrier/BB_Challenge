// store source URL
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// fetch the JSON data and log it
d3.json(url).then(function(data){
    console.log(data);
}); 

//create init function for bchart, bubble, and data
function init(){
  // Select the body element
  const body = document.querySelector('body');
  // Change the background color to green
  body.style.backgroundColor = '#006400';
    //create the dropdown list variable for all sample ids 
    let dropdown = d3.select("#selDataset");
    //access sample data using d3
    d3.json(url).then((data) => {
    //gather the sample ids and pop drop down
    let sample_ids = data.names;
    console.log(sample_ids);
        for (id of sample_ids){
            dropdown.append("option").attr("value", id).text(id);
        };
    //store the first sample 
    let first_entry = sample_ids[0];
    console.log(first_entry);
    
    //have the init() function call first entry
    makeBar(first_entry);
    makeBubble(first_entry);
    makeDemographics(first_entry);
    }); //end of d3 
};

//create a function to populate graph
function makeBar(sample){

    //access the sample data for bchart
    d3.json(url).then((data) => {
        let sample_data = data.samples;

        //apply a filter 
        let results = sample_data.filter(id => id.id == sample);

        //access and store the first entry in results filter
        let first_result = results[0];
        console.log(first_result);

        //store the first 10 results 
        let sample_values = first_result.sample_values.slice(0,10);
        let otu_ids = first_result.otu_ids.slice(0,10);
        let otu_labels = first_result.otu_labels.slice(0,10);
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        //create the trace for bar chart
        let bar_trace = {
          x: sample_values.reverse(),
          y: otu_ids.map(item => `OTU ${item}`).reverse(),
          text: otu_labels.reverse(),
          type: 'bar',
          orientation: 'h',
          marker: {
              color: 'green' // Change the color of the bars to green
          }
      };

        let layout = {title: "Top Ten OTUs"};
        Plotly.newPlot("bar", [bar_trace], layout);
    });
};

function makeBubble(sample){
    //access the sample data for bubble chart
    d3.json(url).then((data) => {
        let sample_data = data.samples;

        //apply a filter 
        let results = sample_data.filter(id => id.id == sample);

        //access and store the first entry 
        let first_result = results[0];
        console.log(first_result);

        //store the results 
        let sample_values = first_result.sample_values;
        let otu_ids = first_result.otu_ids;
        let otu_labels = first_result.otu_labels;
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        //create the trace for bubble chart
        let bubble_trace = {
          x: otu_ids.reverse(),
          y: sample_values.reverse(),
          text: otu_labels.reverse(),
          mode: 'markers',
          marker: {
              size: sample_values,
              color: otu_ids, // Use otu_ids for color scale
              colorscale: 'Greens' // Use a green color scale
          }
      };

        let layout = {
            title: "Bacteria Count for each Sample ID",
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Number of Bacteria'}
        };
        Plotly.newPlot("bubble", [bubble_trace], layout); 
    });
};

//create the demographic info function for pop sample
function makeDemographics(sample){
    //access the sample data 
    d3.json(url).then((data) => {
    //access the demographic info with d3
    let demographic_info = data.metadata;
     //apply a filter on sample id
    let results = demographic_info.filter(id => id.id == sample);
    //store the first result 
    let first_result = results[0];
    console.log(first_result);
    //clear previous entries 
    d3.select('#sample-metadata').text('');

    Object.entries(first_result).forEach(([key,value]) => {
        console.log(key,value);
        //select the demographic info
        d3.select('#sample-metadata').append('h3').text(`${key}, ${value}`);
    });
    });
};
// //define the function for change
function optionChanged(value){
    //log the value for debug
    console.log(value);
    makeBar(value);
    makeBubble(value);
    makeDemographics(value);
};
init();