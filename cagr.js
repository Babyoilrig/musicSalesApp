import { divideByMillionBillionHundred, giveNumberPositiveOrNegativeSign } from './Utilities';


 
  //Function to calculate CAGR
  export default function calculateCAGR(beginningValues, endingValues, numberOfYears, metric, isTotal, getMolecule, device) {
   if(isTotal === 'true') {
  
  
   //Here taking two arrays and making them into one array of arrays - like this [[beginningVal, endingVal], [beginningVal, endingVal]] etc
  
   //Making endingPoints
   let endingPoints = [];
   let cagrPercentageArray = [];
   let cagrPercentageRounded;
   let beginningValue;
   let endingValue;
   let endingLinePointRounded;




   let arrayOfBeginningAndEndingValues = beginningValues.map((element, index) => [element, endingValues[index]]);
  
   arrayOfBeginningAndEndingValues.map((element, index) => {
         beginningValue = element[0];
         endingValue = element[1];
       })
    
    
     if (beginningValue <= 0 || endingValue <= 0 || numberOfYears <= 0) {
       endingLinePointRounded = 0;
       cagrPercentageRounded = 0;
       endingPoints.push(endingLinePointRounded);
       cagrPercentageArray.push(cagrPercentageRounded);




     } else {
       const cagr = (Math.pow(endingValue / beginningValue, 1 / numberOfYears) - 1);


       ///////////////////////////////////////////////
       //THIS SECTION IS FINDING % NUMBER FOR LINE
       const cagrPercentage = cagr * 100;


       cagrPercentageRounded = cagrPercentage.toFixed(2);


       //Here need to give cagr positive or negative sign
       const cagrPositiveOrNegativeRounded = giveNumberPositiveOrNegativeSign(cagrPercentageRounded);
       cagrPercentageArray.push(cagrPositiveOrNegativeRounded);
       


      


       /////////////////////////////////////////////////
     
     }
    
    
  
  
   return cagrPercentageArray;
 } else if (isTotal === 'false'){
    //Here taking two arrays and making them into one array of arrays - like this [[beginningVal, endingVal], [beginningVal, endingVal]] etc
  
   //Making endingPoints
   let endingPoints = [];
   let cagrPercentageArray = [];
   let endingLinePointRounded;
   let cagrPercentageRounded;
   let arrayOfBeginningAndEndingValues = beginningValues.map((element, index) => [element, endingValues[index]]);
  
   //Here going through the array of arrays and defining the first entry of each array as beginning value, and second as endingValue
   arrayOfBeginningAndEndingValues.map((element, index) => {
     const beginningValue = element[0];
     const endingValue = element[1];
    
    
    
     if (beginningValue <= 0 || endingValue <= 0 || numberOfYears <= 0) {
       endingLinePointRounded = 0;
       cagrPercentageRounded = 0;
       endingPoints.push(endingLinePointRounded);
       cagrPercentageArray.push(cagrPercentageRounded);




     } else {
       // console.log(`I am the else statement and I have run!`);
       const cagr = (Math.pow(endingValue / beginningValue, 1 / numberOfYears) - 1);
       const beginningValueMultipliedByCagr = beginningValue * cagr;


       ///////////////////////////////////////////////
       //THIS SECTION IS FINDING % NUMBER FOR LINE
       const cagrPercentage = cagr * 100;


       cagrPercentageRounded = cagrPercentage.toFixed(2);


       //Here need to give cagr positive or negative sign
       const cagrPositiveOrNegativeRounded = giveNumberPositiveOrNegativeSign(cagrPercentageRounded);
       cagrPercentageArray.push(cagrPositiveOrNegativeRounded);




      


       /////////////////////////////////////////////////


       const endingGraphPointAfterCagrIncluded = (beginningValue + beginningValueMultipliedByCagr);
       endingLinePointRounded = endingGraphPointAfterCagrIncluded.toFixed(4);


       endingPoints.push(endingLinePointRounded);
     
     }
    
    
   });


  
   const dividedNumbers = divideByMillionBillionHundred(endingPoints, metric, getMolecule, device);
  


   let endingPointsWithKeys = {};
       const keyArray = ["aaa", "europe", "latinAmerica", "northAmerica"];
       keyArray.forEach((key, i) => endingPointsWithKeys[key] = dividedNumbers[i].toFixed(4));


   let cagrPercentageWithKeys = {};
   keyArray.forEach((key, i) => cagrPercentageWithKeys[key] = cagrPercentageArray[i]);


       let endingPointsWithKeysAndCagrPercentage = [];
       endingPointsWithKeysAndCagrPercentage.push(endingPointsWithKeys, cagrPercentageWithKeys);


       return endingPointsWithKeysAndCagrPercentage;


 }


}













