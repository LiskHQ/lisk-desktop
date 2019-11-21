import merge from 'lodash.merge';
import {
  typeLine,
  typeBar,
  typeDoughnut,
  chartStyles,
  colorPallete,
} from '../constants/chartConstants';


/**
 * data ONLY for Line chart
 * @param {object} data - More data that can be pass to the chart
 */
export const lineChartData = data => merge({
  datasets: (data.datasets).map((_, index) => ({
    backgroundColor: chartStyles.transparent,
    borderColor: colorPallete[index],
    pointBorderColor: colorPallete[index],
    pointBackgroundColor: chartStyles.whiteColor,
    pointHoverBackgroundColor: chartStyles.whiteColor,
    pointHoverBorderColor: colorPallete[index],
    pointHoverBorderWidth: 4,
    borderWidth: 2,
  })),
}, data);


/**
 * data ONLY for Bar chart
 * @param {object} data - More data that can be pass to the chart
 */
export const barChartData = data => merge({
  datasets: (data.datasets).map((_, index) => ({
    barPercentage: 1,
    categoryPercentage: 0.5,
    barThickness: 'flex',
    maxBarThickness: 14,
    minBarLength: 2,
    stack: index,
    backgroundColor: colorPallete[index],
  })),
}, data);


/**
 * data ONLY for Doughnut chart
 * @param {object} data - More data that can be pass to the chart
 */
export const doughnutChartData = data => merge({
  datasets: [
    {
      backgroundColor: colorPallete,
    },
  ],
}, data);


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


export const lineChartOptions = {
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
      radius: 2,
      hoverRadius: 2,
      hitRadius: 1,
    },
    line: {
      tension: 0,
    },
  },
};


export const barChartOptions = {
  scales: {
    xAxes: [{
      display: true,
      position: 'bottom',
      stacked: true,
      gridLines: {
        display: true,
        lineWidth: 0,
        zeroLineWidth: 1,
        drawTicks: false,
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
        lineWidth: 0,
        zeroLineWidth: 1,
        drawTicks: false,
      },
      ticks: {
        display: true,
        maxTicksLimit: 5,
        fontColor: chartStyles.slateGray,
        fontSize: chartStyles.fontSize,
        fontFamily: chartStyles.contentFontFamily,
        beginAtZero: true,
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
};


export const doughnutChartOptions = {
  cutoutPercentage: 60,

  elements: {
    arc: {
      backgroundColor: chartStyles.ultramarineBlue,
      borderAlign: 'center',
      borderColor: chartStyles.whiteColor,
      borderWidth: 1,
    },
  },
};

const typeOptions = {
  [typeLine]: lineChartOptions,
  [typeBar]: barChartOptions,
  [typeDoughnut]: doughnutChartOptions,
};

const typeData = {
  [typeLine]: lineChartData,
  [typeBar]: barChartData,
  [typeDoughnut]: doughnutChartData,
};

/**
 * Function that return the corresponding options object
 * based on the selected chart type.
 * @param {string} type - can be line, bar or doughnut
 * @param {object} options - More options that can be pass to the chart
 */
export const optionsByChart = (type, options) => merge(typeOptions[type], baseOptions, options);

/**
 * Function that return the corresponding data object
 * based on the selected chart type.
 * @param {string} type - can be line, bar or doughnut
 * @param {object} data - More data that can be pass to the chart
 */
export const dataByChart = (type, data) => typeData[type](data);


export default {
  dataByChart,
  optionsByChart,
};
