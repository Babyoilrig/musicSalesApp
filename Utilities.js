

export function divideByMillionBillionHundred(trendLineValues, metric, getMolecule, device) {
    let dividedNumbers = [];
    if (metric == 'vol') {
       dividedNumbers = trendLineValues.map(item => item / 1_000_000);
        return dividedNumbers;
    }
    //THIS ALSO NEEDS TOP HAVE BUTTON
    else if (metric === 'val' && getMolecule === "INSULIN ASPART" && device === "Prefilled Syringe") {
        dividedNumbers = trendLineValues.map(item => item / 1_000_000);
        return dividedNumbers;
    }
    else if (metric == 'val') {
        dividedNumbers = trendLineValues.map(item => item / 1_000_000_000);
        return dividedNumbers;
    }
    else if (metric == 'asp') {
        dividedNumbers = trendLineValues.map(item => item / 100 );
        return dividedNumbers;
    }
 }
 
 
 //Get data
 
 
 export async function fetchData(endpoint) {
    const response = await fetch(endpoint, {
        headers: {
            'Access-Control-Allow-Origin:': '*',
        }
    });
    let fetchedData = await response.json();
    return fetchedData;
  
  }

 
  //Give number positive or negative sign
   export function giveNumberPositiveOrNegativeSign(number)
 {
    if (number == 0) {
        return 0;
    } else if(number > 0){
        return "+" + number;
    } else if (number < 0) {
        return number;
    }
 }
 
 
 export function checkIfString(item) {
    if(typeof item == "string") {
        return 0;
    } else {
        return item;
    }
 }
 
 
 export function orderAlphabetically(arrayOfObjects) {
   
 // sort by name
 arrayOfObjects.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
 }
 
 
 export function removeBracketsFromName(moleculeSelectorValue) {
    console.log('I am removeBracketsFromName and I have run!');
    console.log(moleculeSelectorValue);
    const nameBracketsRemoved = moleculeSelectorValue.replace(/[()]/g,'')
    console.log(nameBracketsRemoved);
    return nameBracketsRemoved;
 
 
 }
 
 
 export function resetPage() {
    const volChartCard = document.querySelector('.volChartCard');
 const valChartCard = document.querySelector('.valChartCard');
 const aspChartCard = document.querySelector('.aspChartCard');
 
 
 volChartCard.classList.add('hidden');
  valChartCard.classList.add('hidden');
  aspChartCard.classList.add('hidden');
  const graphContainer1 = document.querySelector('.graph-container1');
 const graphContainer2 = document.querySelector('.graph-container2');
 const graphContainer3 = document.querySelector('.graph-container3');
 const pfsButton = document.querySelector('.prefilled-syringe');
 const daijButton = document.querySelector('.disposable-autoinjector');
 const dpButton = document.querySelector('.disposable-pen');
 const aspTitle = document.querySelector('.graph-title3');
  //2 Lines below just added
 aspTitle.classList.add('hidden');
 graphContainer3.classList.add('hidden');
 
 
  graphContainer1.classList.remove('hidden');
  graphContainer2.classList.remove('hidden');
  pfsButton.classList.remove('clicked-red');
  daijButton.classList.remove('clicked-red');
  dpButton.classList.remove('clicked-red');
  pfsButton.disabled = false;
  daijButton.disabled = false;
  dpButton.disabled = false;
   }
 
 
 
 
 
 