

export function divideByMillionBillionHundred(trendLineValues, metric) {
    let dividedNumbers = [];
    if (metric == 'vol') {
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
    const response = await fetch(endpoint);
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
 
 
 