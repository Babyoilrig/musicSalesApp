import { removeBracketsFromName } from "./Utilities";


const safetyDevice = [
   "DENOSUMAB",
   "FILGRASTIM",
   "MEPOLIZUMAB",
   "OMALIZUMAB",
];


const pens = [
   "FOLLITROPIN ALFA",
   "INSULIN ASPART",
   "INSULIN GLARGINE",
   "INSULIN LISPRO",
   "LIRAGLUTIDE SAXENDA",
   "LIRAGLUTIDE VICTOZA",
   "SEMAGLUTIDE OZEMPIC",
   "SEMAGLUTIDE WEGOVY",
   "SOMATROPIN",
   "TERIPARATIDE",


];


const wearableDevice = [
   "USTEKINUMAB",
];


//Product recommendations boxes info


const hypakOrNeopakPhysiojectAndUltrasafe = [
   "INFLIXIMAB",
   "TOCILIZUMAB",
   "GOLIMUMAB",
   "DARBEPOETIN ALFA",
];


const hypakOrNeopakPhysiojectAndVystra = [
   "SEMAGLUTIDE WEGOVY",
];


const hypakOrNeopakAndPhysioject = [
   "ADALIMUMAB",
   "ETANERCEPT",
   "ABATACEPT",
   "ALIROCUMAB",
   "EVOLOCUMAB",
   "IXEKIZUMAB",
   "ERENUMAB",
   "GALCANEZUMAB",
   "SUMATRIPTAN",
   "DULAGLUTIDE",
   "TRIZEPATIDE",
];


const hypakOrNeopakAndUltrasafe = [
   "CERTOLIZUMAB PEGOL",
   "VEDOLIZUMAB",
   "USTEKINUMAB",
   "MEPOLIZUMAB",
   "DUPILUMAB",
   "FILGRASTIM",
   "DENOSUMAB",
];


const justHypakOrNeopak = [
   "BENRALIZUMAB",
   "GLATIRAMER ACETATE",
];


const justVystra = [
   "INSULIN GLARGINE",
   "INSULIN LISPO",
   "INSULIN ASPART",
   "TERIPARATIDE",
   "SOMATROPIN",
   "FOLLITROPIN ALFA",
   "LIRAGLUTIDE VICTOZA",
   "LIRAGLUTIDE SAXENDA",
   "SEMAGLUTIDE OZEMPIC",
];












let deviceName;




export function photoOfWhatDevice(moleculeSelectorValue) {
  
   if (safetyDevice.find((item) => item === moleculeSelectorValue)){
       // console.log('I am a safety device!');
       deviceName = "Safety Device";
       return deviceName;
   } else if (pens.find((item) => item === moleculeSelectorValue)) {
       // console.log('I am a pen!');
       deviceName = "Pen";
       return deviceName;
   } else if (wearableDevice.find((item) => item === moleculeSelectorValue)) {
       // console.log('I am a wearable device!')
       deviceName = "Wearable Device";
       return deviceName;
   } else {
       console.log('I am an autoinjector');
       deviceName = "Autoinjector";
       return deviceName;
   }
}


/////Product Opportunities
const productBox1 = document.querySelector('.medicine-container1'); //Hypak
const productBox2 = document.querySelector('.medicine-container2'); //Neopak
const productBox3 = document.querySelector('.medicine-container3'); //Physioject
const productBox4 = document.querySelector('.medicine-container4'); //Vystra
const productBox5 = document.querySelector('.medicine-container5'); //Ultrasafe


export function showAndHideProductBoxes(moleculeSelectorValue) {
   let revisedMoleculeSelectorValue;
   if(moleculeSelectorValue.includes("(" || ")")) {
       revisedMoleculeSelectorValue = removeBracketsFromName(moleculeSelectorValue).toUpperCase();
   } else {
       revisedMoleculeSelectorValue = moleculeSelectorValue;
   }


   if (hypakOrNeopakPhysiojectAndUltrasafe.find((item) => item === revisedMoleculeSelectorValue)){
       productBox1.classList.remove('hidden');
       productBox2.classList.remove('hidden');
       productBox3.classList.remove('hidden');
       productBox4.classList.add('hidden');
       productBox5.classList.remove('hidden');
} else if (hypakOrNeopakPhysiojectAndVystra.find((item) => item === revisedMoleculeSelectorValue)){
       productBox1.classList.remove('hidden');
       productBox2.classList.remove('hidden');
       productBox3.classList.remove('hidden');
       productBox4.classList.remove('hidden');
       productBox5.classList.add('hidden');
} else if (hypakOrNeopakAndPhysioject.find((item) => item === revisedMoleculeSelectorValue)){
   productBox1.classList.remove('hidden');
   productBox2.classList.remove('hidden');
   productBox3.classList.remove('hidden');
   productBox4.classList.add('hidden');
   productBox5.classList.add('hidden');
} else if (hypakOrNeopakAndUltrasafe.find((item) => item === revisedMoleculeSelectorValue)) {
   productBox1.classList.remove('hidden');
   productBox2.classList.remove('hidden');
   productBox3.classList.add('hidden');
   productBox4.classList.add('hidden');
   productBox5.classList.remove('hidden');
} else if (justHypakOrNeopak.find((item) => item === revisedMoleculeSelectorValue)) {
   productBox1.classList.remove('hidden');
   productBox2.classList.remove('hidden');
   productBox3.classList.add('hidden');
   productBox4.classList.add('hidden');
   productBox5.classList.add('hidden');
} else if (justVystra.find((item) => item === revisedMoleculeSelectorValue)) {
   productBox1.classList.add('hidden');
   productBox2.classList.add('hidden');
   productBox3.classList.add('hidden');
   productBox4.classList.remove('hidden');
   productBox5.classList.add('hidden');
}
}


