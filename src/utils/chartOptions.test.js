import {
  lineChartOptions,
  barChartOptions,
  doughnutChartOptions,
  optionsByChart,
  lineChartData,
  barChartData,
  doughnutChartData,
  dataByChart,
} from './chartOptions';


describe('Chart Setting', () => {
  describe('Data', () => {
    const lineData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Oug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: '123456789L',
          data: [35, 55, 23, 67, 98, 46, 134, 66, 70, 33, 100, 120],
        },
      ],
    };

    const barData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Oug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: '123456789L',
          data: [35, 55, 23, 67, 98, 46, 134, 66, 70, 33, 100, 120],
        },
        {
          label: '987654321L',
          data: [10, 27, 30, 30, 80, 20, 100, 45, 138, 77, 88, 121],
        },
      ],
    };

    const dougjnutData = {
      labels: ['0 < 1', '1 < 100', '100 < 1K', '> 1K'],
      datasets: [
        {
          label: 'ABC',
          data: [100, 634, 329, 98],
        },
      ],
    };

    it('Data for LINE chart', () => {
      const options = dataByChart('line', lineData);
      const lineOptions = lineChartData(lineData);
      expect(options).toEqual(lineOptions);
    });

    it('Data for BAR chart', () => {
      const options = dataByChart('bar', barData);
      const barOptions = barChartData(barData);
      expect(options).toEqual(barOptions);
    });

    it('Data for DOUGGNUT chart', () => {
      const options = dataByChart('doughnut', dougjnutData);
      const doughnutOptions = doughnutChartData(dougjnutData);
      expect(options).toEqual(doughnutOptions);
    });

    it('invlid data', () => {
      const options = dataByChart('scatter', lineData);
      expect(options).toEqual([]);
    });
  });

  describe('Options', () => {
    const extaOptions = {
      title: {
        display: true,
        text: 'Custom Chart Title',
      },
    };

    it('Options for LINE chart', () => {
      const options = optionsByChart('line', extaOptions);
      const lineOptions = lineChartOptions(extaOptions);
      expect(options).toEqual(lineOptions);
    });

    it('Options for BAR chart', () => {
      const options = optionsByChart('bar', extaOptions);
      const barOptions = barChartOptions(extaOptions);
      expect(options).toEqual(barOptions);
    });

    it('Options for DOUGGNUT chart', () => {
      const options = optionsByChart('doughnut', extaOptions);
      const doughnutOptions = doughnutChartOptions(extaOptions);
      expect(options).toEqual(doughnutOptions);
    });

    it('invlid options', () => {
      const options = optionsByChart('scatter', extaOptions);
      expect(options).toEqual([]);
    });
  });
});
