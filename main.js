import './style.css';
import Chart from 'chart.js/auto';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import chartTrendline from 'chartjs-plugin-trendline';
import annotationPlugin from 'chartjs-plugin-annotation';
import { createSingularDatasetForTablesAndTrendlines, combineDataTwoDatasetsForTablesAndTrendlines, combineDataThreeDatasetsForTablesAndTrendlines} from './generateDataForTableAndTrendline';
import { showTable } from './chart';
// import waterMarkPlugin from './chartjs-plugin';
import { showLegend, hideLegend, inputStaticColoursIntoLegend } from './legend';
import { showTutorialOnFirstVisit, hideSpeechBubbles, showTutorial } from './tutorial';
import calculateCAGR from './cagr';
import { findBeginningValuesForCAGRFunction, findEndingValuesForCAGRFunction } from './trendlines';
import { divideByMillionBillionHundred, fetchData, orderAlphabetically, resetPage} from './Utilities';
import { showAnnotations, hideAnnotations } from './annotations';
import { showAndHideProductBoxes, selectCorrectMedicineImage } from './selectCorrectImages';
import { sourceGraphData, createGraphDataset}  from './generateGraphData';
import { hideAllGraphData, hideGraph } from './graphs';




//Selecting elements on the page
const pfsButton = document.querySelector('.prefilled-syringe');
const daijButton = document.querySelector('.disposable-autoinjector');
const dpButton = document.querySelector('.disposable-pen');
const chartButton = document.querySelector('.chart');
const prodRecsButton = document.querySelector('.product-recommendations');
let syringeImage = document.querySelector('.syringe-image');
let graphImage = document.querySelector('.graph-image');
const brandNameText = document.querySelector('.brand-name-subtitle');
const indicationText = document.querySelector('.indication-sub-title');
const patentExpiryText = document.querySelector('.US-patent-expiry');
const mainTitleText = document.querySelector('.main-title');
const graphContainer1 = document.querySelector('.graph-container1');
const graphContainer2 = document.querySelector('.graph-container2');
const graphContainer3 = document.querySelector('.graph-container3');
const aspTitle = document.querySelector('.graph-title3');
const moleculeSelector = document.querySelector('.medicine-selector');
const showTutorialButton = document.querySelector('.show-tutorial');


let data;
let beginningAndEndingValuesPfsVol;
let beginningAndEndingValuesPfsVal;
let beginningAndEndingValuesPfsAsp;
let beginningAndEndingValuesDaijVol;
let beginningAndEndingValuesDaijVal;
let beginningAndEndingValuesDaijAsp;
let beginningAndEndingValuesDpVol;
let beginningAndEndingValuesDpVal;
let beginningAndEndingValuesDpAsp;
let beginningAndEndingValuesPfsAndDaijVol;
let beginningAndEndingValuesPfsAndDaijVal;
let beginningAndEndingValuesDaijAndDpVol;
let beginningAndEndingValuesDaijAndDpVal;
let beginningAndEndingValuesPfsAndDpVol;
let beginningAndEndingValuesPfsAndDpVal;
let beginningAndEndingValuesThreeDevicesVol;
let beginningAndEndingValuesThreeDevicesVal;
let configVal;


const colours = {
//  colour0: '#9799af', //dark grey
//  colour1: '#dedede', //light grey
//  colour2: '#e0b0ff', //purple
colour0: '#389f0a',
colour1: '#5ae717',
colour2: '#d3ffb3',
 colour3: '#ff9800', //orange
 colour4: '#e5de00', //yellow
 colour5: '#ff6865', //red
 colour6: '#2a17cb', //bright blue
 colour7: '#00c0f9', //light blue
 colour8: '#02f7d8', //turquoise
}


//Functionality for pushin cagrs into arrays so can access for charts
function makeCagrValuesArrayToPassToChart() {
 // console.log('I am makeCagrValuesArrayToPassToChart and I have run');
 const keyArrayVol = ["volPfs", "volDaij", "volDp", "volPfsAndDaij", "volDaijAndDp", "volPfsAndDp", "volThreeDevices"];
const keyArrayVal = ["valPfs", "valDaij", "valDp", "valPfsAndDaij", "valDaijAndDp", "valPfsAndDp", "valThreeDevices"];
const keyArrayAsp = ["aspPfs", "aspDaij", "aspDp"];


let volCagrArray = [];
let valCagrArray = [];
let aspCagrArray = [];
volCagrArray.push(
 beginningAndEndingValuesPfsVol[2][1],
 beginningAndEndingValuesDaijVol[2][1],
 beginningAndEndingValuesDpVol[2][1],
 beginningAndEndingValuesPfsAndDaijVol[2][1],
 beginningAndEndingValuesDaijAndDpVol[2][1],
 beginningAndEndingValuesPfsAndDpVol[2][1],
 beginningAndEndingValuesThreeDevicesVol[2][1]
)


let volCagrWithKeys = {};
   keyArrayVol.forEach((key, i) => volCagrWithKeys[key] = volCagrArray[i]);


//val
valCagrArray.push(
 beginningAndEndingValuesPfsVal[2][1],
 beginningAndEndingValuesDaijVal[2][1],
 beginningAndEndingValuesDpVal[2][1],
 beginningAndEndingValuesPfsAndDaijVal[2][1],
 beginningAndEndingValuesDaijAndDpVal[2][1],
 beginningAndEndingValuesPfsAndDpVal[2][1],
 beginningAndEndingValuesThreeDevicesVal[2][1]
)


let valCagrWithKeys = {};
   keyArrayVal.forEach((key, i) => valCagrWithKeys[key] = valCagrArray[i]);


//asp
aspCagrArray.push(
 beginningAndEndingValuesPfsAsp[2][1],
 beginningAndEndingValuesDaijAsp[2][1],
 beginningAndEndingValuesDpAsp[2][1],
)


let aspCagrWithKeys = {};
   keyArrayAsp.forEach((key, i) => aspCagrWithKeys[key] = aspCagrArray[i]);


let cagrValuesArray = [];
cagrValuesArray.push(volCagrWithKeys, valCagrWithKeys, aspCagrWithKeys);
return cagrValuesArray;
}


///////////////////////////////////////////////////////////////////////
//Getting data - of just the molecules - with just names and ids


showTutorialOnFirstVisit();


fetchData("https://sxtmrgzt5e.execute-api.eu-west-1.amazonaws.com/prod/music").then(moleculeData => {
  


 //Dynamically input names and ids from first fetch into selector dropdown menu


 orderAlphabetically(moleculeData);


 moleculeData.forEach(function (molecule) {


   moleculeSelector.options[moleculeSelector.options.length] = new Option(molecule.name.toUpperCase(), molecule.id);


 })


 //Providing default dropdown value on page load
 moleculeSelector.value = "BILLY IDOL";
 //Calling the function for second fetch on page load - with above default value


 checkIDAndFetchMainData(moleculeSelector.value);


})


