import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../../utils/theme';
import { CHART_TYPES } from '../../../constants/chartConstants';
import {
  lineChartData,
  barChartData,
  doughnutChartData,
  lineChartOptions,
  barChartOptions,
  doughnutChartOptions,
} from '../../../utils/chartOptions';

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
}) => {
  const Graph = CHART_TYPES.line;
  const theme = useTheme();

  return (
    <Graph
      data={lineChartData(data)}
      width={width}
      height={height}
      options={lineChartOptions(theme, options)}
    />
  );
};

export const BarChart = ({
  data,
  width,
  height,
  options,
}) => {
  const Graph = CHART_TYPES.bar;
  const theme = useTheme();

  return (
    <Graph
      data={barChartData(data)}
      width={width}
      height={height}
      options={barChartOptions(theme, options)}
    />
  );
};

export const DoughnutChart = ({
  data,
  width,
  height,
  options,
}) => {
  const Graph = CHART_TYPES.doughnut;
  const theme = useTheme();

  return (
    <Graph
      data={doughnutChartData(data)}
      width={width}
      height={height}
      options={doughnutChartOptions(theme, options)}
    />
  );
};

LineChart.propTypes = propTypes;
BarChart.propTypes = propTypes;
DoughnutChart.propTypes = propTypes;

export default {
  LineChart,
  BarChart,
  DoughnutChart,
};
