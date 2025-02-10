// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sample_metadata = metadata.filter(rowkim => rowkim.id == parseInt(sample))[0];
    console.log(sample_metadata);

    // if (!sample-metadata) {
    //   console.error(`No metadata found for sample ${sample}`);
    //   return;
    // }

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new (loop through the key value pairs of js object)
    // tags for each key-value in the filtered metadata.
    let metadata_keys = Object.keys(sample_metadata); // its result will be ["id", "otu_ids", "sample_values", "otu_labels"] retrieves all the keys from the metadata_result object and stores them in an array called metadata_keys.
    for (let i = 0; i < metadata_keys.length; i++) {
      // get key/value pair
      let key = metadata_keys[i]; // if i=0 its results will be "id", if i=1 its results will be  "otu_ids", etc..
      let value = sample_metadata[key]; // if i=0 its results will be "940"..

      // add to html
      panel.append("p").text(`${key}: ${value}`); // if i=0 its results will be <p>id: 940</p>
    }
  });
}
//.........................................................................
// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let samplesresult = samples.filter(row => row.id == parseInt(sample))[0]; // can also use ===
    console.log(samplesresult)

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = samplesresult.otu_ids;
    let otu_labels = samplesresult.otu_labels;
    let sample_values = samplesresult.sample_values;
//.....................................................................
    // Build a Bubble Chart
    let bubbletrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "YlGnBu"
      }
    };

    // Data trace array
    let bubbletraces = [bubbletrace];

    // Apply a title to the layout
    let bubblelayout = {
        title: {
            text: `Bacteria Cultures Per Sample`
        },
        yaxis: {
            title: {
                text: 'Number of Bacteria'
            }
        },
        xaxis: {
            title: {
                text: 'OTU ID'
            }
        },
        height: 600
    };

    // Render the bubble chart (IDS=bubble)
    Plotly.newPlot('bubble', bubbletraces, bubblelayout);
//............................................................
    // Build a Bar Chart
    // (ex:if otu_ids were [1, 2, 3], the resulting bar_ticks would be ["OTU: 1", "OTU: 2", "OTU: 3"].)
    let barY_ticks = otu_ids.map(x => `OTU: ${x}`); 
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bartrace = {
      x: sample_values.slice(0,10).reverse(),
      y: barY_ticks.slice(0,10).reverse(),
      type: 'bar',
      hovertext: otu_labels.slice(0,10).reverse(),
      marker: {
        color: 'green'
      },
      orientation: 'h'
    }
  
   // Data Array
    let bartraces = [bartrace];
  
    // Apply a title to the layout
    let barlayout = {
      title: {
          text: `Top 10 Bacteria Cultures Found`
      },
      xaxis: {
          title: {
              text: 'Number of Bacteria'
          }
      },
      height: 600
   };

    // Render the bubble chart (IDS=bubble)
  Plotly.newPlot('bar', bartraces, barlayout); 
  });
}

//................................................................
// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    console.log(names);

    for (let i = 0; i < names.length; i++) {
      let name = names[i];

      // Create option
      dropdown.append("option").text(name); //.property("value", name); we don't need value
    }


    // Get the first sample from the list
    let first_sample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample);
    buildCharts(first_sample);
  });
}
// Function for event listener
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}
// Initialize the dashboard
init();