let volume = undefined;
let value = undefined;
let asp = undefined;
//Defining the function for the second (main data) fetch
function checkIDAndFetchMainData(dropDownValue) {
 console.log('I am checkIDAndFetchMainData and I have run!');
//  console.log({dropDownValue});


 fetchData(`https://sxtmrgzt5e.execute-api.eu-west-1.amazonaws.com/prod/music/${dropDownValue}`).then(fetchedData => {


   data = fetchedData;
   //Adding values to page for brand name, indication, patent
   console.log({ data });
   //This below
  
   brandNameText.textContent = data.brandName;
   //This below
   indicationText.textContent = data.indication;
   patentExpiryText.textContent = data.usPatentExpiry;
   console.log({data});
   const mainTitleUpperCase = data.name.toUpperCase();
   mainTitleText.textContent = mainTitleUpperCase;


   const pfs = data.containers.find(c => c.primaryContainer === "PFS") ? data.containers.find(c => c.primaryContainer === "PFS") : 0;
  console.log(pfs);
   const daij = data.containers.find(c => c.primaryContainer === "disposable autoinjectors") ? data.containers.find(c => c.primaryContainer === "disposable autoinjectors") : 0;
   console.log(daij);
  
   const dp = data.containers.find(c => c.primaryContainer === "Disposable pens") ? data.containers.find(c => c.primaryContainer === "Disposable pens") : 0;
  console.log(dp);


  
   // //PFS - Prefilled syringe - Regions


   const pfsAaa = pfs ? pfs.region.AAA : 0;
  //  console.log(pfsAaa);
   const pfsEurope = pfs ? pfs.region.EUROPE : 0;
   const pfsLatinAmerica = pfs ? pfs.region.LATINAMERICA : 0;
   const pfsNorthAmerica = pfs ? pfs.region.NORTHAMERICA : 0;




   // //DAIJ - Disposable Autoinjector


   const daijAaa = daij ? daij.region.AAA : 0;
   const daijEurope = daij ? daij.region.EUROPE : 0;
   const daijLatinAmerica = daij ? daij.region.LATINAMERICA : 0;
   const daijNorthAmerica = daij ? daij.region.NORTHAMERICA : 0;




   // //DP - Disposable pen


   const dpAaa = dp ? dp.region.AAA : 0;
   const dpEurope = dp ? dp.region.EUROPE : 0;
   const dpLatinAmerica = dp ? dp.region.LATINAMERICA : 0;
   const dpNorthAmerica = dp ? dp.region.NORTHAMERICA : 0;
    //Here make functionality to change size of Insulin Aspart graph canvas
   //REMEMBER ASWELL - it is only for Pfs that it happens! ****************
   const molecule = data.name;
   // console.log(molecule);


   // function changeWidthOfGraphForInsulinAspart() {
   //   console.log('I am changeWidthOfGraphForInsulinAspart and I have run!');
   //   if(data.name === "INSULIN ASPART") {
   //     const graphCanvas2 = document.querySelector('.graph-canvas2');
   //     console.log(graphCanvas2);
   //     graphCanvas2.style.width = "550px";
   //   }
   // }


   // changeWidthOfGraphForInsulinAspart();
  
   //Might need to change the axis AND change the amount it is being divided by?




function findSingularBeginningAndEndingValuesforCAGR() {
 beginningAndEndingValuesPfsVol = generateDataforTrendlineOneDevice('PFS', 'vol');
 beginningAndEndingValuesPfsVal = generateDataforTrendlineOneDevice('PFS', 'val');
 console.log(beginningAndEndingValuesPfsVal);
 beginningAndEndingValuesPfsAsp = generateDataforTrendlineOneDevice('PFS', 'asp');
 // console.log(beginningAndEndingValuesPfsVol[2][1]);


 //Getting trendline data for Daij
 beginningAndEndingValuesDaijVol = generateDataforTrendlineOneDevice('disposable autoinjectors', 'vol');
 beginningAndEndingValuesDaijVal = generateDataforTrendlineOneDevice('disposable autoinjectors', 'val');
 beginningAndEndingValuesDaijAsp = generateDataforTrendlineOneDevice('disposable autoinjectors', 'asp');


 //Getting trendline data for Dp
 beginningAndEndingValuesDpVol = generateDataforTrendlineOneDevice('Disposable pens', 'vol');
 beginningAndEndingValuesDpVal = generateDataforTrendlineOneDevice('Disposable pens', 'val');
 beginningAndEndingValuesDpAsp = generateDataforTrendlineOneDevice('Disposable pens', 'asp');


 }


findSingularBeginningAndEndingValuesforCAGR();


 
function findCombinedBeginningAndEndingValuesforCAGR() {
 beginningAndEndingValuesPfsAndDaijVol = generateCombinedDataforTrendlineTwoDevices({ device1: 'PFS', device2: 'disposable autoinjectors' }, 'vol');
  
 beginningAndEndingValuesPfsAndDaijVal = generateCombinedDataforTrendlineTwoDevices({ device1: 'PFS', device2: 'disposable autoinjectors' }, 'val');


 beginningAndEndingValuesDaijAndDpVol = generateCombinedDataforTrendlineTwoDevices({ device1: 'disposable autoinjectors', device2: 'Disposable pens' }, 'vol');


 beginningAndEndingValuesDaijAndDpVal = generateCombinedDataforTrendlineTwoDevices({ device1: 'disposable autoinjectors', device2: 'Disposable pens' }, 'val');


 beginningAndEndingValuesPfsAndDpVol = generateCombinedDataforTrendlineTwoDevices({ device1: 'PFS', device2: 'Disposable pens' }, 'vol');
 beginningAndEndingValuesPfsAndDpVal = generateCombinedDataforTrendlineTwoDevices({ device1: 'PFS', device2: 'Disposable pens' }, 'val');


 beginningAndEndingValuesThreeDevicesVol = generateCombinedDataForTrendlineThreeDevices({device1: 'PFS', device2: 'disposable autoinjectors', device3: 'Disposable pens'}, 'vol');
 beginningAndEndingValuesThreeDevicesVal = generateCombinedDataForTrendlineThreeDevices({device1: 'PFS', device2: 'disposable autoinjectors', device3: 'Disposable pens'}, 'val');


}


findCombinedBeginningAndEndingValuesforCAGR();




function callGenerateGraphDataAndPutDataInArray(metric, colours, molecule) {
let graphDataArray = [];
// console.log(molecule);


if(metric == "Vol") {
const graphDataPfsYear1 = sourceGraphData(metric, 'PFS', '2021', pfsAaa, pfsEurope, pfsLatinAmerica, pfsNorthAmerica, colours.colour0, 0, false, molecule);
// console.log(graphDataPfsYear1);
const graphDataDaijYear1 = sourceGraphData(metric, 'AI', '2021', daijAaa, daijEurope, daijLatinAmerica, daijNorthAmerica, colours.colour1, 0, true, molecule);
const graphDataDpYear1 = sourceGraphData(metric, 'DP', '2021', dpAaa, dpEurope, dpLatinAmerica, dpNorthAmerica, colours.colour2, 0, true, molecule);
const graphDataPfsYear2 = sourceGraphData(metric, 'PFS', '2022', pfsAaa, pfsEurope, pfsLatinAmerica, pfsNorthAmerica, colours.colour3, 1, false, molecule);
const graphDataDaijYear2 = sourceGraphData(metric, 'AI', '2022', daijAaa, daijEurope, daijLatinAmerica, daijNorthAmerica, colours.colour4, 1, true, molecule);
const graphDataDpYear2 = sourceGraphData(metric, 'DP', '2022', dpAaa, dpEurope, dpLatinAmerica, dpNorthAmerica, colours.colour5, 1, true, molecule);
const graphDataPfsYear3 = sourceGraphData(metric, 'PFS', '2023', pfsAaa, pfsEurope, pfsLatinAmerica, pfsNorthAmerica, colours.colour6, 2, false, molecule);
const graphDataDaijYear3 = sourceGraphData(metric, 'AI', '2023', daijAaa, daijEurope, daijLatinAmerica, daijNorthAmerica, colours.colour7, 2, true, molecule);
const graphDataDpYear3 = sourceGraphData(metric, 'DP', '2023', dpAaa, dpEurope, dpLatinAmerica, dpNorthAmerica, colours.colour8, 2, true, molecule);
graphDataArray.push
(
 graphDataPfsYear1,
 graphDataDaijYear1,
 graphDataDpYear1,
 graphDataPfsYear2,
 graphDataDaijYear2,
 graphDataDpYear2,
 graphDataPfsYear3,
 graphDataDaijYear3,
 graphDataDpYear3,


)
} else {
const graphDataPfsYear1 = sourceGraphData(metric, 'PFS', '2021', pfsAaa, pfsEurope, pfsLatinAmerica, pfsNorthAmerica, colours.colour0, 0, false, molecule);
const graphDataDaijYear1 = sourceGraphData(metric, 'AI', '2021', daijAaa, daijEurope, daijLatinAmerica, daijNorthAmerica, colours.colour1, 0, true, molecule);
const graphDataDpYear1 = sourceGraphData(metric, 'DP', '2021', dpAaa, dpEurope, dpLatinAmerica, dpNorthAmerica, colours.colour2, 0, true, molecule);
const graphDataPfsYear2 = sourceGraphData(metric, 'PFS', '2022', pfsAaa, pfsEurope, pfsLatinAmerica, pfsNorthAmerica, colours.colour3, 1, false, molecule);
const graphDataDaijYear2 = sourceGraphData(metric, 'AI', '2022', daijAaa, daijEurope, daijLatinAmerica, daijNorthAmerica, colours.colour4, 1, true, molecule);
const graphDataDpYear2 = sourceGraphData(metric, 'DP', '2022', dpAaa, dpEurope, dpLatinAmerica, dpNorthAmerica, colours.colour5, 1, true, molecule);
graphDataArray.push
(
 graphDataPfsYear1,
 graphDataDaijYear1,
 graphDataDpYear1,
 graphDataPfsYear2,
 graphDataDaijYear2,
 graphDataDpYear2,
)
}


return graphDataArray;
}


//Creating vol graph data
const graphDataVol = callGenerateGraphDataAndPutDataInArray("Vol", colours, molecule);
const volGraphDataset = createGraphDataset(graphDataVol, 'Vol');
// console.log(volGraphDataset);


 //Creating val graph data
const graphDataVal = callGenerateGraphDataAndPutDataInArray("Val", colours, molecule);
const valGraphDataset = createGraphDataset(graphDataVal, 'Val');


//Creating asp graph data
const graphDataAsp = callGenerateGraphDataAndPutDataInArray("Asp", colours, molecule);
const aspGraphDataset = createGraphDataset(graphDataAsp, 'Asp');


    /////GRAPHS SECTION ////////////


   //This sets the graph floating bubbles above the bars
   const tooltip = {
     yAlign: 'bottom',
   };


   //This sets the default font size for all the graphs
   Chart.defaults.font.size = 16;


   //This registers the use of the watermark plugin found in chartjs-plugin
  //  Chart.register(waterMarkPlugin);


   //This registers the Chart Datalabels plugin - Datalabels are not currently showing - on purpose)
   // Chart.register(ChartDataLabels);


   Chart.defaults.set('plugins.datalabels', {
     color: '#000000',
     font: {
       weight: '400',
       size: 13,
     }
   });


   //This registers the Trendline plugin
   Chart.register(chartTrendline);


   //This registers the annotations plugin
   Chart.register(annotationPlugin);




   ////GRAPH CREATION - GRAPH 1 - VOL ///////////////////




   const configVol = {
     type: 'bar',
     data: volGraphDataset,
     options: {
       plugins: {


         legend: {
           display: false,
         },
         tooltip,
         autocolors: false,
       },
       responsive: false,
       interaction: {
         intersect: false,
       },
       scales: {
         y: {
           title: {
             display: true,
             text: 'Millions',
           }
         }


       },




     }
   }


   if (volume) volume.destroy();
   volume = new Chart(
     document.getElementById('graph1'),
     configVol
   );


   showLegend(volume, 'Pfs', { colour1: 0, colour2: 0, colour3: 3, colour4: 3, colour5: 6, colour6: 6 });




  
   inputStaticColoursIntoLegend(volume);


   //All colour changes are generated dynamically - please see legend.js




   //////GRAPH CREATION - GRAPH 2 - VAL ///////////////////


  


   configVal = {
     type: 'bar',
     data: valGraphDataset,
     options: {
       plugins: {
         tooltip,
         legend: {
           display: false,
         }
       },
       responsive: false,
       interaction: {
         intersect: false,
       },
       scales: {
         y: {
           title: {
             display: true,
             text: 'Billions',
           },
         }
       }
     }
   };


   //TEST - this is how to change the axis to Millions on the fly


  


   if (value) value.destroy();
   value = new Chart(
     document.getElementById('graph2'),
     configVal
   )


   //////GRAPH CREATION - GRAPH 3 - ASP ///////////////////
   const configAsp = {
     type: 'bar',
     data: aspGraphDataset,
     options: {
       plugins: {
         tooltip,
         legend: {
           display: false,
         }
       },
       responsive: false,
       interaction: {
         intersect: false,
       },
       scales: {
         y: {
           title: {
             display: true,
             text: 'Hundreds',
           },
         }
       }
     }
   };




   if (asp) asp.destroy();
   asp = new Chart(
     document.getElementById('graph3'),
     configAsp
   );
   showCorrectDataAndHighlightCorrectButtons(data, volume, value, asp);
   // Enable the dropdown now the data has finished loading.
   moleculeSelector.disabled = false;
  
 });
 }




