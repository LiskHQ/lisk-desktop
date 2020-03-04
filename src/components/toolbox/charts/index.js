import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../../utils/theme';
import { CHART_TYPES } from '../../../constants/chartConstants';
import { dataByChart, optionsByChart } from '../../../utils/chartOptions';

const propTypes = {
  data: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  options: PropTypes.object,
};

const Chart = ({
  type,
  data,
  width,
  height,
  options,
}) => {
  const Graph = CHART_TYPES[type];
  const theme = useTheme();

  return (
    <Graph
      data={dataByChart(type, data)}
      width={width}
      height={height}
      options={optionsByChart(type, options, theme)}
    />
  );
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
      data={dataByChart('line', data)}
      width={width}
      height={height}
      options={optionsByChart('line', options, theme)}
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
      data={dataByChart('bar', data)}
      width={width}
      height={height}
      options={optionsByChart('bar', options, theme)}
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
      data={dataByChart('doughnut', data)}
      width={width}
      height={height}
      options={optionsByChart('doughnut', options, theme)}
    />
  );
};

LineChart.propTypes = propTypes;
BarChart.propTypes = propTypes;
DoughnutChart.propTypes = propTypes;
Chart.propTypes = { ...propTypes, type: PropTypes.oneOf(Object.keys(CHART_TYPES)) };

export default {
  LineChart,
  BarChart,
  DoughnutChart,
  Chart,
};
