import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = (props) => {
  const legend = {
    display: true,
    position: 'left',
      onClick: () => undefined,
    labels: {
        padding: 16,
      fontSize: 13,
      boxWidth: 3,
      usePointStyle: true,
    },
  };

    const data = {
      ...this.props.data,
      datasets: [
        {
          ...this.props.data.datasets[0],
          borderWidth: 0,
        }],
    };

    const options = {
      cutoutPercentage: 65,
    };

  return (
    <Doughnut legend={legend} {...props} />
  );
};

export default DoughnutChart;
