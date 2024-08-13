

let metric;
let metricTitle;
let metricDivisor;
let sourcedGraphData;
let metricLowerCase;


//Creating generic function to make graph data
export function sourceGraphData(metric, deviceTitle, year, data1, data2, data3, data4, colour, stackNumber, hiddenOrShowing, molecule) {
 // console.log('I am createGraphData and I have run!');
 const getDpButton = document.querySelector('.disposable-pen');
 // console.log(data1);
//  console.log(deviceTitle);

 let deviceTitleMusic;


if(deviceTitle === "PFS") {
  deviceTitleMusic = "DOWNLOADS";
} else if (deviceTitle === "AI") {
  deviceTitleMusic = "CD";
} else if (deviceTitle === "DP") {
  deviceTitleMusic = "VINYL";
}


 if(molecule === "INSULIN ASPART" && metric === "Val" && deviceTitle === "PFS")
 {
   // console.log('Its me youre looking for!');
   metricTitle = "Value";
 metricLowerCase = "val";
 metricDivisor = 1_000_000;

} else if (metric === "Val"){
     metricTitle = "Value";
     metricLowerCase = "val";
     metricDivisor = 1_000_000_000;

 } else if (metric == "Vol") {
 metricTitle = "Volume";
 metricLowerCase = "vol";
 metricDivisor = 1_000_000;


} else if (metric == "Asp") {
 metricTitle = "Asp";
 metricLowerCase = "asp";
 metricDivisor = 100;
}


     sourcedGraphData = {
     label: `${deviceTitleMusic} ${metricTitle} ${year}`,
     data: [
           (data1 ? data1[metricLowerCase].find(item => item.year === year).value / metricDivisor : 0),
           (data2 ? data2[metricLowerCase].find(item => item.year === year).value / metricDivisor : 0),
           (data3 ? data3[metricLowerCase].find(item => item.year === year).value / metricDivisor : 0),
           (data4 ? data4[metricLowerCase].find(item => item.year === year).value / metricDivisor : 0),
           ],
     backgroundColor: [colour],
     stack: `Stack ${stackNumber}`,
     hidden: hiddenOrShowing,
     }


//  ]  
// }



return sourcedGraphData;
}


export function createGraphDataset(dataArray, metric) {
 let chartDataTitle = `chartData${metric}`;
 chartDataTitle = {
   labels: ["AAA", "Europe", "Latin Am.", "North Am."],
   datasets: dataArray,
 }
 return chartDataTitle;
}



