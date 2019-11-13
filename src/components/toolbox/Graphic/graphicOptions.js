import merge from 'lodash.merge';
import { typeLine, typeBar, typeDoughnut } from './constants';

const styles = {
  borderColor: 'rgba(15, 126, 255, 0.5)',
  whiteColor: '#ffffff',
  platinumColor: '#e1e3eb',
  slateGray: '#70778b',
  whiteSmoke: '#f5f7fa80',
  maastrichtBlue: '#0c152e',
  ultramarineBlue: '#4070f4',
  contentFontFamily: '\'basier-circle\', sans-serif',
  fontSize: 13,
};

// ========================================= //
//                                LINE GRAPH                                         //
// ========================================= //
const lineGraphOptions = options => merge({
  maintainAspectRatio: false,

  legend: {
    display: true,
  },

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

  layout: {
    padding: {
      left: 20,
      right: 8,
      top: 20,
      bottom: 8,
    },
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

  tooltips: {
    enabled: true,
    mode: 'index',
    backgroundColor: styles.whiteColor,
    bodyFontColor: styles.maastrichtBlue,
    bodyFontFamily: styles.contentFontFamily,
    bodyFontSize: 13,
    bodyFontStyle: 'bold',
    borderColor: styles.platinumColor,
    borderWidth: 1,
    titleFontColor: styles.slateGray,
    titleFontFamily: styles.contentFontFamily,
    titleFontSize: 11,
    titleFontStyle: 'semi-bold',
    displayColors: false,
    xPadding: 20,
    yPadding: 20,
    titleMarginBottom: 12,
    cornerRadius: 0,
    caretSize: 15,
  },
}, options);

// ========================================= //
//                                BAR GRAPH                                         //
// ========================================= //
const barGraphOptions = options => merge({}, options);


// ========================================= //
//                            DOUGGNUT GRAPH                                 //
// ========================================= //
const doughnutGraphOptions = options => merge({}, options);


// ========================================= //
//                            GRAPHIC OPTIONS                                   //
// ========================================= //
export const optionsByGraphic = (type, options) => {
  switch (type) {
    case typeLine: {
      return lineGraphOptions(options);
    }

    case typeBar: {
      return barGraphOptions(options);
    }

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