function showCorrectDataAndHighlightCorrectButtons(data, volume, value, asp) {
 let metric;
 const pfs = data.containers.find(c => c.primaryContainer === "PFS") ? data.containers.find(c => c.primaryContainer === "PFS") : 0;
 const daij = data.containers.find(c => c.primaryContainer === "disposable autoinjectors") ? data.containers.find(c => c.primaryContainer === "disposable autoinjectors") : 0;
 const dp = data.containers.find(c => c.primaryContainer === "Disposable pens") ? data.containers.find(c => c.primaryContainer === "Disposable pens") : 0;


 if((!pfs == 0) && (!daij == 0) && (!dp == 0)) {
   pfsButton.classList.add('clicked-red');
   daijButton.classList.add('clicked-red');
   dpButton.classList.add('clicked-red');
   //volume datasets -
   volume.data.datasets[0].hidden = false;
   volume.data.datasets[3].hidden = false;
   volume.data.datasets[6].hidden = false;
   //value datasets
   value.data.datasets[0].hidden = false;
   value.data.datasets[3].hidden = false;
  
   //asp datasets
   asp.data.datasets[0].hidden = false;
   asp.data.datasets[3].hidden = false;
  
  
   //DAIJ


   //volume datasets
   volume.data.datasets[1].hidden = false;
   volume.data.datasets[4].hidden = false;
   volume.data.datasets[7].hidden = false;
   //value datasets
   value.data.datasets[1].hidden = false;
   value.data.datasets[4].hidden = false;
   //asp datasets
   asp.data.datasets[1].hidden = false;
   asp.data.datasets[4].hidden = false;


   //DP
   volume.data.datasets[2].hidden = false;
   volume.data.datasets[5].hidden = false;
   volume.data.datasets[8].hidden = false;
   //value datasets
   value.data.datasets[2].hidden = false;
   value.data.datasets[5].hidden = false;
  
   //asp datasets
   asp.data.datasets[2].hidden = false;
   asp.data.datasets[5].hidden = false;


   if (!graphContainer3.classList.contains('hidden')){
     graphContainer3.classList.add('hidden');
   }


   if (!aspTitle.classList.contains('hidden')) {
     aspTitle.classList.add('hidden')
   }
  
   //Here - need legend with 3 colours
   showLegend(volume, 'allThreeDevices', { colour1: 0, colour2: 1, colour3: 3, colour4: 4, colour5: 6, colour6: 7 });
   metric = "volume";
  showAnnotations(volume, metric, beginningAndEndingValuesThreeDevicesVol[0], beginningAndEndingValuesThreeDevicesVol[2][0], beginningAndEndingValuesThreeDevicesVol[2][1], beginningAndEndingValuesThreeDevicesVol[1]);
   metric = "value";
  showAnnotations(value, metric, beginningAndEndingValuesThreeDevicesVal[0], beginningAndEndingValuesThreeDevicesVal[2][0], beginningAndEndingValuesThreeDevicesVal[2][1], beginningAndEndingValuesThreeDevicesVal[1]);
   volume.update();
   value.update();
   asp.update();


 } else if ((pfs == 0) && (daij == 0)) {
   pfsButton.disabled = true;
   daijButton.disabled = true;
   dpButton.classList.add('clicked-red');
   showLegend(volume, 'Dp', { colour1: 2, colour2: 2, colour3: 5, colour4: 5, colour5: 8, colour6: 8 });
   metric = "volume";
  showAnnotations(volume, metric, beginningAndEndingValuesDpVol[0], beginningAndEndingValuesDpVol[2][0], beginningAndEndingValuesDpVol[2][1], beginningAndEndingValuesDpVol[1]);
   metric = "value";
  showAnnotations(value, metric, beginningAndEndingValuesDpVal[0], beginningAndEndingValuesDpVal[2][0], beginningAndEndingValuesDpVal[2][1], beginningAndEndingValuesDpVal[1]);
   metric = "asp";
  showAnnotations(asp, metric, beginningAndEndingValuesDpAsp[0], beginningAndEndingValuesDpAsp[2][0], beginningAndEndingValuesDpAsp[2][1], beginningAndEndingValuesDpAsp[1]);
   //pfs
   //volume datasets -
   volume.data.datasets[0].hidden = true;
   volume.data.datasets[3].hidden = true;
   volume.data.datasets[6].hidden = true;
   //value datasets
   value.data.datasets[0].hidden = true;
   value.data.datasets[3].hidden = true;
  
   //asp datasets
   asp.data.datasets[0].hidden = true;
   asp.data.datasets[3].hidden = true;
  
  
   //DAIJ


   //volume datasets
   volume.data.datasets[1].hidden = true;
   volume.data.datasets[4].hidden = true;
   volume.data.datasets[7].hidden = true;
   //value datasets
   value.data.datasets[1].hidden = true;
   value.data.datasets[4].hidden = true;
   //asp datasets
   asp.data.datasets[1].hidden = true;
   asp.data.datasets[4].hidden = true;


   //DP
   volume.data.datasets[2].hidden = false;
   volume.data.datasets[5].hidden = false;
   volume.data.datasets[8].hidden = false;
   //value datasets
   value.data.datasets[2].hidden = false;
   value.data.datasets[5].hidden = false;
  
   //asp datasets
   asp.data.datasets[2].hidden = false;
   asp.data.datasets[5].hidden = false;
  
   graphContainer3.classList.remove('hidden');
   aspTitle.classList.remove('hidden');
   volume.update();
   value.update();
   asp.update();


 } else if ((pfs == 0) && (dp == 0)) {
   pfsButton.disabled = true;
   dpButton.disabled = true;
   daijButton.classList.add('clicked-red');
   showLegend(volume, 'Daij', { colour1: 1, colour2: 1, colour3: 4, colour4: 4, colour5: 7, colour6: 7 });
   metric = "volume";
  showAnnotations(volume, metric, beginningAndEndingValuesDaijVol[0], beginningAndEndingValuesDaijVol[2][0], beginningAndEndingValuesDaijVol[2][1], beginningAndEndingValuesDaijVol[1]);
   metric = "value";
   // // // // Daij - Value - Trendline
  showAnnotations(value, metric, beginningAndEndingValuesDaijVal[0], beginningAndEndingValuesDaijVal[2][0], beginningAndEndingValuesDaijVal[2][1], beginningAndEndingValuesDaijVal[1]);


   // // // // Daij - Asp - Trendline
   metric = "asp";
  showAnnotations(asp, metric, beginningAndEndingValuesDaijAsp[0], beginningAndEndingValuesDaijAsp[2][0], beginningAndEndingValuesDaijAsp[2][1], beginningAndEndingValuesDaijAsp[1]);


   //pfs
   //volume datasets -
   volume.data.datasets[0].hidden = true;
   volume.data.datasets[3].hidden = true;
   volume.data.datasets[6].hidden = true;
   //value datasets
   value.data.datasets[0].hidden = true;
   value.data.datasets[3].hidden = true;
  
   //asp datasets
   asp.data.datasets[0].hidden = true;
   asp.data.datasets[3].hidden = true;
  
  
   //DAIJ


   //volume datasets
   volume.data.datasets[1].hidden = false;
   volume.data.datasets[4].hidden = false;
   volume.data.datasets[7].hidden = false;
   //value datasets
   value.data.datasets[1].hidden = false;
   value.data.datasets[4].hidden = false;
   //asp datasets
   asp.data.datasets[1].hidden = false;
   asp.data.datasets[4].hidden = false;


   //DP
   volume.data.datasets[2].hidden = true;
   volume.data.datasets[5].hidden = true;
   volume.data.datasets[8].hidden = true;
   //value datasets
   value.data.datasets[2].hidden = true;
   value.data.datasets[5].hidden = true;
  
   //asp datasets
   asp.data.datasets[2].hidden = true;
   asp.data.datasets[5].hidden = true;
  
   graphContainer3.classList.remove('hidden');
   aspTitle.classList.remove('hidden');
   volume.update();
   value.update();
   asp.update();


 } else if ((daij == 0) && (dp == 0)) {
   daijButton.disabled = true;
   dpButton.disabled = true;
   pfsButton.classList.add('clicked-red');
   showLegend(volume, 'Pfs', { colour1: 0, colour2: 0, colour3: 3, colour4: 3, colour5: 6, colour6: 6 });
   metric = "volume";
  showAnnotations(volume, metric, beginningAndEndingValuesPfsVol[0], beginningAndEndingValuesPfsVol[2][0], beginningAndEndingValuesPfsVol[2][1], beginningAndEndingValuesPfsVol[1]);
   metric = "value";
  showAnnotations(value, metric, beginningAndEndingValuesPfsVal[0], beginningAndEndingValuesPfsVal[2][0], beginningAndEndingValuesPfsVal[2][1], beginningAndEndingValuesPfsVal[1]);
   metric = "asp";
  showAnnotations(asp, metric, beginningAndEndingValuesPfsAsp[0], beginningAndEndingValuesPfsAsp[2][0], beginningAndEndingValuesPfsAsp[2][1], beginningAndEndingValuesPfsAsp[1]);
  
  
   //pfs
   //volume datasets -
   volume.data.datasets[0].hidden = false;
   volume.data.datasets[3].hidden = false;
   volume.data.datasets[6].hidden = false;
   //value datasets
   value.data.datasets[0].hidden = false;
   value.data.datasets[3].hidden = false;
  
   //asp datasets
   asp.data.datasets[0].hidden = false;
   asp.data.datasets[3].hidden = false;
  
  
   //DAIJ


   //volume datasets
   volume.data.datasets[1].hidden = true;
   volume.data.datasets[4].hidden = true;
   volume.data.datasets[7].hidden = true;
   //value datasets
   value.data.datasets[1].hidden = true;
   value.data.datasets[4].hidden = true;
   //asp datasets
   asp.data.datasets[1].hidden = true;
   asp.data.datasets[4].hidden = true;


   //DP
   volume.data.datasets[2].hidden = true;
   volume.data.datasets[5].hidden = true;
   volume.data.datasets[8].hidden = true;
   //value datasets
   value.data.datasets[2].hidden = true;
   value.data.datasets[5].hidden = true;
  
   //asp datasets
   asp.data.datasets[2].hidden = true;
   asp.data.datasets[5].hidden = true;
  
   graphContainer3.classList.remove('hidden');
   aspTitle.classList.remove('hidden');
   volume.update();
   value.update();
   asp.update();


 } else if (pfs == 0) {
   pfsButton.disabled = true;
   daijButton.classList.add('clicked-red');
   dpButton.classList.add('clicked-red');
   showLegend(volume, 'daijAndDp', { colour1: 1, colour2: 2, colour3: 4, colour4: 5, colour5: 7, colour6: 8 });
   metric = "volume";
  showAnnotations(volume, metric, beginningAndEndingValuesDaijAndDpVol[0], beginningAndEndingValuesDaijAndDpVol[2][0], beginningAndEndingValuesDaijAndDpVol[2][1], beginningAndEndingValuesDaijAndDpVol[1]);
   metric = "value";
  showAnnotations(value, metric, beginningAndEndingValuesDaijAndDpVal[0], beginningAndEndingValuesDaijAndDpVal[2][0], beginningAndEndingValuesDaijAndDpVal[2][1], beginningAndEndingValuesDaijAndDpVal[1]);
//pfs
   //volume datasets -
   volume.data.datasets[0].hidden = true;
   volume.data.datasets[3].hidden = true;
   volume.data.datasets[6].hidden = true;
   //value datasets
   value.data.datasets[0].hidden = true;
   value.data.datasets[3].hidden = true;
  
   //asp datasets
   asp.data.datasets[0].hidden = true;
   asp.data.datasets[3].hidden = true;
  
  
   //DAIJ


   //volume datasets
   volume.data.datasets[1].hidden = false;
   volume.data.datasets[4].hidden = false;
   volume.data.datasets[7].hidden = false;
   //value datasets
   value.data.datasets[1].hidden = false;
   value.data.datasets[4].hidden = false;
   //asp datasets
   asp.data.datasets[1].hidden = false;
   asp.data.datasets[4].hidden = false;


   //DP
   volume.data.datasets[2].hidden = false;
   volume.data.datasets[5].hidden = false;
   volume.data.datasets[8].hidden = false;
   //value datasets
   value.data.datasets[2].hidden = false;
   value.data.datasets[5].hidden = false;
  
   //asp datasets
   asp.data.datasets[2].hidden = false;
   asp.data.datasets[5].hidden = false;
  
   if (!graphContainer3.classList.contains('hidden')){
     graphContainer3.classList.add('hidden');
   }


   if (!aspTitle.classList.contains('hidden')) {
     aspTitle.classList.add('hidden')
   }


   volume.update();
   value.update();
   asp.update();
 } else if (daij == 0) {
   daijButton.disabled = true;
   pfsButton.classList.add('clicked-red');
   dpButton.classList.add('clicked-red');
   //Legend - pfs n dp selected
   showLegend(volume, 'pfsAndDp', { colour1: 0, colour2: 2, colour3: 3, colour4: 5, colour5: 6, colour6: 8 });
   metric = "volume";
  showAnnotations(volume, metric, beginningAndEndingValuesPfsAndDpVol[0], beginningAndEndingValuesPfsAndDpVol[2][0], beginningAndEndingValuesPfsAndDpVol[2][1], beginningAndEndingValuesPfsAndDpVol[1]);
   metric = "value";
  showAnnotations(value, metric, beginningAndEndingValuesPfsAndDpVal[0], beginningAndEndingValuesPfsAndDpVal[2][0], beginningAndEndingValuesPfsAndDpVal[2][1], beginningAndEndingValuesPfsAndDpVal[1]);
   //pfs
   //volume datasets -
   volume.data.datasets[0].hidden = false;
   volume.data.datasets[3].hidden = false;
   volume.data.datasets[6].hidden = false;
   //value datasets
   value.data.datasets[0].hidden = false;
   value.data.datasets[3].hidden = false;
  
   //asp datasets
   asp.data.datasets[0].hidden = false;
   asp.data.datasets[3].hidden = false;
  
  
   //DAIJ


   //volume datasets
   volume.data.datasets[1].hidden = true;
   volume.data.datasets[4].hidden = true;
   volume.data.datasets[7].hidden = true;
   //value datasets
   value.data.datasets[1].hidden = true;
   value.data.datasets[4].hidden = true;
   //asp datasets
   asp.data.datasets[1].hidden = true;
   asp.data.datasets[4].hidden = true;


   //DP
   volume.data.datasets[2].hidden = false;
   volume.data.datasets[5].hidden = false;
   volume.data.datasets[8].hidden = false;
   //value datasets
   value.data.datasets[2].hidden = false;
   value.data.datasets[5].hidden = false;
  
   //asp datasets
   asp.data.datasets[2].hidden = false;
   asp.data.datasets[5].hidden = false;
  
   if (!graphContainer3.classList.contains('hidden')){
     graphContainer3.classList.add('hidden');
   }


   if (!aspTitle.classList.contains('hidden')) {
     aspTitle.classList.add('hidden')
   }


   volume.update();
   value.update();
   asp.update();


 } else if (dp == 0) {
   dpButton.disabled = true;
   pfsButton.classList.add('clicked-red');
   daijButton.classList.add('clicked-red');
   showLegend(volume, 'pfsAndDaij', { colour1: 0, colour2: 1, colour3: 3, colour4: 4, colour5: 6, colour6: 7 });
   metric = "volume";
  showAnnotations(volume, metric, beginningAndEndingValuesPfsAndDaijVol[0], beginningAndEndingValuesPfsAndDaijVol[2][0], beginningAndEndingValuesPfsAndDaijVol[2][1], beginningAndEndingValuesPfsAndDaijVol[1]);
   metric = "value";
  showAnnotations(value, metric, beginningAndEndingValuesPfsAndDaijVal[0], beginningAndEndingValuesPfsAndDaijVal[2][0], beginningAndEndingValuesPfsAndDaijVal[2][1], beginningAndEndingValuesPfsAndDaijVal[1]);
   //pfs
   //volume datasets -
   volume.data.datasets[0].hidden = false;
   volume.data.datasets[3].hidden = false;
   volume.data.datasets[6].hidden = false;
   //value datasets
   value.data.datasets[0].hidden = false;
   value.data.datasets[3].hidden = false;
  
   //asp datasets
   asp.data.datasets[0].hidden = false;
   asp.data.datasets[3].hidden = false;
  
  
   //DAIJ


   //volume datasets
   volume.data.datasets[1].hidden = false;
   volume.data.datasets[4].hidden = false;
   volume.data.datasets[7].hidden = false;
   //value datasets
   value.data.datasets[1].hidden = false;
   value.data.datasets[4].hidden = false;
   //asp datasets
   asp.data.datasets[1].hidden = false;
   asp.data.datasets[4].hidden = false;


   //DP
   volume.data.datasets[2].hidden = true;
   volume.data.datasets[5].hidden = true;
   volume.data.datasets[8].hidden = true;
   //value datasets
   value.data.datasets[2].hidden = true;
   value.data.datasets[5].hidden = true;
  
   //asp datasets
   asp.data.datasets[2].hidden = true;
   asp.data.datasets[5].hidden = true;
  
   if (!graphContainer3.classList.contains('hidden')){
     graphContainer3.classList.add('hidden');
   }


   if (!aspTitle.classList.contains('hidden')) {
     aspTitle.classList.add('hidden')
   }


   volume.update();
   value.update();
   asp.update();
 }
}


 function deviceButtonClick(e, volume, value, asp) {
 console.log('I am deviceButtonClick and I have run!');
 configVal.options.scales.y.title.text = 'Billions';
 let metric;
 const pfsButton = document.querySelector('.prefilled-syringe');
 const daijButton = document.querySelector('.disposable-autoinjector');
 const dpButton = document.querySelector('.disposable-pen');
 const prodRecsButton = document.querySelector('.product-recommendations');
 const graphContainer1 = document.querySelector('.graph-container1');
 const graphContainer2 = document.querySelector('.graph-container2');
 const graphContainer3 = document.querySelector('.graph-container3');
 const aspTitle = document.querySelector('.graph-title3');
 // Checking if prod recs clicked - and disabling both buttons if so
 if (prodRecsButton.classList.contains('clicked-purple')) {
   return;
 }


 //Hiding chart cards
 const getChartCards = document.querySelectorAll('.chart-card');
 getChartCards.forEach(item => item.classList.add('hidden'));


 if (e.currentTarget.classList.contains('clicked-red')) {
   e.currentTarget.classList.remove('clicked-red');
 } else {
   e.currentTarget.classList.add('clicked-red');
 }
//////////////////////////////
 // Combinations -
 //Combination 1
 // Pfs clicked on
 //and daij on
 //and dp on


 if (pfsButton.classList.contains('clicked-red') && daijButton.classList.contains('clicked-red') && dpButton.classList.contains('clicked-red')) {
   graphContainer3.classList.add('hidden');
   aspTitle.classList.add('hidden');
   showLegend(volume, 'allThreeDevices', { colour1: 0, colour2: 2, colour3: 3, colour4: 5, colour5: 6, colour6: 8 });
  
   metric = "volume";
  showAnnotations(volume, metric, beginningAndEndingValuesThreeDevicesVol[0], beginningAndEndingValuesThreeDevicesVol[2][0], beginningAndEndingValuesThreeDevicesVol[2][1], beginningAndEndingValuesThreeDevicesVol[1]);
   metric = "value";
  showAnnotations(value, metric, beginningAndEndingValuesThreeDevicesVal[0], beginningAndEndingValuesThreeDevicesVal[2][0], beginningAndEndingValuesThreeDevicesVal[2][1], beginningAndEndingValuesThreeDevicesVal[1]);
   console.log('Combination 1');
   // PFS
   //
   //volume datasets -
   volume.data.datasets[0].hidden = false;
   volume.data.datasets[3].hidden = false;
   volume.data.datasets[6].hidden = false;
   //value datasets
   value.data.datasets[0].hidden = false;
   value.data.datasets[3].hidden = false;
   //asp datasets
   asp.data.datasets[0].hidden = false;
   asp.data.datasets[3].hidden = false;
  
   //DAIJ


   //volume datasets
   volume.data.datasets[1].hidden = false;
   volume.data.datasets[4].hidden = false;
   volume.data.datasets[7].hidden = false;
   //value datasets
   value.data.datasets[1].hidden = false;
   value.data.datasets[4].hidden = false;
   //asp datasets
   asp.data.datasets[1].hidden = false;
   asp.data.datasets[4].hidden = false;


   //DP
   volume.data.datasets[2].hidden = false;
   volume.data.datasets[5].hidden = false;
   volume.data.datasets[8].hidden = false;
   //value datasets
   value.data.datasets[2].hidden = false;
   value.data.datasets[5].hidden = false;
   //asp datasets
   asp.data.datasets[2].hidden = false;
   asp.data.datasets[5].hidden = false;


   graphContainer2.classList.remove('hidden');
   graphContainer1.classList.remove('hidden');
   volume.update();
   value.update();
   asp.update();


 }
////////////////////////////////////////////
 //Combination 2
 //pfs on
 //daij on
 //dp off
 else if (pfsButton.classList.contains('clicked-red') && daijButton.classList.contains('clicked-red') && !dpButton.classList.contains('clicked-red')) {
   if (!graphContainer3.classList.contains('hidden')){
     graphContainer3.classList.add('hidden');
   }


   if (!aspTitle.classList.contains('hidden')) {
     aspTitle.classList.add('hidden')
   }


   showLegend(volume, 'pfsAndDaij', { colour1: 0, colour2: 1, colour3: 3, colour4: 4, colour5: 6, colour6: 7 });


   // PFS
   //
   //volume datasets -
   volume.data.datasets[0].hidden = false;
   volume.data.datasets[3].hidden = false;
   volume.data.datasets[5].hidden = false;
   //value datasets
   value.data.datasets[0].hidden = false;
   value.data.datasets[3].hidden = false;
   //asp datasets
   asp.data.datasets[0].hidden = false;
   asp.data.datasets[3].hidden = false;
  
   //DAIJ


   //volume datasets
   volume.data.datasets[1].hidden = false;
   volume.data.datasets[4].hidden = false;
   volume.data.datasets[7].hidden = false;
   //value datasets
   value.data.datasets[1].hidden = false;
   value.data.datasets[4].hidden = false;
   //asp datasets
   asp.data.datasets[1].hidden = false;
   asp.data.datasets[4].hidden = false;


   //DP
   volume.data.datasets[2].hidden = true;
   volume.data.datasets[5].hidden = true;
   volume.data.datasets[8].hidden = true;
   //value datasets
   value.data.datasets[2].hidden = true;
   value.data.datasets[5].hidden = true;
   //asp datasets
   asp.data.datasets[2].hidden = true;
   asp.data.datasets[5].hidden = true;
  
   //Show annotations - Combined
   metric = "volume";
  showAnnotations(volume, metric, beginningAndEndingValuesPfsAndDaijVol[0], beginningAndEndingValuesPfsAndDaijVol[2][0], beginningAndEndingValuesPfsAndDaijVol[2][1], beginningAndEndingValuesPfsAndDaijVol[1]);
   metric = "value";
  showAnnotations(value, metric, beginningAndEndingValuesPfsAndDaijVal[0], beginningAndEndingValuesPfsAndDaijVal[2][0], beginningAndEndingValuesPfsAndDaijVal[2][1], beginningAndEndingValuesPfsAndDaijVal[1]);
   console.log('Combination 2');


   graphContainer2.classList.remove('hidden');
   graphContainer1.classList.remove('hidden');
   volume.update();
   value.update();
   asp.update();
 }
   ////////
   //Combination 3
   //pfs off
   //daij on
   //dp on
   else if (!pfsButton.classList.contains('clicked-red') && daijButton.classList.contains('clicked-red') && dpButton.classList.contains('clicked-red'))
   {
     if (!graphContainer3.classList.contains('hidden')){
       graphContainer3.classList.add('hidden');
     }
      if (!aspTitle.classList.contains('hidden')) {
       aspTitle.classList.add('hidden')
     }
     showLegend(volume, 'daijAndDp', { colour1: 1, colour2: 2, colour3: 4, colour4: 5, colour5: 7, colour6: 8 });


   // PFS
   //
   //volume datasets -
   volume.data.datasets[0].hidden = true;
   volume.data.datasets[3].hidden = true;
   volume.data.datasets[6].hidden = true;
   //value datasets
   value.data.datasets[0].hidden = true;
   value.data.datasets[3].hidden = true;
  
   //asp datasets
   asp.data.datasets[0].hidden = true;
   asp.data.datasets[3].hidden = true;
  
  
   //DAIJ


   //volume datasets
   volume.data.datasets[1].hidden = false;
   volume.data.datasets[4].hidden = false;
   volume.data.datasets[7].hidden = false;
   //value datasets
   value.data.datasets[1].hidden = false;
   value.data.datasets[4].hidden = false;
  
   //asp datasets
   asp.data.datasets[1].hidden = false;
   asp.data.datasets[4].hidden = false;
  


   //DP
   volume.data.datasets[2].hidden = false;
   volume.data.datasets[5].hidden = false;
   volume.data.datasets[8].hidden = false;
   //value datasets
   value.data.datasets[2].hidden = false;
   value.data.datasets[5].hidden = false;
   //asp datasets
   asp.data.datasets[2].hidden = false;
   asp.data.datasets[5].hidden = false;
  
   //Show annotations - Combined
   metric = "volume";
  showAnnotations(volume, metric, beginningAndEndingValuesDaijAndDpVol[0], beginningAndEndingValuesDaijAndDpVol[2][0], beginningAndEndingValuesDaijAndDpVol[2][1], beginningAndEndingValuesDaijAndDpVol[1]);
   metric = "value";
  showAnnotations(value, metric, beginningAndEndingValuesDaijAndDpVal[0], beginningAndEndingValuesDaijAndDpVal[2][0], beginningAndEndingValuesDaijAndDpVal[2][1], beginningAndEndingValuesDaijAndDpVal[1]);
   console.log('Combination 3');


   graphContainer2.classList.remove('hidden');
   graphContainer1.classList.remove('hidden');
   volume.update();
   value.update();
   asp.update();
   }


   ////////
   //Combination 4
   //pfs on
   //daij off
   //dp on
    else if (pfsButton.classList.contains('clicked-red') && !daijButton.classList.contains('clicked-red') && dpButton.classList.contains('clicked-red')) {
     if (!graphContainer3.classList.contains('hidden')){
       graphContainer3.classList.add('hidden');
     }
      if (!aspTitle.classList.contains('hidden')) {
       aspTitle.classList.add('hidden')
     }
     showLegend(volume, 'pfsAndDp', { colour1: 0, colour2: 2, colour3: 3, colour4: 5, colour5: 6, colour6: 8 });
     console.log('Combination 4');


   // PFS
   //
   //volume datasets -
   volume.data.datasets[0].hidden = false;
   volume.data.datasets[3].hidden = false;
   volume.data.datasets[6].hidden = false;
   //value datasets
   value.data.datasets[0].hidden = false;
   value.data.datasets[3].hidden = false;
  
   //asp datasets
   asp.data.datasets[0].hidden = false;
   asp.data.datasets[3].hidden = false;
  
  
   //DAIJ


   //volume datasets
   volume.data.datasets[1].hidden = true;
   volume.data.datasets[4].hidden = true;
   volume.data.datasets[7].hidden = true;
   //value datasets
   value.data.datasets[1].hidden = true;
   value.data.datasets[4].hidden = true;
  
   //asp datasets
   asp.data.datasets[1].hidden = true;
   asp.data.datasets[4].hidden = true;
  


   //DP
   volume.data.datasets[2].hidden = false;
   volume.data.datasets[5].hidden = false;
   volume.data.datasets[8].hidden = false;
   //value datasets
   value.data.datasets[2].hidden = false;
   value.data.datasets[5].hidden = false;
   //asp datasets
   asp.data.datasets[2].hidden = false;
   asp.data.datasets[5].hidden = false;
  
   //Show annotations - Combined
   metric = "volume";
  showAnnotations(volume, metric, beginningAndEndingValuesPfsAndDpVol[0], beginningAndEndingValuesPfsAndDpVol[2][0], beginningAndEndingValuesPfsAndDpVol[2][1], beginningAndEndingValuesPfsAndDpVol[1]);
   metric = "value";
  showAnnotations(value, metric, beginningAndEndingValuesPfsAndDpVal[0], beginningAndEndingValuesPfsAndDpVal[2][0], beginningAndEndingValuesPfsAndDpVal[2][1], beginningAndEndingValuesPfsAndDpVal[1]);


   graphContainer2.classList.remove('hidden');
   graphContainer1.classList.remove('hidden');
   volume.update();
   value.update();
   asp.update();


   }
   ////////////////////
   //Combination 5
   // pfs on
   //daij off
   //dp off


 else if (pfsButton.classList.contains('clicked-red') && !daijButton.classList.contains('clicked-red') && !dpButton.classList.contains('clicked-red')) {
   // PFS SHOWING


   //HERE is where could call function to change dataset for val???
   const molecule = data.name;
   if(molecule === "INSULIN ASPART") {
     //We havent go access to the data here - so the dataset would need to be made elsewhere and then passed into here
     // console.log(configVal);
     configVal.options.scales.y.title.text = 'Millions';
     console.log(value.data.datasets[0]);
     console.log(value.data.datasets[3]);
   
   }




   //volume datasets
   volume.data.datasets[0].hidden = false;
   volume.data.datasets[3].hidden = false;
   volume.data.datasets[6].hidden = false;
   //value datasets
   value.data.datasets[0].hidden = false;
   value.data.datasets[3].hidden = false;
   //asp datasets
   asp.data.datasets[0].hidden = false;
   asp.data.datasets[3].hidden = false;


   // DAIJ HIDING


   // volume datasets
   volume.data.datasets[1].hidden = true;
   volume.data.datasets[4].hidden = true;
   volume.data.datasets[7].hidden = true;
   //value datasets
   value.data.datasets[1].hidden = true;
   value.data.datasets[4].hidden = true;
  
   //asp datasets
   asp.data.datasets[1].hidden = true;
   asp.data.datasets[4].hidden = true;


   //DP
   volume.data.datasets[2].hidden = true;
   volume.data.datasets[5].hidden = true;
   volume.data.datasets[8].hidden = true;
   //value datasets
   value.data.datasets[2].hidden = true;
   value.data.datasets[5].hidden = true;
  
   //asp datasets
   asp.data.datasets[2].hidden = true;
   asp.data.datasets[5].hidden = true;
 
  


   showLegend(volume, 'Pfs', { colour1: 0, colour2: 0, colour3: 3, colour4: 3, colour5: 6, colour6: 6 });
   //Show annotations - Pfs
   metric = "volume";
  showAnnotations(volume, metric, beginningAndEndingValuesPfsVol[0], beginningAndEndingValuesPfsVol[2][0], beginningAndEndingValuesPfsVol[2][1], beginningAndEndingValuesPfsVol[1]);
   metric = "value";
  showAnnotations(value, metric, beginningAndEndingValuesPfsVal[0], beginningAndEndingValuesPfsVal[2][0], beginningAndEndingValuesPfsVal[2][1], beginningAndEndingValuesPfsVal[1]);
   metric = "asp";
  showAnnotations(asp, metric, beginningAndEndingValuesPfsAsp[0], beginningAndEndingValuesPfsAsp[2][0], beginningAndEndingValuesPfsAsp[2][1], beginningAndEndingValuesPfsAsp[1]);
   console.log('Combination 5');


   volume.update();
   value.update();
   asp.update();


   graphContainer3.classList.remove('hidden');
   aspTitle.classList.remove('hidden');
   graphContainer2.classList.remove('hidden');
   graphContainer1.classList.remove('hidden');
 }


  //Combination 6
   // pfs off
   //daij on
   //dp off


  else if (!pfsButton.classList.contains('clicked-red') && daijButton.classList.contains('clicked-red') && !dpButton.classList.contains('clicked-red')) {
   //pfs
   // volume datasets
   volume.data.datasets[0].hidden = true;
   volume.data.datasets[3].hidden = true;
   volume.data.datasets[6].hidden = true;
   //value datasets
   value.data.datasets[0].hidden = true;
   value.data.datasets[3].hidden = true;
   //asp datasets
   asp.data.datasets[0].hidden = true;
   asp.data.datasets[3].hidden = true;


   // DAIJ showing
   // volume datasets
   volume.data.datasets[1].hidden = false;
   volume.data.datasets[4].hidden = false;
   volume.data.datasets[7].hidden = false;
   //value datasets
   value.data.datasets[1].hidden = false;
   value.data.datasets[4].hidden = false;
  
   //asp datasets
   asp.data.datasets[1].hidden = false;
   asp.data.datasets[4].hidden = false;


   //DP
   volume.data.datasets[2].hidden = true;
   volume.data.datasets[5].hidden = true;
   volume.data.datasets[8].hidden = true;
   //value datasets
   value.data.datasets[2].hidden = true;
   value.data.datasets[5].hidden = true;
  
   //asp datasets
   asp.data.datasets[2].hidden = true;
   asp.data.datasets[5].hidden = true;
 


   showLegend(volume, 'Daij', { colour1: 1, colour2: 1, colour3: 4, colour4: 4, colour5: 7, colour6: 7 });
   //Create daij annotations
   //Daij - Volume - Trendline
   metric = "volume";
  showAnnotations(volume, metric, beginningAndEndingValuesDaijVol[0], beginningAndEndingValuesDaijVol[2][0], beginningAndEndingValuesDaijVol[2][1], beginningAndEndingValuesDaijVol[1]);
   console.log('Combination 6');
   // // Daij - Value - Trendline
   metric = "value";
  showAnnotations(value, metric, beginningAndEndingValuesDaijVal[0], beginningAndEndingValuesDaijVal[2][0], beginningAndEndingValuesDaijVal[2][1], beginningAndEndingValuesDaijVal[1]);


   // // Daij - Asp - Trendline
   metric = "asp";
  showAnnotations(asp, metric, beginningAndEndingValuesDaijAsp[0], beginningAndEndingValuesDaijAsp[2][0], beginningAndEndingValuesDaijAsp[2][1], beginningAndEndingValuesDaijAsp[1]);


   volume.update();
   value.update();
   asp.update();


   graphContainer3.classList.remove('hidden');
   aspTitle.classList.remove('hidden');
   graphContainer2.classList.remove('hidden');
   graphContainer1.classList.remove('hidden');
 }


 //Combination 7
 //pfs off
 //daij off
 //dp on


 else if (!pfsButton.classList.contains('clicked-red') && !daijButton.classList.contains('clicked-red') && dpButton.classList.contains('clicked-red')) {
   showLegend(volume, 'Dp', { colour1: 2, colour2: 2, colour3: 5, colour4: 5, colour5: 8, colour6: 8 });
   metric = "volume";
  showAnnotations(volume, metric, beginningAndEndingValuesDpVol[0], beginningAndEndingValuesDpVol[2][0], beginningAndEndingValuesDpVol[2][1], beginningAndEndingValuesDpVol[1]);
   metric = "value";
  showAnnotations(value, metric, beginningAndEndingValuesDpVal[0], beginningAndEndingValuesDpVal[2][0], beginningAndEndingValuesDpVal[2][1], beginningAndEndingValuesDpVal[1]);
   metric = "asp";
  showAnnotations(asp, metric, beginningAndEndingValuesDpAsp[0], beginningAndEndingValuesDpAsp[2][0], beginningAndEndingValuesDpAsp[2][1], beginningAndEndingValuesDpAsp[1]);
   console.log('Combination 7');
   //PFS
   // volume datasets
   volume.data.datasets[0].hidden = true;
   volume.data.datasets[3].hidden = true;
   volume.data.datasets[6].hidden = true;
   //value datasets
   value.data.datasets[0].hidden = true;
   value.data.datasets[3].hidden = true;
  
   //asp datasets
   asp.data.datasets[0].hidden = true;
   asp.data.datasets[3].hidden = true;
  


   // DAIJ
   // volume datasets
   volume.data.datasets[1].hidden = true;
   volume.data.datasets[4].hidden = true;
   volume.data.datasets[7].hidden = true;
   //value datasets
   value.data.datasets[1].hidden = true;
   value.data.datasets[4].hidden = true;
  
   //asp datasets
   asp.data.datasets[1].hidden = true;
   asp.data.datasets[4].hidden = true;
  
   //DP
   volume.data.datasets[2].hidden = false;
   volume.data.datasets[5].hidden = false;
   volume.data.datasets[8].hidden = false;
   //value datasets
   value.data.datasets[2].hidden = false;
   value.data.datasets[5].hidden = false;
  
   //asp datasets
   asp.data.datasets[2].hidden = false;
   asp.data.datasets[5].hidden = false;


   volume.update();
   value.update();
   asp.update();


   graphContainer3.classList.remove('hidden');
   aspTitle.classList.remove('hidden');
   graphContainer2.classList.remove('hidden');
   graphContainer1.classList.remove('hidden');
  
 }


 //Combination 8
 //pfs off
 //daij off
 //dp off




 else if (!pfsButton.classList.contains('clicked-red') && !daijButton.classList.contains('clicked-red') && !dpButton.classList.contains('clicked-red')) {
   // PFS
   // volume datasets
   volume.data.datasets[0].hidden = true;
   volume.data.datasets[3].hidden = true;
   volume.data.datasets[6].hidden = true;
   //value datasets
   value.data.datasets[0].hidden = true;
   value.data.datasets[3].hidden = true;
   //asp datasets
   asp.data.datasets[0].hidden = true;
   asp.data.datasets[3].hidden = true;


   // DAIJ
   // volume datasets
   volume.data.datasets[1].hidden = true;
   volume.data.datasets[4].hidden = true;
   volume.data.datasets[7].hidden = true;
   //value datasets
   value.data.datasets[1].hidden = true;
   value.data.datasets[4].hidden = true;
  
   //asp datasets
   asp.data.datasets[1].hidden = true;
   asp.data.datasets[4].hidden = true;


   //DP
   volume.data.datasets[2].hidden = true;
   volume.data.datasets[5].hidden = true;
   volume.data.datasets[8].hidden = true;
   //value datasets
   value.data.datasets[2].hidden = true;
   value.data.datasets[5].hidden = true;
  
   //asp datasets
   asp.data.datasets[2].hidden = true;
   asp.data.datasets[5].hidden = true;
  


   hideLegend();
   console.log('Combination 8');
   //Hide all annotations
   hideAnnotations(volume);
   hideAnnotations(value);
   hideAnnotations(asp);
  
   volume.update();
   value.update();
   asp.update();


   graphContainer3.classList.remove('hidden');
   aspTitle.classList.remove('hidden');
   graphContainer2.classList.remove('hidden');
   graphContainer1.classList.remove('hidden');
 }


}




   function hideChart(e) {
     const clicked = e.currentTarget.dataset.value;
     if (clicked == 'vol-chart') {
       e.currentTarget.classList.add('hidden');
       graphContainer1.classList.remove('hidden');
     } else if (clicked == 'val-chart') {
       e.currentTarget.classList.add('hidden');
       graphContainer2.classList.remove('hidden');
     } else if (clicked == 'asp-chart') {
       e.currentTarget.classList.add('hidden');
       graphContainer3.classList.remove('hidden');
       aspTitle.classList.remove('hidden');


     }
   }


   function clickedProductRecsButton() {
     //Changing button to purple and changing image
     this.classList.add('clicked-purple');
     syringeImage.src = "./musicnote_white.png";
     function disableButtonsAndChangeCursor() {
     pfsButton.classList.remove('clicked-red');
     pfsButton.disabled = true;
     daijButton.classList.remove('clicked-red');
     daijButton.disbled = true;
     dpButton.classList.remove('clicked-red');
     dpButton.disabled = true;
      // moleculeSelector.disabled = true;
     // moleculeSelector.style.cursor = "auto";
     pfsButton.style.cursor = "auto";
     daijButton.style.cursor = "auto";
     dpButton.style.cursor = "auto";
     prodRecsButton.style.cursor = "auto";
     chartButton.style.cursor = "pointer";
    }
     disableButtonsAndChangeCursor();
    
     graphContainer1.classList.remove('hidden');
     graphContainer2.classList.remove('hidden');
     graphContainer3.classList.remove('hidden');
     aspTitle.classList.remove('hidden');
      //Hiding graph wrapper
     const getGraphWrapper = document.querySelector('.graph-wrapper');
     getGraphWrapper.classList.add('hidden');
     //Hiding graph caption wrapper and children
     const getGraphCaptionWrapper = document.querySelector('.graph-caption-wrapper');
     const getTitleAndLegend1 = document.querySelector('.graph-subtitle-section1')
     const getLegendBottom = document.querySelector('.legend-bottom-container')
     //Hiding
     getGraphCaptionWrapper.classList.add('hidden');
     getTitleAndLegend1.classList.add('hidden');
     getLegendBottom.classList.add('hidden');
     if (chartButton.classList.contains('clicked-purple')) {
       chartButton.classList.remove('clicked-purple');
       graphImage.src = "./graph_purple.png";
     }
     
      hideAllGraphData(volume, value, asp);
     
      selectCorrectMedicineImage();
     hideAnnotations(volume);
     hideAnnotations(value);
     hideAnnotations(asp);
      const getProductRecsPage = document.querySelector('.product-recommendations-main-page-container');
     getProductRecsPage.classList.remove('hidden');
      //Hiding the chart parent cards
     const getChartCards = document.querySelectorAll('.chart-card');
     getChartCards.forEach(item => item.classList.add('hidden'));
    }


 //Checking for classes on purple buttons to make them work and change picture depending on colour of button
 function clickedChartButton() {
   this.classList.add('clicked-purple');
   graphImage.src = "./graph_white.png";


   function enableButtonsAndChangeCursors() {
     pfsButton.disabled = false;
   daijButton.disabled = false;
   dpButton.disabled = false;


   moleculeSelector.disabled = false;
   moleculeSelector.style.cursor = "pointer";
   pfsButton.style.cursor = "pointer";
   daijButton.style.cursor = "pointer";
   dpButton.style.cursor = "pointer";
   prodRecsButton.style.cursor = "pointer";
   chartButton.style.cursor = "auto";
   }
  
   enableButtonsAndChangeCursors();


 function showElements(){
   //Showing graph wrapper
   const getGraphWrapper = document.querySelector('.graph-wrapper');
   const getTitleAndLegend1 = document.querySelector('.graph-subtitle-section1')
   //Getting legend botton container
   const getLegendBottom = document.querySelector('.legend-bottom-container')
   getGraphWrapper.classList.remove('hidden');
   getTitleAndLegend1.classList.remove('hidden');
   //Showing legend bottom container
   getLegendBottom.classList.remove('hidden');
 }


 showElements();




  


   showCorrectDataAndHighlightCorrectButtons(data, volume, value, asp);
   const getGraphCaptionWrapper = document.querySelector('.graph-caption-wrapper');
   getGraphCaptionWrapper.classList.remove('hidden');


   if (prodRecsButton.classList.contains('clicked-purple')) {
     prodRecsButton.classList.remove('clicked-purple');
     syringeImage.src = "./musicnote_purple.png";
   }
  
   //Hide product recommendations content
   const getProductRecsPage = document.querySelector('.product-recommendations-main-page-container');
   getProductRecsPage.classList.add('hidden');


 }


      //Adding event listeners
   pfsButton.addEventListener('click', ("click", (e) => { deviceButtonClick(e, volume, value, asp ) }));
   daijButton.addEventListener('click', ("click", (e) => { deviceButtonClick(e, volume, value, asp ) }));
   dpButton.addEventListener('click', ("click", (e) => { deviceButtonClick(e, volume, value, asp ) }));
   chartButton.addEventListener('click', clickedChartButton);
   prodRecsButton.addEventListener('click', clickedProductRecsButton);


   const graphContainers = document.querySelectorAll('.graph-card');
   graphContainers.forEach(item => item.addEventListener("click", (e) => { hideGraph(e, volume) }));


   const chartCards = document.querySelectorAll('.chart-card');
   chartCards.forEach(item => item.addEventListener('click', hideChart));


   const speechBubbleButtons = document.querySelectorAll('.speech-bubble-button');
   speechBubbleButtons.forEach(item => item.addEventListener('click', hideSpeechBubbles));


   showTutorialButton.addEventListener('click', showTutorial)
 


