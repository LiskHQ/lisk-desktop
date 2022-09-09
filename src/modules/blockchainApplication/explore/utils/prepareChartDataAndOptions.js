const prepareChartDataAndOptions = (statistics, colorPalette, t) => {
  const doughnutChartData = {
    labels: [t('Registered'), t('Active'), t('Terminated')],
    datasets: [
      {
        backgroundColor: [colorPalette[1], colorPalette[0], colorPalette[2]],
        data: [statistics.registered, statistics.active, statistics.terminated],
      },
    ],
  };

  const doughnutChartOptions = {
    largeViewport: {
      cutoutPercentage: 70,
      legend: {
        display: true,
        position: 'left',
        align: 'start',
        labels: {
          padding: 20,
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
        },
      },
    },
    mediumViewport: {
      cutoutPercentage: 70,
      legend: {
        display: false,
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
        },
      },
    },
  };

  return { doughnutChartData, doughnutChartOptions };
};

export default prepareChartDataAndOptions;
