//Transform data function


import { get } from "lodash-es";



function checkDataExistsAndFindData(passedData, region, year, measurement) {
 if(!passedData) {
  return 0;
} else if (!passedData.region[region]){
 return 0;
} else {
 const foundData = get(passedData.region[region][measurement].find(item => item.year === year), "value", '')
 return foundData;
}
}


export function transformData({containers}, primaryContainer, measurement) {
 const passedData = containers.find(item => item.primaryContainer === primaryContainer);


   return {
       labelsTop: ["2021", "2022", "2023"],
 


   datasets: [
   {
       label: "AAA",
       data: [
         checkDataExistsAndFindData(passedData, 'AAA', '2021', measurement),
         checkDataExistsAndFindData(passedData, 'AAA', '2022', measurement),
         checkDataExistsAndFindData(passedData, 'AAA', '2023', measurement),
   ],
   },
   {
       label: "Europe",
       data: [
         checkDataExistsAndFindData(passedData, 'EUROPE', '2021', measurement),
         checkDataExistsAndFindData(passedData, 'EUROPE', '2022', measurement),
         checkDataExistsAndFindData(passedData, 'EUROPE', '2023', measurement),
          
   ],
   },
   {
       label: "Latin Am.",
       data: [
         checkDataExistsAndFindData(passedData, 'LATINAMERICA', '2021', measurement),
         checkDataExistsAndFindData(passedData, 'LATINAMERICA', '2022', measurement),
         checkDataExistsAndFindData(passedData, 'LATINAMERICA', '2023', measurement),
        
          
   ],
   },
   {
       label: "North Am.",
       data: [
         checkDataExistsAndFindData(passedData, 'NORTHAMERICA', '2021', measurement),
         checkDataExistsAndFindData(passedData, 'NORTHAMERICA', '2022', measurement),
         checkDataExistsAndFindData(passedData, 'NORTHAMERICA', '2023', measurement),
   ],
   },
   ]
   }
}


export function combineDataTwoDatasets(dataset1, dataset2){
   return {
     labelsTop: ["2021", "2022", "2023"],
      datasets: [
       {
           label: "AAA",
           data: [
             dataset1.datasets.find(item => item.label === "AAA").data[0] + dataset2.datasets.find(item => item.label === "AAA").data[0],
             dataset1.datasets.find(item => item.label === "AAA").data[1] + dataset2.datasets.find(item => item.label === "AAA").data[1],
             dataset1.datasets.find(item => item.label === "AAA").data[2] + dataset2.datasets.find(item => item.label === "AAA").data[2],
            
           ],
       },
       {
           label: "Europe",
           data: [
             dataset1.datasets.find(item => item.label === "Europe").data[0] + dataset2.datasets.find(item => item.label === "Europe").data[0],
             dataset1.datasets.find(item => item.label === "Europe").data[1] + dataset2.datasets.find(item => item.label === "Europe").data[1],
             dataset1.datasets.find(item => item.label === "Europe").data[2] + dataset2.datasets.find(item => item.label === "Europe").data[2],
           ],
       },
       {
           label: "Latin Am.",
           data: [
             dataset1.datasets.find(item => item.label === "Latin Am.").data[0] + dataset2.datasets.find(item => item.label === "Latin Am.").data[0],
             dataset1.datasets.find(item => item.label === "Latin Am.").data[1] + dataset2.datasets.find(item => item.label === "Latin Am.").data[1],
             dataset1.datasets.find(item => item.label === "Latin Am.").data[2] + dataset2.datasets.find(item => item.label === "Latin Am.").data[2],
            
           ],
       },
       {
           label: "North Am.",
           data: [
             dataset1.datasets.find(item => item.label === "North Am.").data[0] + dataset2.datasets.find(item => item.label === "North Am.").data[0],
             dataset1.datasets.find(item => item.label === "North Am.").data[1] + dataset2.datasets.find(item => item.label === "North Am.").data[1],
             dataset1.datasets.find(item => item.label === "North Am.").data[2] + dataset2.datasets.find(item => item.label === "North Am.").data[2],
           ],
       },
     ]
   }
 }
  export function combineDataThreeDatasets(dataset1, dataset2, dataset3){
   return {
     labelsTop: ["2021", "2022", "2023"],
      datasets: [
       {
           label: "AAA",
           data: [
             dataset1.datasets.find(item => item.label === "AAA").data[0] + dataset2.datasets.find(item => item.label === "AAA").data[0] + dataset3.datasets.find(item => item.label === "AAA").data[0],
             dataset1.datasets.find(item => item.label === "AAA").data[1] + dataset2.datasets.find(item => item.label === "AAA").data[1] + dataset3.datasets.find(item => item.label === "AAA").data[1],
             dataset1.datasets.find(item => item.label === "AAA").data[2] + dataset2.datasets.find(item => item.label === "AAA").data[2] + dataset3.datasets.find(item => item.label === "AAA").data[2],
           ],
       },
       {
           label: "Europe",
           data: [
             dataset1.datasets.find(item => item.label === "Europe").data[0] + dataset2.datasets.find(item => item.label === "Europe").data[0] + dataset3.datasets.find(item => item.label === "Europe").data[0],
             dataset1.datasets.find(item => item.label === "Europe").data[1] + dataset2.datasets.find(item => item.label === "Europe").data[1] + dataset3.datasets.find(item => item.label === "Europe").data[1],
             dataset1.datasets.find(item => item.label === "Europe").data[2] + dataset2.datasets.find(item => item.label === "Europe").data[2] + dataset3.datasets.find(item => item.label === "Europe").data[2],
           ],
       },
       {
           label: "Latin Am.",
           data: [
             dataset1.datasets.find(item => item.label === "Latin Am.").data[0] + dataset2.datasets.find(item => item.label === "Latin Am.").data[0] + dataset3.datasets.find(item => item.label === "Latin Am.").data[0],
             dataset1.datasets.find(item => item.label === "Latin Am.").data[1] + dataset2.datasets.find(item => item.label === "Latin Am.").data[1] + dataset3.datasets.find(item => item.label === "Latin Am.").data[1],
             dataset1.datasets.find(item => item.label === "Latin Am.").data[2] + dataset2.datasets.find(item => item.label === "Latin Am.").data[2] + dataset3.datasets.find(item => item.label === "Latin Am.").data[2],
            
           ],
       },
       {
           label: "North Am.",
           data: [
             dataset1.datasets.find(item => item.label === "North Am.").data[0] + dataset2.datasets.find(item => item.label === "North Am.").data[0] + dataset3.datasets.find(item => item.label === "North Am.").data[0],
             dataset1.datasets.find(item => item.label === "North Am.").data[1] + dataset2.datasets.find(item => item.label === "North Am.").data[1] + dataset3.datasets.find(item => item.label === "North Am.").data[1],
             dataset1.datasets.find(item => item.label === "North Am.").data[2] + dataset2.datasets.find(item => item.label === "North Am.").data[2] + dataset3.datasets.find(item => item.label === "North Am.").data[2],
           ],
       },
     ]
   }
 }
 //This function it to find the 2023 data for forecasted
export function find2023DataforForcasted({containers}, primaryContainer, measurement) {
 const passedData = containers.find(item => item.primaryContainer === primaryContainer);
 return [
 checkDataExistsAndFindData(passedData, 'AAA', '2023', measurement),
 checkDataExistsAndFindData(passedData, 'EUROPE', '2023', measurement),
 checkDataExistsAndFindData(passedData, 'LATINAMERICA', '2023', measurement),
 checkDataExistsAndFindData(passedData, 'NORTHAMERICA', '2023', measurement),
 ]


 }
