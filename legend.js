//THE triangles legend is not working - need to fix this


export function showLegend(volume, device, colours) {
    const getLegend = document.querySelector('.legend-wrapper');
    const getPfsLegendBox = document.querySelector('.pfs-legend-box');
    const getDaijLegendBox = document.querySelector('.daij-legend-box');
    const getDpLegendBox = document.querySelector('.dp-legend-box');
    const getTriangleSquares = document.querySelectorAll('.triangles-square');
    const getYearThreePartSquare = document.querySelectorAll('.year-threepart-square');
    getYearThreePartSquare.forEach(square => square.classList.add('hidden'));
    getTriangleSquares.forEach(square => square.classList.remove('hidden'));
    const colour1 = colours.colour1;
    const colour2 = colours.colour2;
    const colour3 = colours.colour3;
    const colour4 = colours.colour4;
    const colour5 = colours.colour5;
    const colour6 = colours.colour6;
    // console.log(colour6);
    if (getLegend.classList.contains('hidden')) {
        getLegend.classList.remove('hidden');
    }
    if(device == "Pfs") {
        // getPfsLegendBox.classList.contains('hiding');
        getDaijLegendBox.classList.add('hidden');
        getDpLegendBox.classList.add('hidden');
        getPfsLegendBox.classList.remove('hidden');
 
 
    } else if (device == 'Daij') {
        getPfsLegendBox.classList.add('hidden');
        getDpLegendBox.classList.add('hidden');
        // getDaijLegendBox.classList.contains('hiding');
        getDaijLegendBox.classList.remove('hidden');
    } else if (device == 'Dp') {
        getPfsLegendBox.classList.add('hidden');
        getDaijLegendBox.classList.add('hidden');
       getDpLegendBox.classList.remove('hidden');
   
    } else if (device == 'pfsAndDaij') {
        getPfsLegendBox.classList.remove('hidden');
        getDaijLegendBox.classList.remove('hidden');
        getDpLegendBox.classList.add('hidden');
    } else if (device == 'pfsAndDp') {
        getPfsLegendBox.classList.remove('hidden');
        getDpLegendBox.classList.remove('hidden');
        getDaijLegendBox.classList.add('hidden');
    } else if (device == 'daijAndDp') {
        getDaijLegendBox.classList.remove('hidden');
        getDpLegendBox.classList.remove('hidden');
        getPfsLegendBox.classList.add('hidden');
    } else if (device == 'allThreeDevices') {
        getPfsLegendBox.classList.remove('hidden');
        getDaijLegendBox.classList.remove('hidden');
        getDpLegendBox.classList.remove('hidden');
        getYearThreePartSquare.forEach(square => square.classList.remove('hidden'));
        getTriangleSquares.forEach(square => square.classList.add('hidden'));
    }
    //This section needs changing now - cos there are more combinations??
    document.querySelector('.first-triangle-top-left').style.borderTopColor = volume.data.datasets[colour1].backgroundColor;
    document.querySelector('.first-triangle-top-left').style.borderRightColor = volume.data.datasets[colour2].backgroundColor;
   
    //Triangles - Year 2
    document.querySelector('.second-triangle-top-left').style.borderTopColor = volume.data.datasets[colour3].backgroundColor;
    document.querySelector('.second-triangle-top-left').style.borderRightColor = volume.data.datasets[colour4].backgroundColor;
   
    //Triangles - Year 3
    document.querySelector('.third-triangle-top-left').style.borderTopColor = volume.data.datasets[colour5].backgroundColor;
    document.querySelector('.third-triangle-top-left').style.borderRightColor = volume.data.datasets[colour6].backgroundColor;
 
 
 
 
 
 
 }
 
 
 export function hideLegend() {
    const getLegend = document.querySelector('.legend-wrapper');
    getLegend.classList.add('hidden');
   
 };
 
 
 export function inputStaticColoursIntoLegend(volume) {
    document.querySelector('.pfs-square-divider-1').style.backgroundColor = volume.data.datasets[0].backgroundColor;
  document.querySelector('.pfs-square-divider-2').style.backgroundColor = volume.data.datasets[3].backgroundColor;
  document.querySelector('.pfs-square-divider-3').style.backgroundColor = volume.data.datasets[6].backgroundColor;
 
 
  //Legend Box - with 3 colors for daij
  document.querySelector('.daij-square-divider-1').style.backgroundColor = volume.data.datasets[1].backgroundColor;
  document.querySelector('.daij-square-divider-2').style.backgroundColor = volume.data.datasets[4].backgroundColor;
  document.querySelector('.daij-square-divider-3').style.backgroundColor = volume.data.datasets[7].backgroundColor;
 
 
  //Legend Box - with 3 colors for dp
 
 
  document.querySelector('.dp-square-divider-1').style.backgroundColor = volume.data.datasets[2].backgroundColor;
  document.querySelector('.dp-square-divider-2').style.backgroundColor = volume.data.datasets[5].backgroundColor;
  document.querySelector('.dp-square-divider-3').style.backgroundColor = volume.data.datasets[8].backgroundColor;
 
 
  //Putting colours into the three-part legend year boxes
  document.querySelector('.year1-square-divider-1').style.backgroundColor = volume.data.datasets[0].backgroundColor;
  document.querySelector('.year1-square-divider-2').style.backgroundColor = volume.data.datasets[1].backgroundColor;
  document.querySelector('.year1-square-divider-3').style.backgroundColor = volume.data.datasets[2].backgroundColor;  
   document.querySelector('.year2-square-divider-1').style.backgroundColor = volume.data.datasets[3].backgroundColor;
  document.querySelector('.year2-square-divider-2').style.backgroundColor = volume.data.datasets[4].backgroundColor;
  document.querySelector('.year2-square-divider-3').style.backgroundColor = volume.data.datasets[5].backgroundColor;
   document.querySelector('.year3-square-divider-1').style.backgroundColor = volume.data.datasets[6].backgroundColor;
  document.querySelector('.year3-square-divider-2').style.backgroundColor = volume.data.datasets[7].backgroundColor;
  document.querySelector('.year3-square-divider-3').style.backgroundColor = volume.data.datasets[8].backgroundColor;    
   }
 
 