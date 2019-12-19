import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../../utils/theme';
import { CHART_TYPES } from '../../../constants/chartConstants';
import { dataByChart, optionsByChart } from '../../../utils/chartOptions';

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

Chart.propTypes = {
  type: PropTypes.oneOf(Object.keys(CHART_TYPES)),
  data: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  options: PropTypes.object,
  customOptions: PropTypes.object,
};

Chart.defaultProps = {
  type: 'line',
  options: {},
};

export default Chart;