export function generateChart(device, metric, selectedButtons) {
 console.log('I am generate chart and I have run!');
 console.log(data);
 const cagrArrayForTables = makeCagrValuesArrayToPassToChart();
 console.log(cagrArrayForTables);
 const transformedData = createSingularDatasetForTablesAndTrendlines(data, device, metric);
 console.log(transformedData);
 showTable(transformedData, metric, cagrArrayForTables, selectedButtons);
};


//CHART - Auxiliary functions - Combined data PFS and DAIJ -
//VOL


export function generateCombinedChartTwoDevices(devices, metric, selectedButtons) {
 const cagrArrayForTables = makeCagrValuesArrayToPassToChart();
 const transformedDataPFS = createSingularDatasetForTablesAndTrendlines(data, devices.device1, metric);
 const transformedDataDAIJ = createSingularDatasetForTablesAndTrendlines(data, devices.device2, metric);
 const combinedDataTwoDatasets = combineDataTwoDatasetsForTablesAndTrendlines(transformedDataPFS, transformedDataDAIJ);
 showTable(combinedDataTwoDatasets, metric, cagrArrayForTables, selectedButtons);
}


export function generateCombinedChartThreeDevices(devices, metric, selectedButtons) {
 const cagrArrayForTables = makeCagrValuesArrayToPassToChart();
 const transformedDataPFS = createSingularDatasetForTablesAndTrendlines(data, devices.device1, metric);
 const transformedDataDAIJ = createSingularDatasetForTablesAndTrendlines(data, devices.device2, metric);
 const transformedDataDP = createSingularDatasetForTablesAndTrendlines(data, devices.device3, metric);
 const combinedDataThreeDatasets = combineDataThreeDatasetsForTablesAndTrendlines(transformedDataPFS, transformedDataDAIJ, transformedDataDP);
showTable(combinedDataThreeDatasets, metric, cagrArrayForTables, selectedButtons);


}


