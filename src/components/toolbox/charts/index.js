import React from 'react';
import PropTypes from 'prop-types';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useTheme } from '@utils/theme';
import {
  lineChartData,
  barChartData,
  doughnutChartData,
  lineChartOptions,
  barChartOptions,
  doughnutChartOptions,
} from '@utils/chartOptions';

const propTypes = {
  data: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  options: PropTypes.object,
};

export const LineChart = ({
  data,
  width,
  height,
  options,
}) => (
  <Line
    data={lineChartData(data)}
    width={width}
    height={height}
    options={lineChartOptions(useTheme(), options)}
  />
);

export const BarChart = ({
  data,
  width,
  height,
  options,
}) => (
  <Bar
    data={barChartData(data)}
    width={width}
    height={height}
    options={barChartOptions(useTheme(), options)}
  />
);

export const DoughnutChart = ({
  data,
  width,
  height,
  options,
}) => (
  <Doughnut
    data={doughnutChartData(data)}
    width={width}
    height={height}
    options={doughnutChartOptions(useTheme(), options)}
  />
);

LineChart.propTypes = propTypes;
BarChart.propTypes = propTypes;
DoughnutChart.propTypes = propTypes;

export default {
  LineChart,
  BarChart,
  DoughnutChart,
};
