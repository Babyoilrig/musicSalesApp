

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
 // console.log(metric);


 //So BASICALLY - the code below works - BUT, we will also need to pass:
 //-That it only needs to happen when pfs is clicked (and no other buttons)
 //The axis title needs changing to hundreds
 //The cagr lines might also be affected




 //Now just need to get the cagr to be the same - I'm guessing that also needs to be divided by 1 million
 //Instead of a billion


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
// console.log(metricLowerCase);
// console.log(`data1.${metricLowerCase}`);

     sourcedGraphData = {
     label: `${deviceTitle} ${metricTitle} ${year}`,
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
 // console.log('I am create graphDataset and I have run!')
 let chartDataTitle = `chartData${metric}`;
 chartDataTitle = {
   labels: ["AAA", "Europe", "Latin Am.", "North Am."],
   datasets: dataArray,
 }
 // console.log(chartDataTitle);
 return chartDataTitle;
}