const generateDataforTrendlineOneDevice = (device, metric) => {
 const transformedData = createSingularDatasetForTablesAndTrendlines(data, device, metric);
 const beginningAndEndingValues = generateTrendLineDataPoints(transformedData, metric, device);
 return beginningAndEndingValues;


}


//Generate data for trendline - Two devices


const generateCombinedDataforTrendlineTwoDevices = (devices, metric) => {
 const transformedDataDevice1 = createSingularDatasetForTablesAndTrendlines(data, devices.device1, metric);
 const transformedDataDevice2 = createSingularDatasetForTablesAndTrendlines(data, devices.device2, metric);
 const combinedData = combineDataTwoDatasetsForTablesAndTrendlines(transformedDataDevice1, transformedDataDevice2);
 const beginningAndEndingValuesTwoDevices = generateTrendLineDataPoints(combinedData, metric, devices);
 return beginningAndEndingValuesTwoDevices;
}


//Generate data for trendline - Three devices
const generateCombinedDataForTrendlineThreeDevices = (devices, metric) => {
 const transformedDataDevice1 = createSingularDatasetForTablesAndTrendlines(data, devices.device1, metric);
 const transformedDataDevice2 = createSingularDatasetForTablesAndTrendlines(data, devices.device2, metric);
 const transformedDataDevice3 = createSingularDatasetForTablesAndTrendlines(data, devices.device3, metric);
 const combinedData = combineDataThreeDatasetsForTablesAndTrendlines(transformedDataDevice1, transformedDataDevice2, transformedDataDevice3);
 const beginningAndEndingValuesThreeDevices = generateTrendLineDataPoints(combinedData, metric, devices);
 return beginningAndEndingValuesThreeDevices;


}


