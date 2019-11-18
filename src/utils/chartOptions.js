import merge from 'lodash.merge';
import {
  typeLine,
  typeBar,
  typeDoughnut,
  chartStyles,
  doughnutColorPallete,
} from '../constants/chartConstants';

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
      fontSize: chartStyles.fontSize,
      fontFamily: chartStyles.contentFontFamily,
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
    backgroundColor: chartStyles.whiteColor,
    bodyFontColor: chartStyles.maastrichtBlue,
    bodyFontFamily: chartStyles.contentFontFamily,
    bodyFontSize: 11,
    bodyFontStyle: 'bold',
    borderColor: chartStyles.platinumColor,
    borderWidth: 1,
    titleFontColor: chartStyles.slateGray,
    titleFontFamily: chartStyles.contentFontFamily,
    titleFontSize: chartStyles.fontSize,
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
export const lineChartOptions = options => merge({
  scales: {
    xAxes: [{
      display: true,
      distribution: 'linear',
      gridLines: {
        display: false,
      },
      ticks: {
        fontColor: chartStyles.slateGray,
        fontSize: chartStyles.fontSize,
        fontFamily: chartStyles.contentFontFamily,
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
        fontColor: chartStyles.slateGray,
        fontSize: chartStyles.fontSize,
        fontFamily: chartStyles.contentFontFamily,
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
export const barChartOptions = options => merge({
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
        fontColor: chartStyles.slateGray,
        fontSize: chartStyles.fontSize,
        fontFamily: chartStyles.contentFontFamily,
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
        fontColor: chartStyles.slateGray,
        fontSize: chartStyles.fontSize,
        fontFamily: chartStyles.contentFontFamily,
      },
    }],
  },

  elements: {
    rectangle: {
      backgroundColor: chartStyles.ultramarineBlue,
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
export const doughnutChartOptions = options => merge({
  cutoutPercentage: 60,

  elements: {
    arc: {
      backgroundColor: chartStyles.ultramarineBlue,
      borderAlign: 'center',
      borderColor: chartStyles.whiteColor,
      borderWidth: 1,
    },
  },
}, baseOptions, options);


/**
 * data ONLY for Line chart
 * @param {object} data - More data that can be pass to the chart
 */
export const lineChartData = data => merge({
  datasets: [
    {
      backgroundColor: chartStyles.transparent,
      borderColor: chartStyles.borderColor,
      pointBorderColor: chartStyles.borderColor,
      pointBackgroundColor: chartStyles.whiteColor,
      pointHoverBackgroundColor: chartStyles.whiteColor,
      pointHoverBorderColor: chartStyles.ultramarineBlue,
      pointHoverBorderWidth: 4,
      borderWidth: 2,
    },
  ],
}, data);


/**
 * data ONLY for Bar chart
 * @param {object} data - More data that can be pass to the chart
 */
export const barChartData = data => merge({
  datasets: [
    {
      barPercentage: 1,
      categoryPercentage: 0.5,
      barThickness: 'flex',
      maxBarThickness: 14,
      minBarLength: 0,
    },
    {
      barPercentage: 1,
      categoryPercentage: 0.5,
      barThickness: 'flex',
      maxBarThickness: 14,
      minBarLength: 0,
      stack: 'dob',
      backgroundColor: chartStyles.ufoGreen,
    },
  ],
}, data);


/**
 * data ONLY for Doughnut chart
 * @param {object} data - More data that can be pass to the chart
 */
export const doughnutChartData = data => merge({
  datasets: [
    {
      backgroundColor: doughnutColorPallete,
    },
  ],
}, data);


/**
 * Function that return the corresponding options object
 * based on the selected chart type.
 * @param {string} type - can be line, bar or doughnut
 * @param {object} options - More options that can be pass to the chart
 */
export const optionsByChart = (type, options) => {
  switch (type) {
    case typeLine: {
      return lineChartOptions(options);
    }

    case typeBar: {
      return barChartOptions(options);
    }

    case typeDoughnut: {
      return doughnutChartOptions(options);
    }

    default:
      return [];
  }
};


/**
 * Function that return the corresponding data object
 * based on the selected chart type.
 * @param {string} type - can be line, bar or doughnut
 * @param {object} data - More data that can be pass to the chart
 */
export const dataByChart = (type, data) => {
  switch (type) {
    case typeLine: {
      return lineChartData(data);
    }

    case typeBar: {
      return barChartData(data);
    }

    case typeDoughnut: {
      return doughnutChartData(data);
    }

    default:
      return [];
  }
};


export default {
  dataByChart,
  optionsByChart,
};
