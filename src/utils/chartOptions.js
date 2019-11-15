import merge from 'lodash.merge';
import { typeLine, typeBar, typeDoughnut } from '../constants/chartConstants';

/**
 * Base css styles for the charts
 */
export const styles = {
  borderColor: 'rgba(15, 126, 255, 0.5)',
  whiteColor: '#ffffff',
  platinumColor: '#e1e3eb',
  slateGray: '#70778b',
  maastrichtBlue: '#0c152e',
  ultramarineBlue: '#4070f4',
  contentFontFamily: '\'basier-circle\', sans-serif',
  fontSize: 13,
};

/**
 * Base chart options.
 * These options are in all the chart settings
 * that's why are pase of the base options settings
 */
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
      right: 20,
      top: 20,
      bottom: 10,
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

/**
 * Options ONLY for Line chart
 * @param {object} options - More options that can be pass to the chart
 */
export const lineGraphOptions = options => merge({
  scales: {
    xAxes: [{
      display: true,
      distribution: 'linear',
      gridLines: {
        display: false,
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
      gridLines: {
        display: true,
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
    point: {
      radius: 5,
      hoverRadius: 4,
      hitRadius: 10,
    },
    line: {
      tension: 0,
    },
  },
}, baseOptions, options);

/**
 * Options ONLY for Bar chart
 * @param {object} options - More options that can be pass to the chart
 */
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


/**
 * Options ONLY for Doughnut chart
 * @param {object} options - More options that can be pass to the chart
 */
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


/**
 * Function that return the corresponding options object
 * based on the selected chart type.
 * @param {string} type - can be line, bar or doughnut
 * @param {object} options - More options that can be pass to the chart
 */
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
