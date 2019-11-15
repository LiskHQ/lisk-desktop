import merge from 'lodash.merge';
import { typeLine, typeBar, typeDoughnut } from './constants';

// ========================================= //
//                                GRAPHS STYLES                                  //
// ========================================= //
const styles = {
  borderColor: 'rgba(15, 126, 255, 0.5)',
  whiteColor: '#ffffff',
  platinumColor: '#e1e3eb',
  slateGray: '#70778b',
  maastrichtBlue: '#0c152e',
  ultramarineBlue: '#4070f4',
  contentFontFamily: '\'basier-circle\', sans-serif',
  fontSize: 13,
};

// ========================================= //
//                              BASE OPTIONS                                      //
// ========================================= //
const baseOptions = {
  maintainAspectRatio: false,

  legend: {
    display: true,
    position: 'left',
    align: 'center',
    fullWidth: true,
    labels: {
      boxWidth: 8,
      fontSize: styles.fontSize,
      fontFamily: styles.contentFontFamily,
      usePointStyle: true,
    },
  },

  layout: {
    padding: {
      left: 20,
      right: 8,
      top: 20,
      bottom: 8,
    },
  },

  tooltips: {
    enabled: true,
    mode: 'index',
    backgroundColor: styles.whiteColor,
    bodyFontColor: styles.maastrichtBlue,
    bodyFontFamily: styles.contentFontFamily,
    bodyFontSize: 11,
    bodyFontStyle: 'bold',
    borderColor: styles.platinumColor,
    borderWidth: 1,
    titleFontColor: styles.slateGray,
    titleFontFamily: styles.contentFontFamily,
    titleFontSize: styles.fontSize,
    titleFontStyle: 'semi-bold',
    displayColors: false,
    xPadding: 10,
    yPadding: 10,
    titleMarginBottom: 10,
    cornerRadius: 3,
    caretSize: 10,
  },
};

// ========================================= //
//                                LINE GRAPH                                         //
// ========================================= //
export const lineGraphOptions = options => merge({
  scales: {
    xAxes: [{
      display: true,
      distribution: 'linear',
      gridLines: {
        display: true,
      },
      ticks: {
        fontColor: styles.slateGray,
        fontSize: styles.fontSize,
        fontFamily: styles.contentFontFamily,
        maxRotation: 0,
      },
    }],

    yAxes: [{
      position: 'left',
      type: 'linear',
      ticks: {
        display: true,
        maxTicksLimit: 5,
        fontColor: styles.slateGray,
        fontSize: styles.fontSize,
        fontFamily: styles.contentFontFamily,
      },
    }],
  },

  elements: {
    point: {
      radius: 2,
      hoverRadius: 4,
      hitRadius: 10,
    },
    line: {
      tension: 0,
    },
  },
}, baseOptions, options);

// ========================================= //
//                                BAR GRAPH                                         //
// ========================================= //
export const barGraphOptions = options => merge({
  scales: {
    xAxes: [{
      display: true,
      position: 'bottom',
      stacked: true,
      gridLines: {
        display: false,
        offsetGridLines: true,
      },
      ticks: {
        fontColor: styles.slateGray,
        fontSize: styles.fontSize,
        fontFamily: styles.contentFontFamily,
        maxRotation: 0,
      },
    }],

    yAxes: [{
      display: true,
      position: 'left',
      stacked: true,
      gridLines: {
        display: true,
        offsetGridLines: true,
      },
      ticks: {
        display: true,
        maxTicksLimit: 5,
        fontColor: styles.slateGray,
        fontSize: styles.fontSize,
        fontFamily: styles.contentFontFamily,
      },
    }],
  },

  elements: {
    rectangle: {
      backgroundColor: styles.ultramarineBlue,
      borderWidth: '0',
      borderColor: '',
      borderSkipped: 'bottom',
    },
  },
}, baseOptions, options);


// ========================================= //
//                            DOUGGNUT GRAPH                                 //
// ========================================= //
export const doughnutGraphOptions = options => merge({
  cutoutPercentage: 60,

  elements: {
    arc: {
      backgroundColor: styles.ultramarineBlue,
      borderAlign: 'center',
      borderColor: styles.whiteColor,
      borderWidth: 1,
    },
  },
}, baseOptions, options);


// ========================================= //
//                            GRAPHIC OPTIONS                                   //
// ========================================= //
export const optionsByGraphic = (type, options) => {
  switch (type) {
    case typeLine: {
      return lineGraphOptions(options);
    }

    // istanbul ignore next
    case typeBar: {
      return barGraphOptions(options);
    }

    // istanbul ignore next
    case typeDoughnut: {
      return doughnutGraphOptions(options);
    }

    default:
      return [];
  }
};

export default {
  optionsByGraphic,
};
