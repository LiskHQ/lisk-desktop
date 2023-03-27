import prepareChartDataAndOptions from './prepareChartDataAndOptions';

describe('BlockchainApplication explore utils', () => {
  it('Should return correct data when calling prepareChartDataAndOptions', () => {
    const statistics = {
      registered: 101,
      active: 53,
      terminated: 9,
      totalSupplyLSK: '5000000',
      stakedLSK: '3000000',
    };
    const colorPalette = ['green', 'blue', 'grey'];
    const t = (l) => l;
    const { doughnutChartData, doughnutChartOptions } = prepareChartDataAndOptions(
      statistics,
      colorPalette,
      t
    );

    expect(doughnutChartData).toEqual({
      labels: ['Registered', 'Active', 'Terminated'],
      datasets: [
        {
          backgroundColor: ['blue', 'green', 'grey'],
          data: [statistics.registered, statistics.active, statistics.terminated],
        },
      ],
    });
    expect(doughnutChartOptions).toEqual({
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
    });
  });
});
