import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = (props) => {
  const legend = {
    display: true,
    position: 'left',
    align: 'center',
    labels: {
      fontSize: 13,
      boxWidth: 3,
      usePointStyle: true,
    },
  };

  return (
    <Doughnut legend={legend} {...props} />
  );
};

export default DoughnutChart;
