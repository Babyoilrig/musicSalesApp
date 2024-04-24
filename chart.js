export function showTable(data, metric) {
    let tableDiv;
 
 
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
        createTableInner(data, table, metric);
        getChartBox?.appendChild(tableDiv);
        tableDiv.appendChild(table);
 
 
   
    }
 
 
 export function createTableInner(data, tableName, metric) {
    let tHead = tableName.createTHead();
    tHead.insertRow(0);
    if (metric == 'vol') {
        for(let i = 0; i < data.labelsTop.length - 1; i++){
            tHead.rows[0].insertCell(i).innerText = data.labelsTop[i];
            //Just added
            tHead.rows[0].classList.add(`tableRow${i}`);
        };
        tHead.rows[0].insertCell(0).innerText = '';
        tHead.rows[0].insertCell(3).innerText = `${data.labelsTop[2]}F`;
        let tBody = tableName.createTBody();
   
        data.datasets.map((dataset, index) => {
            tBody.insertRow(index);
                for(let i = 0; i < data.datasets[0].data.length; i++) {
                    tBody.rows[index].insertCell(i).innerText = Math.round(dataset.data[i]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                };
       
               
                tBody.rows[index].insertCell(0).innerText = dataset.label; 
               
       })
 
 
    } else if (metric == 'val' || metric == 'asp') {
        for(let i = 0; i < data.labelsTop.length - 1; i++){
            tHead.rows[0].insertCell(i).innerText = data.labelsTop[i];
        };
        tHead.rows[0].insertCell(0).innerText = '';
        let tBody = tableName.createTBody();
   
        data.datasets.map((dataset, index) => {
            tBody.insertRow(index);
            for(let i = 0; i < data.datasets[0].data.length - 1; i++) {
                tBody.rows[index].insertCell(i).innerText = Math.round(dataset.data[i]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            tBody.rows[index].insertCell(0).innerText = dataset.label;
           
       })
    }
 
 
 
 
     
 
 
 }
 
 
 export function changeChartColumnColour(volume, e, colour1, colour2, colour3) {
        let table;
        const graphName = e.currentTarget.dataset.value;
        if (graphName == "vol-graph") {
            table = document.querySelector('.table-vol');
          } else if (graphName == "val-graph") {
            table = document.querySelector('.table-val');
          } else if (graphName == "asp-graph") {
            table = document.querySelector('.table-asp');
          }
 
 
       const firstColumn = table.querySelectorAll("td:nth-child(2)");
       firstColumn.forEach(cell => cell.style.backgroundColor = volume.data.datasets[`${colour1}`].backgroundColor);
       //Second column
       const secondColumn = table.querySelectorAll("td:nth-child(3)");
       secondColumn.forEach(cell => cell.style.backgroundColor = volume.data.datasets[`${colour2}`].backgroundColor);
       //Third column
       const thirdColumn = table.querySelectorAll("td:nth-child(4)");
       thirdColumn.forEach(cell => cell.style.backgroundColor = volume.data.datasets[`${colour3}`].backgroundColor);
   
 }
 
 
 
 
 