import merge from 'lodash.merge';
import {
  baseOptions,
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
  });

  describe('Options', () => {
    const extraOptions = {
      title: {
        display: true,
        text: 'Custom Chart Title',
      },
    };

    it('Options for LINE chart', () => {
      const options = optionsByChart('line', extraOptions, 'light');
      const expectedKeys = Object.keys(merge(lineChartOptions(), baseOptions(), extraOptions));
      expect(Object.keys(options)).toEqual(expectedKeys);
    });

    it('Options for BAR chart', () => {
      const options = optionsByChart('bar', extraOptions, 'light');
      const expectedKeys = Object.keys(merge(barChartOptions(), baseOptions(), extraOptions));
      expect(Object.keys(options)).toEqual(expectedKeys);
    });

    it('Options for DOUGGNUT chart', () => {
      const options = optionsByChart('doughnut', extraOptions, 'light');
      const expectedKeys = Object.keys(merge(doughnutChartOptions(), baseOptions(), extraOptions));
      expect(Object.keys(options)).toEqual(expectedKeys);
    });
  });
});
