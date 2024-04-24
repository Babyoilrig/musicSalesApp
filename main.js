import './style.css';
import Chart from 'chart.js/auto';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

// import { get } from "lodash-es";
import chartTrendline from 'chartjs-plugin-trendline';
import annotationPlugin from 'chartjs-plugin-annotation';
import { transformData, combineDataTwoDatasets, combineDataThreeDatasets} from './datasets';
import { showTable, changeChartColumnColour } from './chart';
import waterMarkPlugin from './chartjs-plugin';
import { showLegend, hideLegend } from './legend';
import { showTutorialOnFirstVisit, hideSpeechBubbles, showTutorial } from './tutorial';
import calculateCAGR from './cagr';
import { findBeginningValuesForCAGRFunction, findEndingValuesForCAGRFunction } from './trendlines';
import { divideByMillionBillionHundred, fetchData, orderAlphabetically, removeBracketsFromName} from './Utilities';
import { showAnnotations, hideAnnotations } from './annotations';
import { photoOfWhatDevice, showAndHideProductBoxes } from './devices';
// import cleanGraphs from './cleanGraphs';

//Selecting elements on the page
const pfsButton = document.querySelector('.prefilled-syringe');
const daijButton = document.querySelector('.disposable-autoinjector');
const dpButton = document.querySelector('.disposable-pen');
const chartButton = document.querySelector('.chart');
const prodRecsButton = document.querySelector('.product-recommendations');
let syringeImage = document.querySelector('.syringe-image');
let graphImage = document.querySelector('.graph-image');
const brandNameText = document.querySelector('.brand-name');
const indicationText = document.querySelector('.indication');
const patentExpiryText = document.querySelector('.US-patent-expiry');
const mainTitleText = document.querySelector('.main-title');
const graphContainer1 = document.querySelector('.graph-container1');
const graphContainer2 = document.querySelector('.graph-container2');
const graphContainer3 = document.querySelector('.graph-container3');
const volChartCard = document.querySelector('.volChartCard');
const valChartCard = document.querySelector('.valChartCard');
const aspChartCard = document.querySelector('.aspChartCard');
const aspTitle = document.querySelector('.graph-title3');
const moleculeSelector = document.querySelector('.medicine-selector');
const showTutorialButton = document.querySelector('.show-tutorial');
const deviceNameWriting = document.querySelector('.device-name');

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



///////////////////////////////////////////////////////////////////////
//Getting data - of just the molecules - with just names and ids

showTutorialOnFirstVisit();

fetchData("https://run.mocky.io/v3/1cf82fc8-2346-4bfb-a2dd-6927e40db821").then(moleculeData => {

  //Dynamically input names and ids from first fetch into selector dropdown menu

  orderAlphabetically(moleculeData);

  moleculeData.forEach(function (molecule) {

    moleculeSelector.options[moleculeSelector.options.length] = new Option(molecule.name.toUpperCase(), molecule.id);

  })

  //Providing default dropdown value on page load
  moleculeSelector.value = "ADALIMUMAB";
  //Calling the function for second fetch on page load - with above default value

  checkIDAndFetchMainData(moleculeSelector.value);


})

