
  


import calculateCAGR from './cagr';
import { checkIfString } from './Utilities';


export function findSingularBeginningAndEndingValuesforCAGR() {
   beginningAndEndingValuesPfsVol = generateDataforTrendlineOneDevice('Prefilled Syringe', 'vol');
   beginningAndEndingValuesPfsVal = generateDataforTrendlineOneDevice('Prefilled Syringe', 'val');
   beginningAndEndingValuesPfsAsp = generateDataforTrendlineOneDevice('Prefilled Syringe', 'asp');
  
    //Getting trendline data for Daij
   beginningAndEndingValuesDaijVol = generateDataforTrendlineOneDevice('Disposable autoinjector', 'vol');
   beginningAndEndingValuesDaijVal = generateDataforTrendlineOneDevice('Disposable autoinjector', 'val');
   beginningAndEndingValuesDaijAsp = generateDataforTrendlineOneDevice('Disposable autoinjector', 'asp');
    //Getting trendline data for Dp
   beginningAndEndingValuesDpVol = generateDataforTrendlineOneDevice('Disposable pens', 'vol');
   beginningAndEndingValuesDpVal = generateDataforTrendlineOneDevice('Disposable pens', 'val');
   beginningAndEndingValuesDpAsp = generateDataforTrendlineOneDevice('Disposable pens', 'asp');
 }


export function findBeginningValuesForCAGRFunction(transformedData, metric, device) {
   let aaaYear1;
   let europeYear1;
   let latinAmericaYear1;
   let northAmericaYear1;
   let checkIfFirstDataPointIsZero = [];
   let checkAaaYear1;
   let checkEuropeYear1;
   let checkLatinAmericaYear1;
   let checkNorthAmericaYear1;




   if (metric === 'vol') {
       checkAaaYear1 = checkIfString(transformedData.datasets[0].data[0]);
       checkEuropeYear1 = checkIfString(transformedData.datasets[1].data[0]);
       checkLatinAmericaYear1 = checkIfString(transformedData.datasets[2].data[0]);
       checkNorthAmericaYear1 = checkIfString(transformedData.datasets[3].data[0]);


       if (checkAaaYear1 === 0) {
           aaaYear1 = checkIfString(transformedData.datasets[0].data[1]);
       } else {
           aaaYear1 = checkIfString(transformedData.datasets[0].data[0]);
       }


       if (checkEuropeYear1 === 0) {
           europeYear1 = checkIfString(transformedData.datasets[1].data[1]);
       } else {
           europeYear1 = checkIfString(transformedData.datasets[1].data[0]);
       }


       if (checkLatinAmericaYear1 === 0) {
           latinAmericaYear1 = checkIfString(transformedData.datasets[2].data[1]);
       } else {
           latinAmericaYear1 = checkIfString(transformedData.datasets[2].data[0]);
       }


       if (checkNorthAmericaYear1 === 0) {
           northAmericaYear1 = checkIfString(transformedData.datasets[3].data[1]);
       } else {
           northAmericaYear1 = checkIfString(transformedData.datasets[3].data[0]);
       }
       //Below - just for vol - putting the initial year 1 values (before they were checked and possibly changed for the
       //year two values) into an array
       checkIfFirstDataPointIsZero.push(checkAaaYear1, checkEuropeYear1, checkLatinAmericaYear1, checkNorthAmericaYear1);


   } else {
      
       aaaYear1 = checkIfString(transformedData.datasets[0].data[0]);
       europeYear1 = checkIfString(transformedData.datasets[1].data[0]);
       latinAmericaYear1 = checkIfString(transformedData.datasets[2].data[0]);
       northAmericaYear1 = checkIfString(transformedData.datasets[3].data[0]);
   }
       let beginningValues = [];
       beginningValues.push(aaaYear1, europeYear1, latinAmericaYear1, northAmericaYear1);
      
       let beginningValuesAndCheckFirstDataPoint = [];


       //Here creating array with two rows
       //For vol - row 2 will be the initial starting values for year 1
       //For val and asp - it will be an empty array
      
       beginningValuesAndCheckFirstDataPoint.push(beginningValues, checkIfFirstDataPointIsZero);
       return beginningValuesAndCheckFirstDataPoint;
      


   }




   export function findEndingValuesForCAGRFunction(transformedData, metric){
       let aaaLastYear;
       let europeLastYear;
       let latinAmericaLastYear;
       let northAmericaLastYear;


       if (metric == 'vol') {
           aaaLastYear = checkIfString(transformedData.datasets[0].data[transformedData.datasets[0].data.length - 1]);
           europeLastYear = checkIfString(transformedData.datasets[1].data[transformedData.datasets[1].data.length - 1]);
           latinAmericaLastYear = checkIfString(transformedData.datasets[2].data[transformedData.datasets[2].data.length - 1]);
           northAmericaLastYear = checkIfString(transformedData.datasets[3].data[transformedData.datasets[3].data.length - 1]);
         
       } else if (metric == 'val' || metric == 'asp' ) {
               aaaLastYear = checkIfString(transformedData.datasets[0].data[transformedData.datasets[0].data.length - 2]);
               europeLastYear = checkIfString(transformedData.datasets[1].data[transformedData.datasets[1].data.length - 2]);
               latinAmericaLastYear = checkIfString(transformedData.datasets[2].data[transformedData.datasets[2].data.length - 2]);
               northAmericaLastYear = checkIfString(transformedData.datasets[3].data[transformedData.datasets[3].data.length - 2]);
       }
      


  
       let endingValues = [];
       endingValues.push(aaaLastYear, europeLastYear, latinAmericaLastYear, northAmericaLastYear);


       return endingValues;
   }
  
 


  


  