const generateTrendLineDataPoints = (relevantData, metric, device) => {
 //Generate Ymin points
 const trendLineBeginningValues = findBeginningValuesForCAGRFunction(relevantData, metric);
 //Here need to pass the molecule!!
 const getMolecule = data.name;


 const dividedNumbers = divideByMillionBillionHundred(trendLineBeginningValues[0], metric, getMolecule, device);


 //Making beginningPoints Object
 const keyArray = ["aaa", "europe", "latinAmerica", "northAmerica"];
 let beginningValuesWithKeys = {};
 keyArray.forEach((key, i) => beginningValuesWithKeys[key] = dividedNumbers[i].toFixed(4));


 //Generate Ymax points - and return endingPoints Object
 const trendLineEndingValues = findEndingValuesForCAGRFunction(relevantData, metric);
 //Below change 3 to a variable - depending on metric
 let years;
 let initialbeginningValuesWithKeysVol = {};
 if (metric == 'vol') {
   years = 2;


   //HERE (only for Vol)- MAKING INITIAL STARTING VALUES OBJECT
  
   keyArray.forEach((key, i) => initialbeginningValuesWithKeysVol[key] = trendLineBeginningValues[1][i]);


 } else {
   years = 1;
 }


 const isTotal = 'false';


 const endingPointsWithKeysAndCagrPercentage = calculateCAGR(trendLineBeginningValues[0], trendLineEndingValues, years, metric, isTotal, getMolecule, device);


 //Putting beginning and ending values together in array - so can be returned together
 const beginningAndEndingValuesAndCagr = [];
   beginningAndEndingValuesAndCagr.push(beginningValuesWithKeys, initialbeginningValuesWithKeysVol, endingPointsWithKeysAndCagrPercentage);
  


 return beginningAndEndingValuesAndCagr;
}


//Listening for change on the dropdown and calling the second fetch function - based on value of dropdown
moleculeSelector.addEventListener('change', e => {
 e.currentTarget.disabled = true;
 console.log({ changeFired: moleculeSelector.value });
 const cagrDataToPass = checkIDAndFetchMainData(moleculeSelector.value);


 // console.log(cagrDataToPass);


 //Functionality to add correct medicine images into product recommendations
 selectCorrectMedicineImage();
 showAndHideProductBoxes(moleculeSelector.value);


 resetPage();


});



































