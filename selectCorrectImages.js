import { removeBracketsFromName } from "./Utilities";


const safetyDevice = [
   "Test",
   
];


const pens = [
   "Test",
];


const wearableDevice = [
   "Test",
];


//Product recommendations boxes info


const hypakOrNeopakPhysiojectAndUltrasafe = [
   "A CERTAIN RATIO",
   "ACDC",
   
];


const hypakOrNeopakPhysiojectAndVystra = [
   "BILLY IDOL",
   "PINK FLOYD",
   "PAUL SIMON",
];


const hypakOrNeopakAndPhysioject = [
   "BLACK SABBATH",
   "BLONDIE",
   "CAPTAIN BEEFHEART",
   "THE SMALL FACES",
   "PRODIGY",
];


const hypakOrNeopakAndUltrasafe = [
   "THE ROLLING STONES",
   "THE KINKS",
   "CAT STEVENS",
   "THE BEATLES",
  
];


const justHypakOrNeopak = [
   "LED ZEPPELIN",
   "THE CLASH",
];


const justVystra = [
   "THE BYRDS",
   "BEASTIE BOYS",
   "BIGAUDIO DYNAMITE",
   "ORBITAL",
  
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
      //  console.log('I am an autoinjector');
       deviceName = "Autoinjector";
       return deviceName;
   }
}


/////Product Opportunities
const productBox1 = document.querySelector('.medicine-container1'); //Spotify
const productBox2 = document.querySelector('.medicine-container2'); //Apple Music
const productBox3 = document.querySelector('.medicine-container3'); //Amazon Music
const productBox4 = document.querySelector('.medicine-container4'); //Youtube
const productBox5 = document.querySelector('.medicine-container5'); //Soundcloud


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


//Function to select correct medicine image based on value from the dropdown
export function selectCorrectMedicineImage() {
   const moleculeSelector = document.querySelector('.medicine-selector');
   const deviceNameWriting = document.querySelector('.device-name');
   const getMedicineSelectorValue = moleculeSelector.value;
   // console.log(moleculeSelector.value);
   const getMedicineImage = document.querySelector('.medicine-image-large');
    if(getMedicineSelectorValue.includes("(" || ")")) {
     const nameWithoutBrackets = removeBracketsFromName(getMedicineSelectorValue).toUpperCase();
     getMedicineImage.src = `/${nameWithoutBrackets}.jpg`
   const deviceName = photoOfWhatDevice(nameWithoutBrackets);
   // deviceNameWriting.textContent = deviceName;
 } else {
   getMedicineImage.src = `/${getMedicineSelectorValue}.jpg`
   const deviceName = photoOfWhatDevice(getMedicineSelectorValue);
   // deviceNameWriting.textContent = deviceName;
 }
  }

