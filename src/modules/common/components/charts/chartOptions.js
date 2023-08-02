import lodashMerge from 'lodash.merge';
import {
  chartStyles,
  colorPalette,
  colorPaletteDark,
} from 'src/modules/common/components/charts/chartConfig';

const merge = (...args) => lodashMerge({}, ...args);

/**
 * data ONLY for Line chart
 */
export const lineChartData = (data) =>
  merge(
    {
      datasets: data.datasets.map((_, index) => ({
        backgroundColor: chartStyles.transparent,
        borderColor: colorPalette[index],
        pointBorderColor: colorPalette[index],
        pointBackgroundColor: chartStyles.whiteColor,
        pointHoverBackgroundColor: chartStyles.whiteColor,
        pointHoverBorderColor: colorPalette[index],
        pointHoverBorderWidth: 4,
        borderWidth: 2,
      })),
    },
    data
  );

/**
 * data ONLY for Bar chart
 */
export const barChartData = (data) =>
  merge(
    {
      datasets: data.datasets.map((_, index) => ({
        barPercentage: 1,
        categoryPercentage: 0.5,
        barThickness: 'flex',
        maxBarThickness: 14,
        minBarLength: 2,
        stack: index,
        backgroundColor: colorPalette[index],
      })),
    },
    data
  );

/**
 * data ONLY for Doughnut chart
 */
export const doughnutChartData = (data, theme) =>
  merge(
    {
      datasets: [
        {
          backgroundColor: theme === 'light' ? colorPalette : colorPaletteDark,
        },
      ],
    },
    data
  );

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

export const lineChartOptions = (theme, options) =>
  merge(
    {
      scales: {
        xAxes: [
          {
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
          },
        ],
        yAxes: [
          {
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
          },
        ],
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
    },
    baseOptions(theme),
    options
  );

export const barChartOptions = (theme, options) =>
  merge(
    {
      scales: {
        xAxes: [
          {
            display: true,
            position: 'bottom',
            stacked: true,
            gridLines: {
              display: false,
              offsetGridLines: true,
              zeroLineColor: chartStyles.borderColor[theme],
            },
            ticks: {
              fontColor: chartStyles.slateGray,
              fontSize: chartStyles.fontSize,
              fontFamily: chartStyles.contentFontFamily,
              maxRotation: 0,
            },
          },
        ],
        yAxes: [
          {
            display: true,
            position: 'left',
            stacked: true,
            gridLines: {
              display: true,
              offsetGridLines: true,
              zeroLineColor: chartStyles.borderColor[theme],
            },
            ticks: {
              display: true,
              maxTicksLimit: 5,
              fontColor: chartStyles.slateGray,
              fontSize: chartStyles.fontSize,
              fontFamily: chartStyles.contentFontFamily,
              beginAtZero: true,
            },
          },
        ],
      },
      elements: {
        rectangle: {
          backgroundColor: chartStyles.ultramarineBlue,
          borderWidth: '0',
          borderColor: '',
          borderSkipped: 'bottom',
        },
      },
    },
    baseOptions(theme),
    options
  );

export const doughnutChartOptions = (theme, options) =>
  merge(
    {
      cutoutPercentage: 60,
      elements: {
        arc: {
          backgroundColor: chartStyles.backgroundColor[theme],
          borderColor: chartStyles.borderColor[theme],
          borderAlign: 'center',
          borderWidth: 1,
        },
      },
    },
    baseOptions(theme),
    options
  );

export const getColorPalette = (theme) => {
  if (theme === 'dark') return colorPaletteDark;
  return colorPalette;
};
