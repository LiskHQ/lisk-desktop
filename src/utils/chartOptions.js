import lodashMerge from 'lodash.merge';
import {
  typeLine,
  typeBar,
  typeDoughnut,
  chartStyles,
  colorPallete,
} from '../constants/chartConstants';


const merge = (...args) => lodashMerge({}, ...args);

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


export const baseOptions = (theme = 'light') => ({
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
    callbacks: {
      // istanbul ignore next
      title(tooltipItem, data) { return data.labels[tooltipItem[0].index]; },
      // istanbul ignore next
      label(tooltipItem, data) { return data.datasets[0].data[tooltipItem.index]; },
    },
    mode: 'index',
    backgroundColor: chartStyles.backgroundColor[theme],
    bodyFontColor: chartStyles.textColor[theme],
    bodyFontFamily: chartStyles.contentFontFamily,
    bodyFontSize: 13,
    bodyFontStyle: 'normal',
    borderColor: chartStyles.borderColor[theme],
    borderWidth: 1,
    titleFontColor: chartStyles.titleColor[theme],
    titleFontFamily: chartStyles.contentFontFamily,
    titleFontSize: chartStyles.fontSize,
    titleFontStyle: 'bold',
    displayColors: false,
    xPadding: 10,
    yPadding: 10,
    titleMarginBottom: 10,
    cornerRadius: 3,
    caretSize: 10,
  },
});


export const lineChartOptions = () => ({
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
      hitRadius: 10,
    },
    line: {
      tension: 0,
    },
  },
});


export const barChartOptions = () => ({
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
});


export const doughnutChartOptions = (theme = 'light') => ({
  cutoutPercentage: 60,
  elements: {
    arc: {
      backgroundColor: chartStyles.backgroundColor[theme],
      borderColor: chartStyles.borderColor[theme],
      borderAlign: 'center',
      borderWidth: 1,
    },
  },
});

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
 * @param {string} theme - The global app theme: either dark or light
 */
export const optionsByChart = (type, options, theme) =>
  merge(typeOptions[type](theme), baseOptions(theme), options);

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