let volume = undefined;
let value = undefined;
let asp = undefined;
//Defining the function for the second (main data) fetch
function checkIDAndFetchMainData(dropDownValue) {
  console.log('I am checkIDAndFetchMainData and I have run!');
  console.log(dropDownValue);

  fetchData('https://run.mocky.io/v3/689d4091-67f1-46cf-b399-bb9e9729953d').then(fetchedData => {
//   fetchData(`https://wcqpvqvauk.execute-api.ap-southeast-1.amazonaws.com/prod/molecule/${dropDownValue}`).then(fetchedData => {

    data = fetchedData;
    //Adding values to page for brand name, indication, patent
    console.log({ data });
    brandNameText.textContent = data.brandName;
    indicationText.textContent = data.indication;
    patentExpiryText.textContent = data.usPatentExpiry;
    const mainTitleUpperCase = data.name.toUpperCase();
    mainTitleText.textContent = mainTitleUpperCase;

    const pfs = data.containers.find(c => c.primaryContainer === "Prefilled Syringe") ? data.containers.find(c => c.primaryContainer === "Prefilled Syringe") : 0;
    
    const daij = data.containers.find(c => c.primaryContainer === "Disposable autoinjector") ? data.containers.find(c => c.primaryContainer === "Disposable autoinjector") : 0;
    
    const dp = data.containers.find(c => c.primaryContainer === "Disposable pens") ? data.containers.find(c => c.primaryContainer === "Disposable pens") : 0;
    

    
    // //PFS - Prefilled syringe - Regions

    const pfsAaa = pfs ? pfs.region.AAA : 0;
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
    
    //Functions to generate charts

    //Getting trendline data for Pfs
    beginningAndEndingValuesPfsVol = generateDataforTrendline('Prefilled Syringe', 'vol');
    beginningAndEndingValuesPfsVal = generateDataforTrendline('Prefilled Syringe', 'val');
    beginningAndEndingValuesPfsAsp = generateDataforTrendline('Prefilled Syringe', 'asp');
    

    //Getting trendline data for Daij
    beginningAndEndingValuesDaijVol = generateDataforTrendline('Disposable autoinjector', 'vol');
    beginningAndEndingValuesDaijVal = generateDataforTrendline('Disposable autoinjector', 'val');
    beginningAndEndingValuesDaijAsp = generateDataforTrendline('Disposable autoinjector', 'asp');

    //Getting trendline data for Dp
    beginningAndEndingValuesDpVol = generateDataforTrendline('Disposable pens', 'vol');
    beginningAndEndingValuesDpVal = generateDataforTrendline('Disposable pens', 'val');
    beginningAndEndingValuesDpAsp = generateDataforTrendline('Disposable pens', 'asp');

    //Getting trendline data Combined Pfs and Daij
    //Vol
    beginningAndEndingValuesPfsAndDaijVol = generateCombinedDataforTrendline({ device1: 'Prefilled Syringe', device2: 'Disposable autoinjector' }, 'vol');
    // // // //Val
    beginningAndEndingValuesPfsAndDaijVal = generateCombinedDataforTrendline({ device1: 'Prefilled Syringe', device2: 'Disposable autoinjector' }, 'val');

    //Combined trendline Daij and Dp
    //Vol
    beginningAndEndingValuesDaijAndDpVol = generateCombinedDataforTrendline({ device1: 'Disposable autoinjector', device2: 'Disposable pens' }, 'vol');
    // // //Val
    beginningAndEndingValuesDaijAndDpVal = generateCombinedDataforTrendline({ device1: 'Disposable autoinjector', device2: 'Disposable pens' }, 'val');

     //Combined trendline Pfs and Dp
    beginningAndEndingValuesPfsAndDpVol = generateCombinedDataforTrendline({ device1: 'Prefilled Syringe', device2: 'Disposable pens' }, 'vol');
    beginningAndEndingValuesPfsAndDpVal = generateCombinedDataforTrendline({ device1: 'Prefilled Syringe', device2: 'Disposable pens' }, 'val');

    //Combined trendline data - Three devices
    beginningAndEndingValuesThreeDevicesVol = generateCombinedDataForTrendlineThreeDevices({device1: 'Prefilled Syringe', device2: 'Disposable autoinjector', device3: 'Disposable pens'}, 'vol');
    beginningAndEndingValuesThreeDevicesVal = generateCombinedDataForTrendlineThreeDevices({device1: 'Prefilled Syringe', device2: 'Disposable autoinjector', device3: 'Disposable pens'}, 'val');

    //////GRAPH INFO /////////////////////////////////////////////////////////////////

    ////////////Creating data for Trend lines

    //Below is all trend line data for Pfs
    const transformedLineDataVolPfs = transformData(data, "Prefilled Syringe", "vol");
    const transformedLineDataValPfs = transformData(data, "Prefilled Syringe", "val");
    const transformedLineDataAspPfs = transformData(data, "Prefilled Syringe", "asp");


    //Below is all trend line data for Daij

    const transformedLineDataVolDaij = transformData(data, "Disposable autoinjector", "vol");
    const transformedLineDataValDaij = transformData(data, "Disposable autoinjector", "val");
    const transformedLineDataAspDaij = transformData(data, "Disposable autoinjector", "asp");

    //Below is all trendline data for Dp

    const transformedLineDataVolDp = transformData(data, "Disposable pens", "vol");
    const transformedLineDataValDp = transformData(data, "Disposable pens", "val");
    const transformedLineDataAspDp = transformData(data, "Disposable pens", "asp");

    ////Below is combined trend line data for Pfs & Daij

    const combinedLineDataPfsAndDaijVol = combineDataTwoDatasets(transformedLineDataVolPfs, transformedLineDataVolDaij);
    const combinedLinedataPfsAndDaijVal = combineDataTwoDatasets(transformedLineDataValPfs, transformedLineDataValDaij);

    // //Combined line data for Daij and Dp

    const combinedLineDataDaijAndDpVol = combineDataTwoDatasets(transformedLineDataVolDaij, transformedLineDataVolDp);
    const combinedLineDataDaijAndDpVal = combineDataTwoDatasets(transformedLineDataValDaij, transformedLineDataValDp);

    //Combined line data for Pfs and Dp

    const combinedLineDataPfsAndDpVol = combineDataTwoDatasets(transformedLineDataVolPfs, transformedLineDataVolDp);
    const combinedLineDataPfsAndDpVal = combineDataTwoDatasets(transformedLineDataValPfs, transformedLineDataValDp);

    //Combine line data for all three datasets
    const combinedLineDataThreeDatasetsVol = combineDataThreeDatasets(transformedLineDataVolPfs, transformedLineDataVolDaij, transformedLineDataVolDp);
    const combinedLineDataThreeDatasetsVal = combineDataThreeDatasets(transformedLineDataValPfs, transformedLineDataValDaij, transformedLineDataValDp);

   
    ///////////////////////////
    const DATA_COUNT = 4;

    ////////* GRAPH DATA - GRAPH 1 - VOL *//

    const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 3000000 };

    const chartDataVol = {
      labels: ["AAA", "Europe", "Latin Am.", "North Am."],
      datasets: [
        {
          label: "PFS Volume 2021",
          data: [(pfsAaa ? pfsAaa.vol.find(item => item.year === "2021").value / 1000000 : 0),
          (pfsEurope ? pfsEurope.vol.find(item => item.year === "2021").value / 1000000 : 0),
          (pfsLatinAmerica ? pfsLatinAmerica.vol.find(item => item.year === "2021").value / 1000000 : 0),
          (pfsNorthAmerica ? pfsNorthAmerica.vol.find(item => item.year === "2021").value / 1000000 : 0),
          ],
          backgroundColor: ['#9799af'], //dark grey
          stack: 'Stack 0',

        },
        {
          label: "AI Volume 2021",
          data: [(daijAaa ? daijAaa.vol.find(item => item.year === "2021").value / 1000000 : 0),
          (daijEurope ? daijEurope.vol.find(item => item.year === "2021").value / 1000000 : 0),
          (daijLatinAmerica ? (daijLatinAmerica.vol.find(item => item.year === "2021").value / 1000000) : 0),
          (daijNorthAmerica ? daijNorthAmerica.vol.find(item => item.year === "2021").value / 1000000 : 0),
          ],
          backgroundColor: ['#dedede'], //light grey
          stack: 'Stack 0',
          hidden: true,

        },
        {   
          label: 'DP Volume 2021',
          data: [(dpAaa ? dpAaa.vol.find(item => item.year === "2021").value / 1000000 : 0),
                 (dpEurope ? dpEurope.vol.find(item => item.year === "2021").value / 1000000 : 0),
                 (dpLatinAmerica ? dpLatinAmerica.vol.find(item => item.year === "2021").value / 1000000 : 0),
                 (dpNorthAmerica ? dpNorthAmerica.vol.find(item => item.year === "2021").value / 1000000: 0),
                 ],
                 backgroundColor: ['#e0b0ff'], //purple
                 stack: 'Stack 0',
                 hidden: true,
           },
        {
          label: "PFS Volume 2022",
          data: [(pfsAaa ? pfsAaa.vol.find(item => item.year === "2022").value / 1000000 : 0),
          (pfsEurope ? pfsEurope.vol.find(item => item.year === "2022").value / 1000000 : 0),
          (pfsLatinAmerica ? pfsLatinAmerica.vol.find(item => item.year === "2022").value / 1000000 : 0),
          (pfsNorthAmerica ? pfsNorthAmerica.vol.find(item => item.year === "2022").value / 1000000 : 0),
          ],
          backgroundColor: ['#ff9800'], //orange
          stack: 'Stack 1',

        },
        {
          label: "AI Volume 2022",
          data: [(daijAaa ? daijAaa.vol.find(item => item.year === "2022").value / 1000000 : 0),
          (daijEurope ? daijEurope.vol.find(item => item.year === "2022").value / 1000000 : 0),
          (daijLatinAmerica ? (daijLatinAmerica.vol.find(item => item.year === "2022").value / 1000000) : 0),
          (daijNorthAmerica ? daijNorthAmerica.vol.find(item => item.year === "2022").value / 1000000 : 0),
          ],
          backgroundColor: ['#e5de00'], //yellow
          stack: 'Stack 1',
          hidden: true,

        },
        {   
          label: 'DP Volume 2022',
          data: [(dpAaa ? dpAaa.vol.find(item => item.year === "2022").value / 1000000 : 0),
                 (dpEurope ? dpEurope.vol.find(item => item.year === "2022").value / 1000000 : 0),
                 (dpLatinAmerica ? dpLatinAmerica.vol.find(item => item.year === "2022").value / 1000000 : 0),
                 (dpNorthAmerica ? dpNorthAmerica.vol.find(item => item.year === "2022").value / 1000000: 0),
                 ],
                 backgroundColor: ['#ff6865'], //red
                 stack: 'Stack 1',
                 hidden: true,
           },
        {
          label: "PFS Volume 2023",
          data: [(pfsAaa ? pfsAaa.vol.find(item => item.year === "2023").value / 1000000 : 0),
          (pfsEurope ? pfsEurope.vol.find(item => item.year === "2023").value / 1000000 : 0),
          (pfsLatinAmerica ? pfsLatinAmerica.vol.find(item => item.year === "2023").value / 1000000 : 0),
          (pfsNorthAmerica ? pfsNorthAmerica.vol.find(item => item.year === "2023").value / 1000000 : 0),
          ],
          backgroundColor: ['#277dfe'], //bright blue
          stack: 'Stack 2',

        },
        {
          label: "AI Volume 2023",
          data: [(daijAaa ? daijAaa.vol.find(item => item.year === "2023").value / 1000000 : 0),
          (daijEurope ? daijEurope.vol.find(item => item.year === "2023").value / 1000000 : 0),
          (daijLatinAmerica ? (daijLatinAmerica.vol.find(item => item.year === "2023").value / 1000000) : 0),
          (daijNorthAmerica ? (daijNorthAmerica.vol.find(item => item.year === "2023").value / 1000000) : 0),
          ],
          backgroundColor: ['#00c0f9'], //light blue
          stack: 'Stack 2',
          hidden: true,
        },
        {   
          label: 'DP Volume 2023',
          data: [(dpAaa ? dpAaa.vol.find(item => item.year === "2023").value / 1000000 : 0),
                 (dpEurope ? dpEurope.vol.find(item => item.year === "2023").value / 1000000 : 0),
                 (dpLatinAmerica ? dpLatinAmerica.vol.find(item => item.year === "2023").value / 1000000 : 0),
                 (dpNorthAmerica ? dpNorthAmerica.vol.find(item => item.year === "2023").value / 1000000: 0),
                 ],
                 backgroundColor: ['#02f7d8'], //turquoise
                 stack: 'Stack 2',
                 hidden: true,

           },


      ]
    }

    /////GRAPHS SECTION ////////////

    //This sets the graph floating bubbles above the bars
    const tooltip = {
      yAlign: 'bottom',
    };

    //This sets the default font size for all the graphs
    Chart.defaults.font.size = 16;

    //This registers the use of the watermark plugin found in chartjs-plugin
    Chart.register(waterMarkPlugin);

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
      data: chartDataVol,
      options: {
        plugins: {

          legend: {
            display: false,
          },
          tooltip,
          autocolors: false,
        },
        responsive: true,
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

    //Putting colours into legend

    // Selecting shapes from legend
    //Legend Box - with 3 colors for pfs 
    document.querySelector('.pfs-square-divider-1').style.backgroundColor = volume.data.datasets[0].backgroundColor;
    document.querySelector('.pfs-square-divider-2').style.backgroundColor = volume.data.datasets[3].backgroundColor;
    document.querySelector('.pfs-square-divider-3').style.backgroundColor = volume.data.datasets[6].backgroundColor;

    //Legend Box - with 3 colors for daij
    document.querySelector('.daij-square-divider-1').style.backgroundColor = volume.data.datasets[1].backgroundColor;
    document.querySelector('.daij-square-divider-2').style.backgroundColor = volume.data.datasets[4].backgroundColor;
    document.querySelector('.daij-square-divider-3').style.backgroundColor = volume.data.datasets[7].backgroundColor;

    //Legend Box - with 3 colors for dp

    document.querySelector('.dp-square-divider-1').style.backgroundColor = volume.data.datasets[2].backgroundColor;
    document.querySelector('.dp-square-divider-2').style.backgroundColor = volume.data.datasets[5].backgroundColor;
    document.querySelector('.dp-square-divider-3').style.backgroundColor = volume.data.datasets[8].backgroundColor;

    //Putting colours into the three-part legend year boxes
    document.querySelector('.year1-square-divider-1').style.backgroundColor = volume.data.datasets[0].backgroundColor;
    document.querySelector('.year1-square-divider-2').style.backgroundColor = volume.data.datasets[1].backgroundColor;
    document.querySelector('.year1-square-divider-3').style.backgroundColor = volume.data.datasets[2].backgroundColor;   
    
    document.querySelector('.year2-square-divider-1').style.backgroundColor = volume.data.datasets[3].backgroundColor; 
    document.querySelector('.year2-square-divider-2').style.backgroundColor = volume.data.datasets[4].backgroundColor; 
    document.querySelector('.year2-square-divider-3').style.backgroundColor = volume.data.datasets[5].backgroundColor; 
    
    document.querySelector('.year3-square-divider-1').style.backgroundColor = volume.data.datasets[6].backgroundColor; 
    document.querySelector('.year3-square-divider-2').style.backgroundColor = volume.data.datasets[7].backgroundColor;
    document.querySelector('.year3-square-divider-3').style.backgroundColor = volume.data.datasets[8].backgroundColor;     
    

    //All colour changes are generated dynamically - please see legend.js

    //TRENDLINES
    //PFS
    //PFS - Volume - Trendline

    ////////* GRAPH DATA BELOW - GRAPH 2 - VAL *//

    const chartDataVal = {
      labels: ["AAA", "Europe", "Latin Am.", "North Am."],
      datasets: [
        {
          label: "PFS Value 2021",
          data: [(pfsAaa ? pfsAaa.val.find(item => item.year === "2021").value / 1000000000 : 0),
          (pfsEurope ? pfsEurope.val.find(item => item.year === "2021").value / 1000000000 : 0),
          (pfsLatinAmerica ? pfsLatinAmerica.val.find(item => item.year === "2021").value / 1000000000 : 0),
          (pfsNorthAmerica ? pfsNorthAmerica.val.find(item => item.year === "2021").value / 1000000000 : 0),
          ],
          backgroundColor: ['#9799af'], //dark grey
          stack: 'Stack 0',

        },
        {
          label: "AI Value 2021",
          data: [(daijAaa ? daijAaa.val.find(item => item.year === "2021").value / 1000000000 : 0),
          (daijEurope ? daijEurope.val.find(item => item.year === "2021").value / 1000000000 : 0),
          (daijLatinAmerica ? (daijLatinAmerica.val.find(item => item.year === "2021").value / 1000000000) : 0),
          (daijNorthAmerica ? daijNorthAmerica.val.find(item => item.year === "2021").value / 1000000000 : 0),
          ],
          backgroundColor: ['#dedede'], //light grey
          stack: 'Stack 0',
          hidden: true,
        },
        {   
          label: 'DP Value 2021',
          data: [(dpAaa ? dpAaa.val.find(item => item.year === "2021").value / 1000000000 : 0),
                 (dpEurope ? dpEurope.val.find(item => item.year === "2021").value / 1000000000 : 0),
                 (dpLatinAmerica ? dpLatinAmerica.val.find(item => item.year === "2021").value / 1000000000 : 0),
                 (dpNorthAmerica ? dpNorthAmerica.val.find(item => item.year === "2021").value / 1000000000 : 0),
                 ],
                 backgroundColor: ['#e0b0ff'], //purple
                 stack: 'Stack 0',
                 hidden: true,
           },
        {
          label: "PFS Value 2022",
          data: [(pfsAaa ? pfsAaa.val.find(item => item.year === "2022").value / 1000000000 : 0),
          (pfsEurope ? pfsEurope.val.find(item => item.year === "2022").value / 1000000000 : 0),
          (pfsLatinAmerica ? pfsLatinAmerica.val.find(item => item.year === "2022").value / 1000000000 : 0),
          (pfsNorthAmerica ? pfsNorthAmerica.val.find(item => item.year === "2022").value / 1000000000 : 0),
          ],
          backgroundColor: ['#ff9800'], //orange
          stack: 'Stack 1',
        },
        {
          label: "AI Value 2022",
          data: [(daijAaa ? daijAaa.val.find(item => item.year === "2022").value / 1000000000 : 0),
          (daijEurope ? daijEurope.val.find(item => item.year === "2022").value / 1000000000 : 0),
          (daijLatinAmerica ? daijLatinAmerica.val.find(item => item.year === "2022").value / 1000000000 : 0),
          (daijNorthAmerica ? daijNorthAmerica.val.find(item => item.year === "2022").value / 1000000000 : 0),
          ],
          backgroundColor: ['#e5de00'], //yellow
          stack: 'Stack 1',
          hidden: true,
        },
        {   
          label: 'DP Value 2022',
          data: [(dpAaa ? dpAaa.val.find(item => item.year === "2022").value / 1000000000 : 0),
                 (dpEurope ? dpEurope.val.find(item => item.year === "2022").value / 1000000000 : 0),
                 (dpLatinAmerica ? dpLatinAmerica.val.find(item => item.year === "2022").value / 1000000000 : 0),
                 (dpNorthAmerica ? dpNorthAmerica.val.find(item => item.year === "2022").value / 1000000000 : 0),
                 ],
                 backgroundColor: ['#ff6865'], //red
                 stack: 'Stack 1',
                 hidden: true,
           },

      ]
    }


    //////GRAPH CREATION - GRAPH 2 - VAL ///////////////////

    const configVal = {
      type: 'bar',
      data: chartDataVal,
      options: {
        plugins: {
          tooltip,
          legend: {
            display: false,
          }
        },
        responsive: true,
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


    if (value) value.destroy();
    value = new Chart(
      document.getElementById('graph2'),
      configVal
    )

    ////////* GRAPH DATA BELOW - GRAPH 3 - ASP *//

    const chartDataAsp = {
      labels: ["AAA", "Europe", "Latin Am.", "North Am."],
      datasets: [
        {
          label: "PFS ASP 2021",
          data: [(pfsAaa ? pfsAaa.asp.find(item => item.year === "2021").value / 100 : 0),
          (pfsEurope ? pfsEurope.asp.find(item => item.year === "2021").value / 100 : 0),
          (pfsLatinAmerica ? pfsLatinAmerica.asp.find(item => item.year === "2021").value / 100 : 0),
          (pfsNorthAmerica ? pfsNorthAmerica.asp.find(item => item.year === "2021").value / 100 : 0),
          ],
          backgroundColor: ['#9799af'], //dark grey
          stack: 'Stack 0',

        },
        {
          label: "AI ASP 2021",
          data: [(daijAaa ? daijAaa.asp.find(item => item.year === "2021").value / 100 : 0),
          (daijEurope ? daijEurope.asp.find(item => item.year === "2021").value / 100 : 0),
          (daijLatinAmerica ? daijLatinAmerica.asp.find(item => item.year === "2021").value / 100 : 0),
          (daijNorthAmerica ? daijNorthAmerica.asp.find(item => item.year === "2021").value / 100 : 0),
          ],
          backgroundColor: ['#dedede'], //light grey
          stack: 'Stack 0',
          hidden: true,

        },
        {   
          label: 'DP ASP 2021',
          data: [(dpAaa ? dpAaa.asp.find(item => item.year === "2021").value / 100 : 0),
                 (dpEurope ? dpEurope.asp.find(item => item.year === "2021").value / 100 : 0),
                 (dpLatinAmerica ? dpLatinAmerica.asp.find(item => item.year === "2021").value / 100 : 0),
                 (dpNorthAmerica ? dpNorthAmerica.asp.find(item => item.year === "2021").value / 100 : 0),
                 ],
                 backgroundColor: ['#e0b0ff'], //purple
                 stack: 'Stack 0',
                 hidden: true,
           },
        {
          label: "PFS ASP 2022",
          data: [(pfsAaa ? pfsAaa.asp.find(item => item.year === "2022").value / 100 : 0),
          (pfsEurope ? pfsEurope.asp.find(item => item.year === "2022").value / 100 : 0),
          (pfsLatinAmerica ? pfsLatinAmerica.asp.find(item => item.year === "2022").value / 100 : 0),
          (pfsNorthAmerica ? pfsNorthAmerica.asp.find(item => item.year === "2022").value / 100 : 0),
          ],
          backgroundColor: ['#ff9800'], //orange
          stack: 'Stack 1',

        },
        {
          label: "AI ASP 2022",
          data: [(daijAaa ? daijAaa.asp.find(item => item.year === "2022").value / 100 : 0),
          (daijEurope ? daijEurope.asp.find(item => item.year === "2022").value / 100 : 0),
          (daijLatinAmerica ? daijLatinAmerica.asp.find(item => item.year === "2022").value / 100 : 0),
          (daijNorthAmerica ? daijNorthAmerica.asp.find(item => item.year === "2022").value / 100 : 0),
          ],
          backgroundColor: ['#e5de00'], //yellow
          stack: 'Stack 1',
          hidden: true,

        },
         {   
          label: 'DP ASP 2022',
          data: [(dpAaa ? dpAaa.asp.find(item => item.year === "2022").value / 100 : 0),
                 (dpEurope ? dpEurope.asp.find(item => item.year === "2022").value / 100 : 0),
                 (dpLatinAmerica ? dpLatinAmerica.asp.find(item => item.year === "2022").value / 100 : 0),
                 (dpNorthAmerica ? dpNorthAmerica.asp.find(item => item.year === "2022").value / 100 : 0),
                 ],
                 backgroundColor: ['#ff6865'], //red
                 stack: 'Stack 1',
                 hidden: true,
           },

      ]
    }

    //////GRAPH CREATION - GRAPH 3 - ASP ///////////////////
    const configAsp = {
      type: 'bar',
      data: chartDataAsp,
      options: {
        plugins: {
          tooltip,
          legend: {
            display: false,
          }
        },
        responsive: true,
        interaction: {
          intersect: false,
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Thousands',
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
  const pfs = data.containers.find(c => c.primaryContainer === "Prefilled Syringe") ? data.containers.find(c => c.primaryContainer === "Prefilled Syringe") : 0;
  const daij = data.containers.find(c => c.primaryContainer === "Disposable autoinjector") ? data.containers.find(c => c.primaryContainer === "Disposable autoinjector") : 0;
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

    function deviceButtonClick(e) {
      console.log('I am deviceButtonClick and I have run!');
      let metric;
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

    //Checking for classes on purple buttons to make them work and change picture depending on colour of button
    function clickedChartButton() {
      this.classList.add('clicked-purple');
      graphImage.src = "./graph_white.png";
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

    
      //Showing graph wrapper
      const getGraphWrapper = document.querySelector('.graph-wrapper');
      const getTitleAndLegend1 = document.querySelector('.graph-subtitle-section1')
      //Getting legend botton container
      const getLegendBottom = document.querySelector('.legend-bottom-container')
      getGraphWrapper.classList.remove('hidden');
      getTitleAndLegend1.classList.remove('hidden');
      //Showing legend bottom container
      getLegendBottom.classList.remove('hidden');
      showCorrectDataAndHighlightCorrectButtons(data, volume, value, asp) 
      const getGraphCaptionWrapper = document.querySelector('.graph-caption-wrapper');
      getGraphCaptionWrapper.classList.remove('hidden');

      if (prodRecsButton.classList.contains('clicked-purple')) {
        prodRecsButton.classList.remove('clicked-purple');
        syringeImage.src = "./syringe_purple.png";
      }
      
      //Hide product recommendations content
      const getProductRecsPage = document.querySelector('.product-recommendations-main-page-container');
      getProductRecsPage.classList.add('hidden');

    }


    function clickedProductRecsButton() {
      //Changing button to purple and changing image
      this.classList.add('clicked-purple');
      syringeImage.src = "./syringe_white.png";

      //'Disabling' top buttons 
      pfsButton.classList.remove('clicked-red');
      pfsButton.disabled = true;
      daijButton.classList.remove('clicked-red');
      daijButton.disbled = true;
      dpButton.classList.remove('clicked-red');
      dpButton.disabled = true;

      moleculeSelector.disabled = true;
      moleculeSelector.style.cursor = "auto";
      pfsButton.style.cursor = "auto";
      daijButton.style.cursor = "auto";
      dpButton.style.cursor = "auto";
      prodRecsButton.style.cursor = "auto";
      chartButton.style.cursor = "pointer";

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

      //Removing graph data

      //volume datasets
      volume.data.datasets[0].hidden = true;
      volume.data.datasets[1].hidden = true;
      volume.data.datasets[2].hidden = true;
      volume.data.datasets[3].hidden = true;
      volume.data.datasets[4].hidden = true;
      volume.data.datasets[5].hidden = true;
      //value datasets
      value.data.datasets[0].hidden = true;
      value.data.datasets[1].hidden = true;
      value.data.datasets[2].hidden = true;
      value.data.datasets[3].hidden = true;
      
      //asp datasets
      asp.data.datasets[0].hidden = true;
      asp.data.datasets[1].hidden = true;
      asp.data.datasets[2].hidden = true;
      asp.data.datasets[3].hidden = true;
     

      volume.update();
      value.update();
      asp.update();

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


    function hideGraph(e) {
      
      if (!pfsButton.classList.contains('clicked-red') && !daijButton.classList.contains('clicked-red') && !dpButton.classList.contains('clicked-red')) {
        return;
      } else {
        console.log(e.currentTarget);
        e.currentTarget.classList.add('hidden');
        const graphName = e.currentTarget.dataset.value;
        let metric;
        let chartCard;
        if (graphName == "vol-graph") {
          metric = "vol";
          chartCard = volChartCard;
        } else if (graphName == "val-graph") {
          metric = "val";
          chartCard = valChartCard;
        } else if (graphName == "asp-graph") {
          metric = "asp";
          chartCard = aspChartCard;
        }
        //Need new conditions here
        //Combination 1
        //All three on
        if (pfsButton.classList.contains('clicked-red') && daijButton.classList.contains('clicked-red') && dpButton.classList.contains('clicked-red')) {
         generateCombinedChartThreeDevices({ device1: "Prefilled Syringe", device2: "Disposable autoinjector", device3: "Disposable pens"}, metric);
        
        changeChartColumnColour(volume, e, "1", "4", "7");
        }

      //Combination 2
      //pfs on 
      //daij on
      //dp off
      else if (pfsButton.classList.contains('clicked-red') && daijButton.classList.contains('clicked-red') && !dpButton.classList.contains('clicked-red')) {
        generateCombinedChartTwoDevices({ device1: "Prefilled Syringe", device2: "Disposable autoinjector"}, metric);
        changeChartColumnColour(volume, e, "1", "4", "7");
      }

      //Combination 3
        //pfs off
        //daij on
        //dp on
        else if (!pfsButton.classList.contains('clicked-red') && daijButton.classList.contains('clicked-red') && dpButton.classList.contains('clicked-red')) {
          generateCombinedChartTwoDevices({ device1: "Disposable autoinjector", device2: "Disposable pens"}, metric);
          changeChartColumnColour(volume, e, "1", "4", "7");
        }

      //Combination 4  
      //pfs on
        //daij off
        //dp on
        else if (pfsButton.classList.contains('clicked-red') && !daijButton.classList.contains('clicked-red') && dpButton.classList.contains('clicked-red')) {
          generateCombinedChartTwoDevices({ device1: "Prefilled Syringe", device2: "Disposable pens"}, metric);
          changeChartColumnColour(volume, e, "1", "4", "7");
        }   

      //Combination 5
        // pfs on 
        //daij off
        //dp off

      else if (pfsButton.classList.contains('clicked-red') && !daijButton.classList.contains('clicked-red') && !dpButton.classList.contains('clicked-red')) { 
        generateChart("Prefilled Syringe", metric);
        changeChartColumnColour(volume, e, "0", "3", "6");
      }

    //Combination 6
        // pfs off 
        //daij on
        //dp off

      
      else if (!pfsButton.classList.contains('clicked-red') && daijButton.classList.contains('clicked-red') && !dpButton.classList.contains('clicked-red')) {
        generateChart("Disposable autoinjector", metric);
        changeChartColumnColour(volume, e, "1", "4", "7");
      }

      //Combination 7
      //pfs off
      //daij off
      //dp on

      else if (!pfsButton.classList.contains('clicked-red') && !daijButton.classList.contains('clicked-red') && dpButton.classList.contains('clicked-red')) {
        generateChart("Disposable pens", metric);
        changeChartColumnColour(volume, e, "2", "5", "8");
      }
        chartCard.classList.remove('hidden');
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



    //Adding event listeners
    pfsButton.addEventListener('click', deviceButtonClick);
    daijButton.addEventListener('click', deviceButtonClick);
    dpButton.addEventListener('click', deviceButtonClick);
    chartButton.addEventListener('click', clickedChartButton);
    prodRecsButton.addEventListener('click', clickedProductRecsButton);

    const graphContainers = document.querySelectorAll('.graph-card');
    graphContainers.forEach(item => item.addEventListener('click', hideGraph));

    const chartCards = document.querySelectorAll('.chart-card');
    chartCards.forEach(item => item.addEventListener('click', hideChart));

    const speechBubbleButtons = document.querySelectorAll('.speech-bubble-button');
    speechBubbleButtons.forEach(item => item.addEventListener('click', hideSpeechBubbles));

    showTutorialButton.addEventListener('click', showTutorial)

const generateChart = (device, metric) => {
  const transformedData = transformData(data, device, metric);
  console.log(transformedData);
  showTable(transformedData, metric);
};

//CHART - Auxiliary functions - Combined data PFS and DAIJ - 
//VOL

const generateCombinedChartTwoDevices = (devices, metric) => {
  const transformedDataPFS = transformData(data, devices.device1, metric);
  const transformedDataDAIJ = transformData(data, devices.device2, metric);
  const combinedDataTwoDatasets = combineDataTwoDatasets(transformedDataPFS, transformedDataDAIJ);
  showTable(combinedDataTwoDatasets, metric);
}

const generateCombinedChartThreeDevices = (devices, metric) => {
  // console.log('I am generate chart 3 devices and I have run!');
  const transformedDataPFS = transformData(data, devices.device1, metric);
  const transformedDataDAIJ = transformData(data, devices.device2, metric);
  const transformedDataDP = transformData(data, devices.device3, metric);
  const combinedDataThreeDatasets = combineDataThreeDatasets(transformedDataPFS, transformedDataDAIJ, transformedDataDP);
showTable(combinedDataThreeDatasets, metric);

}

const generateDataforTrendline = (device, metric) => {
  const transformedData = transformData(data, device, metric);
  const beginningAndEndingValues = generateTrendLineDataPoints(transformedData, metric);
  return beginningAndEndingValues;

}

//Generate data for trendline - Two devices

const generateCombinedDataforTrendline = (devices, metric) => {
  const transformedDataDevice1 = transformData(data, devices.device1, metric);
  const transformedDataDevice2 = transformData(data, devices.device2, metric);
  const combinedData = combineDataTwoDatasets(transformedDataDevice1, transformedDataDevice2);
  const beginningAndEndingValuesTwoDevices = generateTrendLineDataPoints(combinedData, metric);
  return beginningAndEndingValuesTwoDevices;
}

//Generate data for trendline - Three devices
const generateCombinedDataForTrendlineThreeDevices = (devices, metric) => {
  const transformedDataDevice1 = transformData(data, devices.device1, metric);
  const transformedDataDevice2 = transformData(data, devices.device2, metric);
  const transformedDataDevice3 = transformData(data, devices.device3, metric);
  const combinedData = combineDataThreeDatasets(transformedDataDevice1, transformedDataDevice2, transformedDataDevice3);
  const beginningAndEndingValuesThreeDevices = generateTrendLineDataPoints(combinedData, metric);
  return beginningAndEndingValuesThreeDevices;

}

const generateTrendLineDataPoints = (relevantData, metric) => {
  //Generate Ymin points
  const trendLineBeginningValues = findBeginningValuesForCAGRFunction(relevantData, metric);
  const dividedNumbers = divideByMillionBillionHundred(trendLineBeginningValues[0], metric);

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
    years = 3;

    //HERE (only for Vol)- MAKING INITIAL STARTING VALUES OBJECT
    
    keyArray.forEach((key, i) => initialbeginningValuesWithKeysVol[key] = trendLineBeginningValues[1][i]);

  } else {
    years = 2;
  }
  const endingPointsWithKeysAndCagrPercentage = calculateCAGR(trendLineBeginningValues[0], trendLineEndingValues, years, metric);

  //Putting beginning and ending values together in array - so can be returned together
  const beginningAndEndingValuesAndCagr = [];
    beginningAndEndingValuesAndCagr.push(beginningValuesWithKeys, initialbeginningValuesWithKeysVol, endingPointsWithKeysAndCagrPercentage);
  return beginningAndEndingValuesAndCagr;
}

//Listening for change on the dropdown and calling the second fetch function - based on value of dropdown
moleculeSelector.addEventListener('change', e => {
  e.currentTarget.disabled = true;
  console.log({ changeFired: moleculeSelector.value });
  checkIDAndFetchMainData(moleculeSelector.value);

  //Functionality to add correct medicine images into product recommendations
  selectCorrectMedicineImage();
  showAndHideProductBoxes(moleculeSelector.value);
volChartCard.classList.add('hidden');
valChartCard.classList.add('hidden');
aspChartCard.classList.add('hidden');
graphContainer1.classList.remove('hidden');
graphContainer2.classList.remove('hidden');
pfsButton.classList.remove('clicked-red');
daijButton.classList.remove('clicked-red');
dpButton.classList.remove('clicked-red');
pfsButton.disabled = false;
daijButton.disabled = false;
dpButton.disabled = false;

});

//Function to select correct medicine image based on value from the dropdown
function selectCorrectMedicineImage() {
  const getMedicineSelectorValue = moleculeSelector.value;
  console.log(moleculeSelector.value);
  const getMedicineImage = document.querySelector('.medicine-image-large');

  if(getMedicineSelectorValue.includes("(" || ")")) {
    const nameWithoutBrackets = removeBracketsFromName(getMedicineSelectorValue).toUpperCase();
    getMedicineImage.src = `/${nameWithoutBrackets}.png`
  const deviceName = photoOfWhatDevice(nameWithoutBrackets);
  deviceNameWriting.textContent = deviceName;
} else {
  getMedicineImage.src = `/${getMedicineSelectorValue}.png`
  const deviceName = photoOfWhatDevice(getMedicineSelectorValue);
  deviceNameWriting.textContent = deviceName;
}

}

