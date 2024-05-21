import {generateChart, generateCombinedChartThreeDevices, generateCombinedChartTwoDevices} from './main';
import { changeChartColumnColour } from './chart';


export function hideAllGraphData(volume, value, asp) {
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
}


export function hideGraph(e, volume) {
   const pfsButton = document.querySelector('.prefilled-syringe');
const daijButton = document.querySelector('.disposable-autoinjector');
const dpButton = document.querySelector('.disposable-pen');
const volChartCard = document.querySelector('.volChartCard');
const valChartCard = document.querySelector('.valChartCard');
const aspChartCard = document.querySelector('.aspChartCard');
    
   if (!pfsButton.classList.contains('clicked-red') && !daijButton.classList.contains('clicked-red') && !dpButton.classList.contains('clicked-red')) {
     return;
   } else {
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
     let selectedButtons;


     //Need new conditions here
     //Combination 1
     //All three on
     if (pfsButton.classList.contains('clicked-red') && daijButton.classList.contains('clicked-red') && dpButton.classList.contains('clicked-red')) {
      selectedButtons = "ThreeDevices";
       generateCombinedChartThreeDevices({ device1: "Prefilled Syringe", device2: "Disposable autoinjector", device3: "Disposable pens"}, metric, selectedButtons);
    
     changeChartColumnColour(volume, e, "1", "4", "7");
     }


   //Combination 2
   //pfs on
   //daij on
   //dp off
   else if (pfsButton.classList.contains('clicked-red') && daijButton.classList.contains('clicked-red') && !dpButton.classList.contains('clicked-red')) {
     selectedButtons = "PfsAndDaij";
     generateCombinedChartTwoDevices({ device1: "Prefilled Syringe", device2: "Disposable autoinjector"}, metric, selectedButtons);
     changeChartColumnColour(volume, e, "1", "4", "7");
   }


   //Combination 3
     //pfs off
     //daij on
     //dp on
     else if (!pfsButton.classList.contains('clicked-red') && daijButton.classList.contains('clicked-red') && dpButton.classList.contains('clicked-red')) {
       selectedButtons = "DaijAndDp";
       generateCombinedChartTwoDevices({ device1: "Disposable autoinjector", device2: "Disposable pens"}, metric, selectedButtons);
       changeChartColumnColour(volume, e, "1", "4", "7");
     }


   //Combination 4 
   //pfs on
     //daij off
     //dp on
     else if (pfsButton.classList.contains('clicked-red') && !daijButton.classList.contains('clicked-red') && dpButton.classList.contains('clicked-red')) {
       console.log('I am combination 4');
       selectedButtons = "PfsAndDp";
       generateCombinedChartTwoDevices({ device1: "Prefilled Syringe", device2: "Disposable pens"}, metric, selectedButtons);
       changeChartColumnColour(volume, e, "1", "4", "7");
     }  


   //Combination 5
     // pfs on
     //daij off
     //dp off


   else if (pfsButton.classList.contains('clicked-red') && !daijButton.classList.contains('clicked-red') && !dpButton.classList.contains('clicked-red')) {
     selectedButtons = "Pfs";
     generateChart("Prefilled Syringe", metric, selectedButtons);
     changeChartColumnColour(volume, e, "0", "3", "6");
   }


 //Combination 6
     // pfs off
     //daij on
     //dp off


  
   else if (!pfsButton.classList.contains('clicked-red') && daijButton.classList.contains('clicked-red') && !dpButton.classList.contains('clicked-red')) {
     selectedButtons = "Daij";
     generateChart("Disposable autoinjector", metric, selectedButtons);
     changeChartColumnColour(volume, e, "1", "4", "7");
   }


   //Combination 7
   //pfs off
   //daij off
   //dp on


   else if (!pfsButton.classList.contains('clicked-red') && !daijButton.classList.contains('clicked-red') && dpButton.classList.contains('clicked-red')) {
     selectedButtons = "Dp";
     generateChart("Disposable pens", metric, selectedButtons);
     changeChartColumnColour(volume, e, "2", "5", "8");
   }
     chartCard.classList.remove('hidden');
   }


 }



