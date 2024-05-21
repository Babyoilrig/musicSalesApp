//In this file I will move the annotations functionality




export function showAnnotations(chart, metric, yMinValues, yMaxValues, cagrValues, initialStartingValues) {
  const initialValuesArray = Object.values(initialStartingValues);


let xMinValue1;
let xMinValue2;
let xMinValue3;
let xMinValue4;
let xMinValues = [];


findXMinValues(metric, initialValuesArray);


  function findXMinValues(metric, initialValuesArray) {
    if (metric === "volume") {
    if(initialValuesArray[0] === 0) {
      xMinValue1 = -0.1;
    } else {
      xMinValue1 = -0.4;
    }


    if(initialValuesArray[1] === 0) {
      xMinValue2 = 0.9;
    } else {
    xMinValue2 = 0.6;
    }


    if(initialValuesArray[2] === 0) {
      xMinValue3 = 1.9;
    } else {
      xMinValue3 = 1.6;
    }


    if(initialValuesArray[3] === 0) {
      xMinValue4 = 2.9;
  } else {
      xMinValue4 = 2.6;
  }
   
    xMinValues.push(xMinValue1, xMinValue2, xMinValue3, xMinValue4);
  } else if (metric === "value" || metric === "asp") {
    xMinValue1 = -0.4;
    xMinValue2 = 0.6;
    xMinValue3 = 1.6;
    xMinValue4 = 2.6;
    xMinValues.push(xMinValue1, xMinValue2, xMinValue3, xMinValue4);
  }
  return xMinValues;
  }


  // console.log(xMinValues);
  const keyArray = ["aaa", "europe", "latinAmerica", "northAmerica"];
  let xMinValuesWithKeys = {};
  keyArray.forEach((key, i) => xMinValuesWithKeys[key] = xMinValues[i]);


  
  if (cagrValues.aaa === 0) {
    chart.options.plugins.annotation.annotations[`aaaAnnotation`] = {
      type: 'line',
      xMin: -0.4,
      xMax: 0.4,
      yMin: yMinValues.aaa,
      yMax: yMaxValues.aaa,
      backgroundColor: 'red',
      borderColor: 'red',
      borderWidth: 3,
      display: false,
      label: {
        content: `${cagrValues.aaa}%`,
        display: false,
        color: 'black',
          backgroundColor: 'rgba(255,255,255,0.6)',
          borderColor: '#000000',
          padding: 0,
          yAdjust: -2,
          font: {
            size: 12
          }
         
      }
    }
  } else {
    chart.options.plugins.annotation.annotations[`aaaAnnotation`] = {
      type: 'line',
      xMin: xMinValuesWithKeys.aaa,
      xMax: 0.4,
      yMin: yMinValues.aaa,
      yMax: yMaxValues.aaa,
      backgroundColor: 'red',
      borderColor: 'red',
      borderWidth: 3,
      display: true,
      label: {
        content: `${cagrValues.aaa}%`,
        display: true,
        color: 'black',
          backgroundColor: 'rgba(255,255,255,0.6)',
          borderColor: '#000000',
          padding: 0,
          yAdjust: -2,
          font: {
            size: 12
          }
         
      }
    }
  }
    if (cagrValues.europe === 0) {
      chart.options.plugins.annotation.annotations[`europeAnnotation`] = {
        type: 'line',
        xMin: 0.6,
        xMax: 1.4,
        yMin: yMinValues.europe,
        yMax: yMaxValues.europe,


        borderColor: 'red',
        borderWidth: 3,
        display: false,
        label: {
          content: `${cagrValues.europe}%`,
          display: false,
          color: 'black',
          backgroundColor: 'rgba(255,255,255,0.6)',
          padding: 0,
          yAdjust: -2,
          font: {
            size: 12
          }
        }
      }
    } else {
      chart.options.plugins.annotation.annotations[`europeAnnotation`] = {
        type: 'line',
        xMin: xMinValuesWithKeys.europe,
        xMax: 1.4,
        yMin: yMinValues.europe,
        yMax: yMaxValues.europe,


        borderColor: 'red',
        borderWidth: 3,
        display: true,
        label: {
          content: `${cagrValues.europe}%`,
          display: true,
          color: 'black',
          backgroundColor: 'rgba(255,255,255,0.6)',
          padding: 0,
          yAdjust: -2,
          font: {
            size: 12
          }
        }
      }
    }
    if (cagrValues.latinAmerica === 0) {
      chart.options.plugins.annotation.annotations[`latinAmericaAnnotation`] = {
        type: 'line',
        xMin: 1.6,
        xMax: 2.4,
        yMin: yMinValues.latinAmerica,
        yMax: yMaxValues.latinAmerica,


        borderColor: 'red',
        borderWidth: 3,
        display: false,
        label: {
          content: `${cagrValues.latinAmerica}%`,
          display: false,
          color: 'black',
          backgroundColor: 'rgba(255,255,255,0.6)',
          padding: 0,
          yAdjust: -2,
          font: {
            size: 12
          }
        }
    }
  } else {
    chart.options.plugins.annotation.annotations[`latinAmericaAnnotation`] = {
      type: 'line',
      xMin: xMinValuesWithKeys.latinAmerica,
      xMax: 2.4,
      yMin: yMinValues.latinAmerica,
      yMax: yMaxValues.latinAmerica,


      borderColor: 'red',
      borderWidth: 3,
      display: true,
      label: {
        content: `${cagrValues.latinAmerica}%`,
        display: true,
        color: 'black',
        backgroundColor: 'rgba(255,255,255,0.6)',
        padding: 0,
        yAdjust: -2,
        font: {
          size: 12
        }
      }
    }
  }
      if (cagrValues.northAmerica === 0) {
        chart.options.plugins.annotation.annotations[`northAmericaAnnotation`] = {
          type: 'line',
          xMin: 2.6,
          xMax: 3.4,
          yMin: yMinValues.northAmerica,
          yMax: yMaxValues.northAmerica,
           borderColor: 'red',
          borderWidth: 3,
          display: false,
          label: {
            content: `${cagrValues.northAmerica}%`,
            display: false,
            color: 'black',
            backgroundColor: 'rgba(255,255,255,0.6)',
            padding: 0,
            yAdjust: -2,
            font: {
              size: 12
            }
          }
        }
      } else {
        chart.options.plugins.annotation.annotations[`northAmericaAnnotation`] = {
          type: 'line',
          xMin: xMinValuesWithKeys.northAmerica,
          xMax: 3.4,
          yMin: yMinValues.northAmerica,
          yMax: yMaxValues.northAmerica,
           borderColor: 'red',
          borderWidth: 3,
          display: true,
          label: {
            content: `${cagrValues.northAmerica}%`,
            display: true,
            color: 'black',
            backgroundColor: 'rgba(255,255,255,0.6)',
            padding: 0,
            yAdjust: -2,
            font: {
              size: 12
            }
          }
        }
      }


     
      chart.update();
  }


  //Hide annotations function


  export function hideAnnotations(chart) {
    //Code below adds each trendline to the graph one at a time


    chart.options.plugins.annotation.annotations[`aaaAnnotation`] = {
      type: 'line',
      xMin: -0.4,
      xMax: 0.4,
      yMin: 0.4,
      yMax: 0.4,
      backgroundColor: 'red',
      borderColor: 'red',
      borderWidth: 4,
      display: false,
    },
      chart.options.plugins.annotation.annotations[`europeAnnotation`] = {
        type: 'line',
        xMin: 0.6,
        xMax: 1.4,
        yMin: 0.4,
        yMax: 0.4,


        borderColor: 'red',
        borderWidth: 4,
        display: false,
      },
      chart.options.plugins.annotation.annotations[`latinAmericaAnnotation`] = {
        type: 'line',
        xMin: 1.6,
        xMax: 2.4,
        yMin: 0.4,
        yMax: 0.4,


        borderColor: 'red',
        borderWidth: 4,
        display: false,
      },
      chart.options.plugins.annotation.annotations[`northAmericaAnnotation`] = {
        type: 'line',
        xMin: 2.6,
        xMax: 3.4,
        yMin: 0.4,
        yMax: 0.4,


        borderColor: 'red',
        borderWidth: 4,
        display: false,
      },
      chart.update();
  }



