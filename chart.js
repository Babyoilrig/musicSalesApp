import calculateCAGR from './cagr';


export function showTable(data, metric, cagrArrayForTables, selectedButtons) {
   let tableDiv;
   // console.log('I am showTable and I have run!');
  
   //Here need to add functionality to make Insulin Aspart val chart wider


   let getChartBoxClass = `.${metric}ChartBox`;
   let chartCardClass = `.${metric}ChartCard`;
   let tableId = `${metric}TableDiv`;
   let tableClass = `table-${metric}`;


   const getChartBox = document.querySelector(getChartBoxClass);
   const getTableDiv = document.getElementsByName('tableDiv');
 
   if (getChartBox?.children.length === undefined || getChartBox.children.length > 0) {
       const ChartCard = document.querySelector(chartCardClass);
       getChartBox.innerHTML = "";
  
   }
       tableDiv = document.createElement('div');
       tableDiv.setAttribute('id', tableId);
       const table = document.createElement('table');
       table.classList.add(tableClass);
       table.classList.add('table');
       createTableInner(data, table, metric, cagrArrayForTables, selectedButtons);
       getChartBox?.appendChild(tableDiv);
       tableDiv.appendChild(table);


  
   }


   export function createTableInner(data, tableName, metric, cagrArrayForTables, selectedButtons) {
       // console.log('I am create table inner and I have run!');
       let cagrArrayForMetric;
      
       //Next need to make new column at the end - and pass the data to it that is required


       const yearTotals = findYearTotals(data);
       let tHead = tableName.createTHead();
       tHead.insertRow(0);
       //METRIC VOL


       if (metric == 'vol') {
           cagrArrayForMetric = cagrArrayForTables[0];
           for(let i = 0; i < data.labelsTop.length - 1; i++){
               tHead.rows[0].insertCell(i).innerText = data.labelsTop[i];
               tHead.rows[0].classList.add(`tableRow${i}`);
           };
           tHead.rows[0].insertCell(0).innerText = '';
           tHead.rows[0].insertCell(3).innerText = `${data.labelsTop[2]}F`;
           tHead.rows[0].insertCell(4).innerText = 'Growth Rate';
           let tBody = tableName.createTBody();
      
           data.datasets.map((dataset, index) => {
               tBody.insertRow(index);
                   for(let i = 0; i < data.datasets[0].data.length; i++) {
                       tBody.rows[index].insertCell(i).innerText = Math.round(dataset.data[i]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                   };
                   tBody.rows[index].insertCell(0).innerText = dataset.label;
                  
          })
          addYearlyTotalsToChart(yearTotals, tBody, metric);
          const growthColumnCells = addExtraColumnToTable(metric, tableName, tBody, yearTotals);
          //Here!!
          populateGrowthColumnInTable(selectedButtons, cagrArrayForMetric, growthColumnCells, metric);
 
   //METRIC VAL
       } else if (metric == 'val') {
           // console.log('I am the else if statment for val metric!');
           cagrArrayForMetric = cagrArrayForTables[1];
           // console.log(cagrArrayForMetric);
           tHead.rows[0].insertCell(0).innerText = `${data.labelsTop[0]}`;
           tHead.rows[0].insertCell(1).innerText = `${data.labelsTop[1]}`;
           tHead.rows[0].insertCell(2).innerText = `Growth Rate`;


           tHead.rows[0].insertCell(0).innerText = '';
           let tBody = tableName.createTBody();
          
           data.datasets.map((dataset, index) => {
               tBody.insertRow(index);
               for(let i = 0; i < data.datasets[0].data.length - 1; i++) {
                   tBody.rows[index].insertCell(i).innerText = Math.round(dataset.data[i]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
               };
               tBody.rows[index].insertCell(0).innerText = dataset.label;
             
       });
       addYearlyTotalsToChart(yearTotals, tBody, metric);
       const growthColumnCells = addExtraColumnToTable(metric, tableName, tBody, yearTotals);
       // console.log(growthColumnCells);
       populateGrowthColumnInTable(selectedButtons, cagrArrayForMetric, growthColumnCells, metric);
       // console.log(growthColumnCells);


       //METRIC ASP
       } else if (metric == 'asp') {
           cagrArrayForMetric = cagrArrayForTables[2];
           // console.log(cagrArrayForMetric);
           tHead.rows[0].insertCell(0).innerText = `${data.labelsTop[0]}`;
           tHead.rows[0].insertCell(1).innerText = `${data.labelsTop[1]}`;
           tHead.rows[0].insertCell(2).innerText = `Growth Rate`;


           tHead.rows[0].insertCell(0).innerText = '';
           let tBody = tableName.createTBody();
      
           data.datasets.map((dataset, index) => {
               tBody.insertRow(index);
               for(let i = 0; i < data.datasets[0].data.length - 1; i++) {
                   tBody.rows[index].insertCell(i).innerText = Math.round(dataset.data[i]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
               };
               tBody.rows[index].insertCell(0).innerText = dataset.label;
             
       });
       addYearlyTotalsToChart(yearTotals, tBody, metric);
       const growthColumnCells = addExtraColumnToTable(metric, tableName, tBody, yearTotals);
       // console.log(growthColumnCells);
       populateGrowthColumnInTable(selectedButtons, cagrArrayForMetric, growthColumnCells, metric);
      
       }
       }
      
      
export function changeChartColumnColour(volume, e, colour1, colour2, colour3) {
       let table;
       const graphName = e.currentTarget.dataset.value;
       // console.log(graphName);
       if (graphName == "vol-graph") {
           // console.log(graphName);
           table = document.querySelector('.table-vol');
           //First column
           const firstColumn = table.querySelectorAll("td:nth-child(2)");
              firstColumn.forEach(cell => cell.style.backgroundColor = volume.data.datasets[`${colour1}`].backgroundColor);
              //Second column
              const secondColumn = table.querySelectorAll("td:nth-child(3)");
              secondColumn.forEach(cell => cell.style.backgroundColor = volume.data.datasets[`${colour2}`].backgroundColor);
              //Third column
              const thirdColumn = table.querySelectorAll("td:nth-child(4)");
              thirdColumn.forEach(cell => cell.style.backgroundColor = volume.data.datasets[`${colour3}`].backgroundColor);
         } else if (graphName == "val-graph") {
           // console.log(graphName);
           table = document.querySelector('.table-val');
           //First column
           const firstColumn = table.querySelectorAll("td:nth-child(2)");
              firstColumn.forEach(cell => cell.style.backgroundColor = volume.data.datasets[`${colour1}`].backgroundColor);
              //Second column
              const secondColumn = table.querySelectorAll("td:nth-child(3)");
              secondColumn.forEach(cell => cell.style.backgroundColor = volume.data.datasets[`${colour2}`].backgroundColor);
              //Third column
              const thirdColumn = table.querySelectorAll("td:nth-child(4)");
              thirdColumn.forEach(cell => cell.style.backgroundColor = 'white');
         } else if (graphName == "asp-graph") {
           // console.log(graphName);
           table = document.querySelector('.table-asp');
           //First column
           const firstColumn = table.querySelectorAll("td:nth-child(2)");
              firstColumn.forEach(cell => cell.style.backgroundColor = volume.data.datasets[`${colour1}`].backgroundColor);
              //Second column
              const secondColumn = table.querySelectorAll("td:nth-child(3)");
              secondColumn.forEach(cell => cell.style.backgroundColor = volume.data.datasets[`${colour2}`].backgroundColor);
              //Third column
              const thirdColumn = table.querySelectorAll("td:nth-child(4)");
              thirdColumn.forEach(cell => cell.style.backgroundColor = 'white');
         }


    
  
}




function findYearTotals(data) {
   let totalsArray = [];
   let arrayAaa = [];
   let arrayEurope = [];
   let arrayLatinAmerica = [];
   let arrayNorthAmerica = []
   data.datasets[0].data.forEach(item => arrayAaa.push(item));
   data.datasets[1].data.forEach(item => arrayEurope.push(item));
   data.datasets[2].data.forEach(item => arrayLatinAmerica.push(item));
   data.datasets[3].data.forEach(item => arrayNorthAmerica.push(item));
   totalsArray.push(arrayAaa, arrayEurope, arrayLatinAmerica, arrayNorthAmerica);


   const totalsCombined = totalsArray.reduce((a, b) => a.map((v, i) => v + b[i]));
   return totalsCombined;
  
}




function addYearlyTotalsToChart(yearTotals, tBody, metric) {
  
   if (metric == 'vol') {
     
  let newRow = tBody.insertRow();
 
  yearTotals.forEach((item, index) => {
      let cell = newRow.insertCell(index);
      cell.innerText = item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  });
  let newCellTotal = newRow.insertCell(0);
  newCellTotal.innerText = 'Total';


} else if (metric == 'val') {
   let newRow = tBody.insertRow();
  let newCellTotal = newRow.insertCell(0);
  newCellTotal.innerText = 'Total';
 
  for(let i = 0; i < yearTotals.length - 1; i++) {
      let cell = newRow.insertCell();
   cell.innerText = yearTotals[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


  }
}
};


function addExtraColumnToTable(metric, tableName, tBody, yearTotals) {
   // console.log('I am addExtraColumnToTable and I have run!');
   let rowNumber;
   let growthColumn = [];
   let checkedForZeroValue;


   const growth1 = tBody.rows[0].insertCell(rowNumber);
   const growth2 = tBody.rows[1].insertCell(rowNumber);
   const growth3 = tBody.rows[2].insertCell(rowNumber);
   const growth4 = tBody.rows[3].insertCell(rowNumber);
   growthColumn.push(growth1, growth2, growth3, growth4);
   if (metric == "asp"){
       return growthColumn;
   } else if (metric == "vol") {
   const totalCagrPercentageVol = calculateCagrForTotalsRow(yearTotals, metric);
   // console.log('Total cagr percentage vol is:');
   // console.log(totalCagrPercentageVol);
   //Here i think we need to check for zero and then change to 'N/A'
   checkedForZeroValue = checkForCagrZeroAndChangeToNotApplicable(totalCagrPercentageVol);
   // console.log(checkedForZeroValue);


   const growth5 = tBody.rows[4].insertCell(rowNumber);
   growthColumn.push(growth5);
   if(checkedForZeroValue[0] === "N/A") {
       growth5.innerText = `${checkedForZeroValue}`;
   } else {
       growth5.innerText = `${checkedForZeroValue}%`;
   }
  
  
   return growthColumn;


   } else if(metric == "val") {
       // console.log(growthColumn);
   const totalCagrPercentageVal = calculateCagrForTotalsRow(yearTotals, metric);
   // console.log(totalCagrPercentageVal);


   checkedForZeroValue = checkForCagrZeroAndChangeToNotApplicable(totalCagrPercentageVal);
   // console.log(checkedForZeroValue);


   const growth5 = tBody.rows[4].insertCell(rowNumber);
   growthColumn.push(growth5);
   // console.log(checkedForZeroValue);
   if(checkedForZeroValue[0] === "N/A") {
       growth5.innerText = `${checkedForZeroValue}`;
   } else {
       growth5.innerText = `${checkedForZeroValue}%`;
   }




   return growthColumn;
   }
  
  
}


function populateGrowthColumnInTable(selectedButtons, cagrArrayForMetric, growthColumnCells, metric) {
   // console.log('I am populateGrowthColumnInTable and I have run!');
   // console.log(growthColumnCells);
   let cagrValuesToInputIntoTable;
   let cagrValuesToInputIntoTableArray = [];
   let cagrVariableForSearching;
   cagrVariableForSearching = `${metric}${selectedButtons}`;
       cagrValuesToInputIntoTable = cagrArrayForMetric[cagrVariableForSearching];
      
   // console.log(cagrValuesToInputIntoTable);


for (let [key, value] of Object.entries(cagrValuesToInputIntoTable)) {


   if(value === 0){
       value = 'N/A'
   };


 cagrValuesToInputIntoTableArray.push(`${value}`);




   cagrValuesToInputIntoTableArray.forEach((value, index) => {
       if (index < growthColumnCells.length) {
           if(value === "N/A") {
               growthColumnCells[index].textContent = `${value}`;
           } else {
               growthColumnCells[index].textContent = `${value}%`;
           }
          
       }
   });
}
// console.log(cagrValuesToInputIntoTableArray);
}


function calculateCagrForTotalsRow(yearTotals, metric) {
 
   // console.log('I am calculateCagrForTotalsRow and I have run!');
   // console.log(metric);
   let beginningValue = [];
   let endingValue = [];
   let numberOfYears;
   let cagrForTotal;
   let isTotal;
   // console.log(yearTotals);
   if(metric === 'vol') {
       isTotal = 'true';
       numberOfYears = 2;
//Here - is a check (for vol) if the yrear 1 value is zero, it will use the year 2 value.
if (yearTotals[0] === 0) {
   beginningValue.push(yearTotals[1]);
} else {
   beginningValue.push(yearTotals[0]);
}


       endingValue.push(yearTotals[2]);
       // console.log(beginningValue);
       // console.log(endingValue);
       cagrForTotal = calculateCAGR(beginningValue, endingValue, numberOfYears, metric, isTotal);
       // console.log(cagrForTotal);
       return cagrForTotal;
   } if (metric === 'val') {
       isTotal = 'true';
       numberOfYears = 1;
       beginningValue.push(yearTotals[0]);
       endingValue.push(yearTotals[1]);
       // console.log(beginningValue);
       // console.log(endingValue);
       cagrForTotal = calculateCAGR(beginningValue, endingValue, numberOfYears, metric, isTotal);
       // console.log(cagrForTotal);
       return cagrForTotal;
   }
 


}


//Here function to check for zero - if zero - change to 'N/A'




function checkForCagrZeroAndChangeToNotApplicable(array) {
   // console.log('I am checkForCagrZeroAndChangeToNotApplicable and I have run!')
   array.forEach((item, index) => {
       if(array[index] === 0) {
           //This line needs changing below - maybe need to push it in or something...


           array[index] = "N/A";
       }
   }
   )
   // console.log(array);
   return array;
}




 