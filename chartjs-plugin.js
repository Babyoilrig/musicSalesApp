
//This plugin creates a watermark behind each graph saying the data is confidential. 
//This is currently disabled - but can be turned back on if necessary,
const waterMarkPlugin = {
    id: 'waterMark',
    afterDatasetsDraw: (chart) => {
        const {ctx, chartArea: {top, left, width, height} } = chart;
        const getWatermark = document.getElementById('waterMark');
        if (getWatermark) {
            return;
        } else {
            const watermarkImg = new Image();
        watermarkImg.src = '/black-20-percent.png';
        ctx.drawImage(watermarkImg, left, top, width, height)
        }
   
    }
 }
 
 
 export default waterMarkPlugin;
 
 